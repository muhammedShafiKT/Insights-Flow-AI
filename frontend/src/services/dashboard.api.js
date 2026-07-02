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
  return data.jobId; // returned in case you want to display/track it, but not required for polling
};

// Poll job status by DATASET id (not job id) — this is what survives a
// page refresh, since Dashboard.jsx only ever has the dataset id in the URL.
export const getJobStatus = async (datasetId) => {
  const { data } = await api.get(`/datasets/${datasetId}/dashboard/job`);
  return data; // { status, progress, error, ... }
};