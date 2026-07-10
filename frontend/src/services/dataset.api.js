import api from "./api.js";

export const getDatasets = async () => {
  const { data } = await api.get("/datasets");
  return data;
};

export const getJobById = async (jobId) => {
  const { data } = await api.get(`/datasets/jobs/${jobId}`);
  return data;
};

export const getDatasetPreview = async (datasetId) => {
  const { data } = await api.get(`/datasets/${datasetId}/preview`, {
    headers: { "Cache-Control": "no-cache" },
  });
  return data;
};

export const getDownloadUrl = async (datasetId) => {
  const { data } = await api.get(`/datasets/${datasetId}/download-url`);
  return data;
};

export const deleteDataset = async (datasetId) => {
  const { data } = await api.delete(`/datasets/${datasetId}`);
  return data;
};