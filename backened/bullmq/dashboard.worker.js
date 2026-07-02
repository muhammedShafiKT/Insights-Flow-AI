// bullmq/dashboard.worker.js
import { Worker } from "bullmq";
import { connection } from "./connection.js";
import Job from "./Job.model.js";
import Dataset from "../modules/datasets/dataset.model.js";
import { getSignedDownloadUrl } from "../modules/datasets/r2Storage.service.js";
import { runAnalysis } from "../services/analytics/runAnalysis.js";
import { generateChart } from "../services/generateDashboard/generateChart.js";
import mongoose from "mongoose";

try {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Worker connected to MongoDB");
} catch (err) {
  console.error("Worker MongoDB connection error:", err);
}

const worker = new Worker(
  "dashboard-generation",
  async (job) => {
    const { jobId, datasetId, selectedCandidates, r2Key, fileType, skipRows } = job.data;

    await Job.findByIdAndUpdate(jobId, { status: "active", progress: 10 });

    try {
      const signedUrl = await getSignedDownloadUrl(r2Key);
      await Job.findByIdAndUpdate(jobId, { progress: 30 });

      const analyses = await runAnalysis(selectedCandidates, signedUrl, fileType, skipRows);
      await Job.findByIdAndUpdate(jobId, { progress: 70 });

      const charts = analyses.map(generateChart);

      const dataset = await Dataset.findById(datasetId);
      dataset.dashboard = {
        generatedAt: new Date(),
        chartCount: charts.length,
        charts,
      };
      await dataset.save();

      await Job.findByIdAndUpdate(jobId, { status: "completed", progress: 100 });

      return { datasetId };
    } catch (err) {
      await Job.findByIdAndUpdate(jobId, { status: "failed", error: err.message });
      throw err;
    }
  },
  { connection, concurrency: 2 }
);

worker.on("completed", (job) => console.log(` Dashboard job ${job.id} completed`));
worker.on("failed", (job, err) => console.error(` Dashboard job ${job.id} failed:`, err.message));

console.log("Dashboard worker running...");