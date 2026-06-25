import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    role: {
        type : String,
        enum : ["user","assistant"],
        required :true
    },
        content: {
        type : String,
        required :true
    }
},{
    timestamps :true,_id:false
})

const conversationSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
        datasetId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Dataset",
        required : true
    },
    messages :[messageSchema]
},{timestamps : true,})

conversationSchema.index(
    {userId :1 , datasetId :1},
    {unique :true}
)
const conversation = mongoose.model("Conversation",conversationSchema)
export default conversation;