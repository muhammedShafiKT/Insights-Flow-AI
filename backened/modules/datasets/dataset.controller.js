import path from "path";
import Dataset from "../datasets/dataset.model.js";
import {
  uploadtoR2,
  getSignedDownloadUrl,
  deleteFromR2,
} from "./r2Storage.service.js";
import { Dataparser, ExtractMetadata } from "./datasetParser.service.js";
import { extractColumns } from "../../services/profiling/extractColumns.js";
import { generateProfile } from "../../services/profiling/generateProfile.js";
import { asyncWrapper } from "../../middlewares/asyncWrapper.js";
import { validateProfile } from "../../services/validation/profileValidator.js";
import { generateCandidates } from "../../services/rules/generateCandidates.js";
import { scoreCandidates } from "../../services/scoring/scoreCandidates.js";
import { selectTopcandidates } from "../../services/scoring/selectTopcandidates.js";
import { runAnalysis } from "../../services/analytics/runAnalysis.js";
import { generateChart } from "../../services/generateDashboard/generateChart.js";
import JobModel from "../../bullmq/Job.model.js";
import { datasetuploadQueue } from "../../bullmq/dataset/datasetuploadQueue.js";


export const uploadDataset = asyncWrapper(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  const ext = path.extname(req.file.originalname)
    .slice(1)
    .toLowerCase();

  

  const { key, size } = await uploadtoR2(
    req.file.buffer,
    req.user.userId,
    req.file.originalname,
    req.file.mimetype
  );

const job = await JobModel.create({
  userId : req.user.userId,
  type : "dataset-upload",
  status : "pending"
})

await datasetuploadQueue.add(
  "dataset-uploader",{
    jobId : job._id,
    userId : req.user.userId.toString(),
    originalName: req.file.originalname,
    r2Key: key,
    fileType: ext,
    sizeBytes: size,
},{
  attempts :2,
  backoff : {type : "exponential" ,delay : 3000}
})


  res.status(202).json({
    success: true,
    jobId : job._id,
  });
});

export const getDownloadUrl = asyncWrapper(async (req, res) => {
  const dataset = await Dataset.findOne({
    _id: req.params.id,
    userId: req.user.userId,
  });

  if (!dataset) {
    return res.status(404).json({
      success: false,
      message: "Dataset not found",
    });
  }

  const url = await getSignedDownloadUrl(dataset.r2Key, 900);

  res.json({
    success: true,
    url,
    expiresIn: 900,
  });
});

export const deleteDataset = asyncWrapper(async (req, res) => {
  const dataset = await Dataset.findOne({
    _id: req.params.id,
    userId: req.user.userId,
  });

  if (!dataset) {
    return res.status(404).json({
      success: false,
      message: "Dataset not found",
    });
  }

  await deleteFromR2(dataset.r2Key);
  await dataset.deleteOne();

  res.json({
    success: true,
    message: "Dataset deleted",
  });
});

export const listDatasets = asyncWrapper(async (req, res) => {
  const datasets = await Dataset.find({
    userId: req.user.userId,
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    datasets,
  });
});

export const datasetPreview = asyncWrapper(async (req, res) => {
  const dataset = await Dataset.findOne({
    _id: req.params.id,
    userId: req.user.userId,
  });

  if (!dataset) {
    return res.status(404).json({
      success: false,
      message: "Dataset not found",
    });
  }

  res.json({
    success: true,
    columns: dataset.columns,
    rows: dataset.previewRows,
  });
});

export const getJobById = async (req, res) => {
  const job = await JobModel.findOne({ _id: req.params.jobId, userId: req.user.userId });
  if (!job) {
    return res.status(404).json({ success: false, message: "Job not found" });
  }
  res.json(job);
};