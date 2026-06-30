import { Queue } from "bullmq";
import { connection } from "./connection.js";

export const datasetQueue = new Queue("dataset-processing",{
    connection
})