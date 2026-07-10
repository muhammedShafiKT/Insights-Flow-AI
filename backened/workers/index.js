import { redisConnect,redis } from "../config/redis.js"; // adjust path to match your structure

process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err);
});

await redisConnect();
console.log("Workers: Redis connected?", redis.isOpen);

// Dynamic imports so worker files (and the emitter singleton they pull in)
// are only evaluated AFTER redis is connected
await import("../bullmq/chat/chat.worker.js");
await import("../bullmq/dashboard/dashboard.worker.js");
await import("../bullmq/dataset/datasetupload.worker.js");