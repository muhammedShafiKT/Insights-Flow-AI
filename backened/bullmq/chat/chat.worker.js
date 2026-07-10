import { Worker } from "bullmq";
import { emitter } from "../emitter.js";
import { connection } from "../connection.js";
import mongoose from "mongoose";
import { chatService } from "../../modules/chat/chat.service.js";
import Conversation from "../../modules/conversation/conversation.model.js";
import JobModel from "../Job.model.js";
import { createloggerforworkers } from "../../modules/utils/createloggerforworkers.js";

const logger = createloggerforworkers("chat-worker")

try {
  await mongoose.connect(process.env.MONGO_URL);
  logger()
  console.log("Chat worker connected to MongoDB");
} catch (err) {
  console.error("Chat worker MongoDB connection error:", err);
}

const worker = new Worker(
  "chat-processing",
  async (job) => {
    const { jobId, datasetId, question, history, userId } = job.data;

    // console.log("CHAT WORKER job.id (bullmq):", job.id, "| jobId (mongo, used for emits):", jobId);
    // console.log("CHAT WORKER emitting to room:", `user:${userId}`, typeof userId);

    try {
      await JobModel.findByIdAndUpdate(jobId, { status: "active", progress: 10 });
      emitter.to(`user:${userId}`).emit("chat:progress", {
        jobId, // Mongo _id — matches frontend pendingJobIdRef
        status: "active",
        datasetId,
      });

      const result = await chatService.processQuestion({ datasetId, question, history });

      await Conversation.findOneAndUpdate(
        { userId, datasetId },
        { $push: { messages: { role: "assistant", content: result.answer } } },
        { new: true }
      );

      await JobModel.findByIdAndUpdate(jobId, { status: "completed", progress: 100 });

      emitter.to(`user:${userId}`).emit("chat:progress", {
        jobId, // Mongo _id
        status: "completed",
        datasetId,
        result,
      });

      return result;
    } catch (error) {
      await JobModel.findByIdAndUpdate(jobId, { status: "failed", error: error.message });

      emitter.to(`user:${userId}`).emit("chat:progress", {
        jobId, // Mongo _id
        status: "failed",
        datasetId,
        error: error.message,
      });
      throw error;
    }
  },
  {
    connection,
    concurrency: 3,
    limiter: {
      max: 5,
      duration: 1000,
    },
  }
);

worker.on("completed", (job) => console.log(`✅ Chat job ${job.id} completed`));
worker.on("failed", (job, err) => console.error(`❌ Chat job ${job.id} failed:`, err.message));

console.log("Chat worker running...");