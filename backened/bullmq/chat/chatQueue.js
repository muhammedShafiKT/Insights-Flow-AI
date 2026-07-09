import { Queue ,QueueEvents  } from "bullmq";
import {connection} from "../connection.js"

export const chatQueue = new Queue("chat-processing",{connection})
export const chatQueueEvents = new QueueEvents("chat-processing",{connection})