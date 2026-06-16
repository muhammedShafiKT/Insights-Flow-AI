import dotenv from "dotenv";
dotenv.config();
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const r2Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function test() {
  try {
    const result = await r2Client.send(
      new ListObjectsV2Command({ Bucket: process.env.R2_BUCKET_NAME })
    );
    console.log("✅ R2 connection successful");
    console.log("Bucket contents:", result.Contents || "(empty bucket)");
  } catch (err) {
    console.error("❌ R2 connection failed:", err.message);
  }
}

test();