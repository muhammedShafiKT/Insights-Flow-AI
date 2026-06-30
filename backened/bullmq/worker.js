import { Worker } from "bullmq";
import { connection } from "./connection";

new Worker("dataset-processing",async(job)=>{
    console.log("processing job")
    console.log(job.data)
},{
    connection
})