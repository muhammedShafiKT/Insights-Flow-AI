import api from "./api.js";

export const getJobById = async (jobId) => {
  const { data } = await api.get(`/datasets/jobs/${jobId}`);
  return data;
};