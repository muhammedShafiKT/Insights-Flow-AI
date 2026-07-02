import { Worker } from "bullmq"



try {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Worker connected to MongoDB");
} catch (err) {
  console.error("Worker MongoDB connection error:", err);
}

const worker =  new Worker("dataset-uploader",
    async(job)=>{
try {
    
} catch (error) {
    
}
}) 