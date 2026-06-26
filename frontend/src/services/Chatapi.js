import api from "./api"; // your existing axios instance

export const getConversation = async (datasetId) => {
  const { data } = await api.get(`/datasets/${datasetId}/chat`);
  return data.result;
};

export const sendMessage = async (datasetId, message) => {
  const { data } = await api.post(`/datasets/${datasetId}/chat`, { message });
  return data.result;
};