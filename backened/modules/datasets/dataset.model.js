import mongoose from "mongoose";

const datasetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true ,index:true },
    originalName: { type: String, required: true },
    storedName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileType: { type: String, required: true ,
             enum: [
        "text/csv",
        "application/json",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
    },
    fileSize: { type: Number, required: true ,},
    status: {
        type: String,
        enum: ["uploaded", "processing", "profiled", "failed"],
        default: "uploaded",
    }
},
    { timestamps: true }
)

export default mongoose.model("Dataset", datasetSchema)