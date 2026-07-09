import { Worker } from "bullmq"
import JobModel from "../Job.model.js";
import { emitter } from "../emitter.js";
// import { datasetuploadQueue } from "./datasetuploadQueue.js";
import { connection } from "../connection.js"
import mongoose from "mongoose";
import { downloadFromR2 } from "../../modules/datasets/r2Storage.service.js";
import { Dataparser, ExtractMetadata } from "../../modules/datasets/datasetParser.service.js";
import { extractColumns } from "../../services/profiling/extractColumns.js";
import { generateProfile } from "../../services/profiling/generateProfile.js";
import { validateProfile } from "../../services/validation/profileValidator.js";
import { generateCandidates } from "../../services/rules/generateCandidates.js";
import datasetModel from "../../modules/datasets/dataset.model.js";
import { createloggerforworkers } from "../../modules/utils/createloggerforworkers.js";

const logger = createloggerforworkers("dataset-worker")
try {
  await mongoose.connect(process.env.MONGO_URL);
    logger()
  console.log("Dataset Worker connected to MongoDB");
} catch (err) {
  console.error("Worker MongoDB connection error:", err);
}

const worker = new Worker("dataset-uploader",
  async (job) => {
    const { jobId, userId, r2Key, sizeBytes, originalName, fileType } = job.data
    try {
      await JobModel.findByIdAndUpdate(jobId, { status: "active", progress: 10 })
      console.log("WORKER emitting to room:", `user:${userId}`, typeof userId)
      emitter.to(`user:${userId}`).emit("job:progress",{jobId,progress : 10 ,status : "active"})
      const buffer = await downloadFromR2(r2Key)
      await JobModel.findByIdAndUpdate(jobId, { status: "active", progress: 30 })
      emitter.to(`user:${userId}`).emit("job:progress",{jobId,progress : 30 ,status : "active"})
      const { rows, headerRowIndex } = Dataparser(buffer, fileType);
      if (!rows.length) {
        throw new Error("Dataset contains no rows")
      }
      const columns = extractColumns(rows);
      // console.log(columns)
      const profile = generateProfile(columns);
      // console.log(profile)
      const validation = validateProfile(profile)
      // console.log("validation :",validation)
      const candidates = generateCandidates(validation, profile)


      const metadata = ExtractMetadata(rows);
      await JobModel.findByIdAndUpdate(jobId, { status: "active", progress: 60 })
      emitter.to(`user:${userId}`).emit("job:progress",{jobId,progress : 60 ,status : "active"})

        const dataset = await datasetModel.create({
          userId,
          originalName,
          r2Key,
          fileType,
          sizeBytes,
          rowCount: metadata.rowCount,
          columnCount: metadata.columnCount,
          columns: metadata.columns,
          candidates,
          skipRows :headerRowIndex ,
          previewRows: rows.slice(0, 10),
          // dashboard,
          status: "uploaded",
        });

        await JobModel.findByIdAndUpdate(jobId, { status: "completed", progress: 100 , resultId : dataset._id })
        emitter.to(`user:${userId}`).emit("job:progress",{jobId,progress : 100 ,status : "completed" , resultId :dataset._id})
    } catch (error) {
      await JobModel.findByIdAndUpdate(jobId, { status: "failed", error : error.message })
      emitter.to(`user:${userId}`).emit("job:progress",{jobId,status : "failed" , error :error.message})
      throw error
    }
  }, { connection })

worker.on("completed", (job) => console.log(`✅ Dataset upload job ${job.id} completed`));
worker.on("failed", (job, err) => console.error(`❌ Dataset upload job ${job.id} failed:`, err.message))
