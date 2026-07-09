import { Worker } from "bullmq";
import { connection } from "../connection.js";
import mongoose from "mongoose";
import { chatService } from "../../modules/chat/chat.service.js"; 
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
    const { datasetId, question, history } = job.data;
    return await chatService.processQuestion({ datasetId, question, history });
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