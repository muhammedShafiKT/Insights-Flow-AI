import mongoose from "mongoose";

const datasetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    originalName: { type: String, required: true ,unique :true},
    r2Key: { type: String, required: true, unique: true },
    fileType: { type: String, required: true, enum: ["csv", "xlsx", "xls"] },
    sizeBytes: { type: Number, required: true },
    status: {
        type: String,
        enum: ["uploaded", "processing", "profiled", "ready", "failed"],
        default: "uploaded",
    }
}, { timestamps: true })

export default mongoose.model("Dataset", datasetSchema)