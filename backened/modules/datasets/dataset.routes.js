import express from "express";
import multer from "multer";
import verifytoken from "../../middlewares/verifytoken.js";

import { datasetPreview, deleteDataset, getDownloadUrl, getJobById, listDatasets, uploadDataset } from "./dataset.controller.js";
import upload from "../../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/upload", verifytoken, upload.single("file"), uploadDataset);
router.get("/", verifytoken , listDatasets);
router.get("/:id/download-url", verifytoken, getDownloadUrl);
router.delete("/:id", verifytoken, deleteDataset);
router.get("/:id/preview",verifytoken,datasetPreview)
router.get("/jobs/:jobId",verifytoken,getJobById)
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err) return res.status(400).json({ success: false, message: err.message });
  next();
});

export default router;