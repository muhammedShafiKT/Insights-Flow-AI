import { PutObjectCommand,GetObjectCommand,DeleteObjectCommand,HeadObjectCommand,ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import r2Client from "../../config/r2.js";
import crypto from "crypto"
import path from "path"
import { detect } from "chardet";
import { decode } from "iconv-lite";

const BUCKET = process.env.R2_BUCKET_NAME

function buildKey (userId,originalName){
const ext = path.extname(originalName).toLowerCase()
const safebase=path.basename(originalName,ext).replace(/[^a-zA-Z0-9-_]/g,"_").slice(0,50)
const uniqueid = crypto.randomUUID()
const timestamp=Date.now()
return `datasets/${userId}/${timestamp}-${uniqueid}-${safebase}${ext}`
}
function normalizeToUtf8(fileBuffer, mimetype) {
  const isCSV = mimetype === "text/csv" || mimetype === "application/csv";
  if (!isCSV) return fileBuffer;

  const detected = detect(fileBuffer);
  console.log(`[r2Storage] Detected encoding: ${detected}, mimetype: ${mimetype}`); // <-- add this

  if (!detected || detected === "UTF-8") return fileBuffer;

  console.log(`[r2Storage] Re-encoding CSV from ${detected} → UTF-8`);
  const decoded = decode(fileBuffer, detected);
  return Buffer.from(decoded, "utf8");
}
export async function uploadtoR2(fileBuffer, userId, originalName, mimetype) {
    const key = buildKey(userId, originalName)
    const normalizedBuffer = normalizeToUtf8(fileBuffer,mimetype)
    try {
        await r2Client.send(
            new PutObjectCommand({
                Bucket: BUCKET,
                Key: key,
                Body: normalizedBuffer,
                ContentType: mimetype,
                Metadata: {
                    "original-name": originalName,
                    "uploaded-by": userId.toString()
                }
            })
        )
        return { key, size: normalizedBuffer.length }
    } catch (err) {
        console.error("R2 upload failed FULL ERROR:", JSON.stringify(err, null, 2));  // <-- change this line
        console.error("R2 upload failed MESSAGE:", err.message);
        console.error("R2 upload failed CODE:", err.Code || err.code);
        throw new Error("Failed to upload file to storage");
    }
}

export async function getSignedDownloadUrl(key,expiresInseconds=3600) {
    try {
        const command = new GetObjectCommand({Bucket:BUCKET,Key:key})
        return await getSignedUrl(r2Client,command,{expiresIn:expiresInseconds})
    } catch (err) {
        console.error("Signed URL generation failed:", err);
    throw new Error("Failed to generate file access link");
    }
}

export async function getFilemetadata(key) {
try {
    const result = await r2Client.send(
        new HeadObjectCommand({Bucket:BUCKET,Key:key})
    )
    return {
        size :result.ContentLength,
        contentType : result.contentType,
        lastmodified : result.LastModified 
    }
} catch (err) {
    if(err.name==="NotFound")return null
    throw err
}    
}

export async function deleteFromR2(key) {
try {
    const result = await r2Client.send(
        new DeleteObjectCommand({Bucket:BUCKET,Key:key})
    )
    return true
} catch (err) {
    console.error("R2 deleted failed:",err)
    throw new Error("Failed to delete file from storage");
}    
}

export async function deleteManyFromR2(keys) {
try {
    const results = await Promise.allSettled(keys.map((k)=>deleteFromR2(k)))
    const failed = results
    .map((r, i) => (r.status === "rejected" ? keys[i] : null))
    .filter(Boolean);
  return { deleted: keys.length - failed.length, failed };
} catch (err) {
    console.error("R2 deleted failed:",err)
    throw new Error("Failed to delete file from storage");
}    
}

export async function listUserFiles(userId) {
    const result = await r2Client.send(
        new ListObjectsV2Command({
            Bucket:BUCKET,
            Prefix:`datasets/${userId}/`
        })
    )
    return result.Contents || []
}

export async function downloadFromR2(key) {
  try {
    const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    const response = await r2Client.send(command);

    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  } catch (err) {
    console.error("R2 download failed:", err);
    throw new Error("Failed to download file from storage");
  }
}