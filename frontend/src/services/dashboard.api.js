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

// Returns a raw PDF blob — must use responseType: "blob" or the browser
// will try to parse the binary PDF bytes as JSON/text and corrupt it.
export const exportDashboardPdf = async (datasetId) => {
  const response = await api.get(`/datasets/${datasetId}/dashboard/export/pdf`, {
    responseType: "blob",
  });
  return response.data;
};