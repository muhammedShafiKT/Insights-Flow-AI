import path from "path";
import Dataset from "../datasets/dataset.model.js";
import {
  uploadtoR2,
  getSignedDownloadUrl,
  deleteFromR2,
  listUserFiles,
} from "./r2Storage.service.js";
import { Dataparser, ExtractMetadata } from "./datasetParser.service.js";
import { extractColumns } from "../../services/profiling/extractColumns.js";
import { generateProfile } from "../../services/profiling/generateProfile.js";


export const uploadDataset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const ext = path.extname(req.file.originalname).slice(1).toLowerCase();
    console.log(req.file)
    const rows = Dataparser(req.file.buffer, ext)
    if (!rows.length) {
  return res.status(400).json({
    success: false,
    message: "Dataset contains no rows"
  });
}

const columns = extractColumns(rows)
const profile = generateProfile(columns)
console.log("profile generator works");
    const metadata = ExtractMetadata(rows)
 
    
// console.log(columns)
//     console.log(metadata)

    const { key, size } = await uploadtoR2(
      req.file.buffer,
      req.user.userId,        // req.user.userId not req.userId
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
      profile,
      previewRows : rows.slice(0,10),
      status: "uploaded",
    });

    res.status(201).json({ success: true, dataset });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message || "Upload failed" });
  }
};

export const getDownloadUrl = async (req, res) => {
  try {
    const dataset = await Dataset.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!dataset) {
      return res.status(404).json({ success: false, message: "Dataset not found" });
    }

    const url = await getSignedDownloadUrl(dataset.r2Key, 900);
    res.json({ success: true, url, expiresIn: 900 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteDataset = async (req, res) => {
  try {
    const dataset = await Dataset.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!dataset) {
      return res.status(404).json({ success: false, message: "Dataset not found" });
    }

    await deleteFromR2(dataset.r2Key);
    await dataset.deleteOne();

    res.json({ success: true, message: "Dataset deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const listDatasets = async (req, res) => {
  try {
    const datasets = await Dataset.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json({ success: true, datasets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const datasetPreview = async (req,res)=>{
  try {
    const dataset = await Dataset.findOne({
      _id: req.params.id,
      userId : req.user.userId
    })
    if(!dataset){
      return res.status(404).json({
        success :false,
        message :"Dataset not found"
      })
    }
       res.json({
        success :true,
        columns : dataset.columns,
        rows :dataset.previewRows
      })
  } catch (error) {
    res.status(500).json({
        success: false,
      message: error.message,
    })
  }
}