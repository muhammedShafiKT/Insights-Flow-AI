import Dataset from "../datasets/dataset.model.js"
import BullmqJobmodel from "../../bullmq/Job.model.js"
import { dashboardQueue } from "../../bullmq/dashboard/dashboardQueue.js"
import Job from "../../bullmq/Job.model.js"
import { getBrowser } from "../../config/puppeteer.js"
import { exportDashboardpdfservice } from "./Exportdashboard.service.js"
const createError = (message, statusCode) => {
   const error = new Error(message)
   error.statusCode = statusCode
   return error
}
export const dashboardService = {
   getDashboard: async (req, res) => {
      const dataset = await Dataset.findOne({ _id: req.params.id, userId: req.user.userId })
      if (!dataset) {
         throw createError("Dataset not found", 404)
      }
      return {
         success: true,
         dashboard: dataset.dashboard
      }
   },
   getCandidates: async (req, res) => {
      const dataset = await Dataset.findOne({ _id: req.params.id, userId: req.user.userId })
      if (!dataset) {
         throw createError("Dataset not found", 404)
      }
      return {
         success: true,
         candidates: dataset.candidates
      }
   },
   generateDashboard: async (req, res) => {
      const { candidates: selectedCandidates } = req.body
      if (!Array.isArray(selectedCandidates) || selectedCandidates.length === 0) {
         throw createError("Select atleast One", 400)
      }
      if (selectedCandidates.length > 8) {
         throw createError("Select atleast One", 400)
      }
      const dataset = await Dataset.findOne({ _id: req.params.id, userId: req.user.userId })
      if (!dataset) {
         throw createError("Dataset not found", 404)
      }

      const job = await BullmqJobmodel.create({
         userId: req.user.userId,
         datasetId: req.params.id,
         type: "dashboard-generate",
         status: "pending"
      })

      await dashboardQueue.add(
         "generate-dashboard", {
         jobId: job._id.toString(),
         datasetId: req.params.id.toString(),
         selectedCandidates,
         r2Key: dataset.r2Key,
         fileType: dataset.fileType,
         skipRows: dataset.skipRows,
         userId: req.user.userId
      }, {
         attempts: 2,
         backoff: { type: "exponential", delay: 3000 }
      }
      )
      res.status(202).json({
         success: true,
         jobId: job._id
      })
   },

   getJobStatus: async (req, res) => {
      const job = await Job.findOne({ datasetId: req.params.id, userId: req.user.userId })
         .sort({ createdAt: -1 }); // latest job for this dataset
      if (!job) throw createError("Job not found", 404);
      res.json(job);
   },

  exportdashboardpdf: async (req, res) => {
  const { id } = req.params;

  const pdfBuffer = await exportDashboardpdfservice({
    datasetId: id,
    cookieValue: req.cookies.accesstoken,   // ✅ matches verifytoken.js
    baseUrl: process.env.CLIENT_URL,
  });

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="dashboard-${id}.pdf"`,
  });
  res.send(pdfBuffer);
}


}
