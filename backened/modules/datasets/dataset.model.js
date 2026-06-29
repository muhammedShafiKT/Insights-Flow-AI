import mongoose from "mongoose";

const datasetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    originalName: { type: String, required: true },
    r2Key: { type: String, required: true, unique: true },
    fileType: { type: String, required: true, enum: ["csv", "xlsx", "xls"] },
    sizeBytes: { type: Number, required: true },
    rowCount :{ type :Number ,default :0},
    columnCount:{type :Number ,default :0},
    columns :{
        type : [String],
        default :[]
    },
    previewRows : {type :[ mongoose.Schema.Types.Mixed] , default :[]},
    skipRows : {type : Number , defaultv: 0},
    profile: {
  type: mongoose.Schema.Types.Mixed,
  default: {}
},
dashboard : {type : Object , default :null},
validation : {type : Object , default :null},
candidates : {type :Array , default :[]},
    status: {
        type: String,
        enum: ["uploaded", "processing", "profiled", "ready", "failed"],
        default: "uploaded",
    }
}, { timestamps: true })

export default mongoose.model("Dataset", datasetSchema)