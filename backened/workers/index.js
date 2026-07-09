import "../bullmq/chat/chat.worker.js"
import "../bullmq/dashboard/dashboard.worker.js"
import "../bullmq/dataset/datasetupload.worker.js"

process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err);
});