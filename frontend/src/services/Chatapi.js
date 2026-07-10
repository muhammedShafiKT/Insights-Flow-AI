import api from "./api"; // your existing axios instance

export const getConversation = async (datasetId) => {
  const { data } = await api.get(`/datasets/${datasetId}/chat`);
  return data.result;
};

// Enqueues a chat job — returns { jobId } instead of waiting for the answer
export const sendMessage = async (datasetId, message) => {
  const { data } = await api.post(`/datasets/${datasetId}/chat`, { message });
  return data.result; // { jobId }
};

// Used once right after enqueueing, to cover the race where the job
// finishes before the socket listener is ready to catch it
export const getChatJobById = async (jobId) => {
  const { data } = await api.get(`/datasets/jobs/${jobId}`); // adjust to your actual route
  return data.result; // { status, result, error }
};