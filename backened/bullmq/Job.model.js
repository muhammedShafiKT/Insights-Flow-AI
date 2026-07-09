import mongoose from "mongoose";
const BullmqJobSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    datasetId: { type: mongoose.Schema.Types.ObjectId, ref: "Dataset" },
    type: { type: String, enum: ["dashboard-generate", "dataset-upload","chat-processing"], required: true },
    status: { type: String, enum: ["pending", "active", "completed", "failed"], default: "pending" },
    progress: { type: Number, default: 0 },
    resultId: { type: mongoose.Schema.Types.ObjectId },
    error: { type: String },
}, { timestamps: true })

export default mongoose.model("BullmqJob", BullmqJobSchema)