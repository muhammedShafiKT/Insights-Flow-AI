import { Queue } from "bullmq";
import {connection} from "./connection.js"
export const datasetuploadQueue = new Queue("dataset-uploader",{
    connection
})