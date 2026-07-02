import api from "./api.js";

export const getDashboard = async (datasetId) => {
  const { data } = await api.get(`/datasets/${datasetId}/dashboard`);
  return data.dashboard;
};

export const getCandidates = async (datasetId) => {
  const { data } = await api.get(`/datasets/${datasetId}/candidates`);
  return data.candidates;
};

export const generateDashboard = async (datasetId, candidates) => {
  const { data } = await api.post(`/datasets/${datasetId}/dashboard`, { candidates });
  return data.jobId; 
};


export const getJobStatus = async (datasetId) => {
  const { data } = await api.get(`/datasets/${datasetId}/dashboard/job`);
  return data; 
};