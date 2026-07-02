import { Queue } from "bullmq";
import { connection } from "./connection.js";

export const dashboardQueue = new Queue("dashboard-generation",{
    connection
})