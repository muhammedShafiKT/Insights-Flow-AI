import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UploadZone from "./UploadZone";
import RecentUploads from "./RecentUploads";
import DataPreview from "./DataPreview";
import api from "../../../services/api.js"

function extensionToFileType(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  if (["csv", "xlsx", "xls"].includes(ext)) return ext;
  return ext;
}

export default function DatasetWorkspace() {
  const navigate = useNavigate();

  const [datasets, setDatasets] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [previewRows, setPreviewRows] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [listError, setListError] = useState(null);

  const pollRef = useRef(null);

  // ─── Fetch list ───────────────────────────────────────────────────────────
  const fetchDatasets = useCallback(async () => {
    try {
      const { data } = await api.get("/datasets");
      setDatasets(data.datasets || []);
      setListError(null);
    } catch (err) {
      setListError(err.response?.data?.message || err.message || "Failed to load datasets");
    }
  }, []);

  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);

  // ─── Polling for pending uploads ──────────────────────────────────────────
  useEffect(() => {
    const hasPending = datasets.some(
      (d) => d.status === "uploaded" || d.status === "processing"
    );

    if (hasPending && !pollRef.current) {
      pollRef.current = setInterval(fetchDatasets, 10000);
    }
    if (!hasPending && pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [datasets, fetchDatasets]);

  // ─── Upload (XHR kept for progress tracking) ──────────────────────────────
  const handleFileSelected = (file) => {
    const tempId = `temp-${Date.now()}`;
    const fileType = extensionToFileType(file.name);

    setUploadingFiles((prev) => [
      ...prev,
      { tempId, name: file.name, size: file.size, fileType, progress: 0, status: "uploading" },
    ]);

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${api.defaults.baseURL}/datasets/upload`);
    xhr.withCredentials = true;

    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable) return;
      const percent = Math.round((e.loaded / e.total) * 100);
      setUploadingFiles((prev) =>
        prev.map((u) => (u.tempId === tempId ? { ...u, progress: percent } : u))
      );
    };

    xhr.onload = () => {
      const success = xhr.status >= 200 && xhr.status < 300;
      setUploadingFiles((prev) =>
        prev.map((u) =>
          u.tempId === tempId
            ? { ...u, progress: 100, status: success ? "uploaded" : "failed" }
            : u
        )
      );

      if (success) {
        fetchDatasets();
        setTimeout(() => {
          setUploadingFiles((prev) => prev.filter((u) => u.tempId !== tempId));
        }, 1200);
      }
    };

    xhr.onerror = () => {
      setUploadingFiles((prev) =>
        prev.map((u) => (u.tempId === tempId ? { ...u, status: "failed" } : u))
      );
    };

    xhr.send(formData);
  };

  // ─── Preview ──────────────────────────────────────────────────────────────
  const handleSelectDataset = async (dataset) => {
    setSelectedDataset(dataset);
    setPreviewRows(null);
    setIsPreviewLoading(true);

    try {
      const { data } = await api.get(`/datasets/${dataset._id}/preview`, {
        headers: { "Cache-Control": "no-cache" },
      });
      setPreviewRows({
        columns: data.columns || [],
        rows: data.rows || [],
      });
    } catch (err) {
      console.error("Preview failed:", err.response?.data?.message || err.message);
      setPreviewRows(null);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // ─── Download ─────────────────────────────────────────────────────────────
  const handleDownload = async (id, originalName) => {
    try {
      const { data } = await api.get(`/datasets/${id}/download-url`);

      const a = document.createElement("a");
      a.href = data.url;
      a.download = originalName || "dataset";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setListError(err.response?.data?.message || err.message || "Could not get download link");
    }
  };

  // ─── Delete single ────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await api.delete(`/datasets/${id}`);
      setSelectedDataset((prev) => (prev?._id === id ? null : prev));
      setDatasets((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || "Delete failed");
    }
  };

  // ─── Delete many ──────────────────────────────────────────────────────────
  const handleDeleteMany = async (ids) => {
    const results = await Promise.allSettled(
      ids.map((id) => api.delete(`/datasets/${id}`))
    );

    const deletedIds = ids.filter((_, i) => results[i].status === "fulfilled");

    setSelectedDataset((prev) =>
      deletedIds.includes(prev?._id) ? null : prev
    );
    setDatasets((prev) => prev.filter((d) => !deletedIds.includes(d._id)));

    const failCount = ids.length - deletedIds.length;
    if (failCount > 0) {
      setListError(`${failCount} dataset${failCount > 1 ? "s" : ""} could not be deleted.`);
    }
  };

  // ─── Open chart selector (pick candidates before generating) ──────────────
  const handleGenerateDashboard = (id) => {
    if (!id) return;
    navigate(`/datasets/${id}/charts`);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-8 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <UploadZone onFileSelected={handleFileSelected} />

        {listError && (
          <p className="text-sm text-rose-400">{listError}</p>
        )}

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          <RecentUploads
            datasets={datasets}
            uploadingFiles={uploadingFiles}
            selectedId={selectedDataset?._id}
            onSelect={handleSelectDataset}
            onDelete={handleDelete}
            onDeleteMany={handleDeleteMany}
            onDownload={handleDownload}
            onGenerateDashboard={handleGenerateDashboard}
          />
          <DataPreview
            dataset={selectedDataset}
            previewRows={previewRows}
            isLoading={isPreviewLoading}
            onDownload={handleDownload}
          />
        </div>
      </div>
    </div>
  );
}