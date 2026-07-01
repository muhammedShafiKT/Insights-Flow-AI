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

  const {rows,headerRowIndex} = Dataparser(req.file.buffer, ext);

  if (!rows.length) {
    return res.status(400).json({
      success: false,
      message: "Dataset contains no rows",
    });
  }

  const columns = extractColumns(rows);
  // console.log(columns)
  const profile = generateProfile(columns);
  // console.log(profile)
  const validation = validateProfile(profile)
  // console.log("validation :",validation)
  const candidates = generateCandidates(validation,profile)

 
  const metadata = ExtractMetadata(rows);

  const { key, size } = await uploadtoR2(
    req.file.buffer,
    req.user.userId,
    req.file.originalname,
    req.file.mimetype
  );


  const dataset = await Dataset.create({
    userId: req.user.userId,
    originalName: req.file.originalname,
    r2Key: key,
    fileType: ext,
    sizeBytes: size,
    rowCount: metadata.rowCount,
    columnCount: metadata.columnCount,
    columns: metadata.columns,
    candidates,
    skipRows :headerRowIndex ,
    previewRows: rows.slice(0, 10),
    // dashboard,
    status: "uploaded",
  });

  res.status(201).json({
    success: true,
    dataset,
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