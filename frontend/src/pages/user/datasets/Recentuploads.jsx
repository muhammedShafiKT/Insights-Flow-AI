import { useState } from "react";

const STATUS_LABEL = {
  uploading: "Uploading…",
  uploaded: "Queued",
  processing: "Profiling…",
  profiled: "Profiled",
  ready: "Ready",
  failed: "Failed",
};

function fileIcon(fileType) {
  if (fileType === "json") {
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 3v4.5a.75.75 0 00.75.75H19.5M9 12.75l-1.5 1.5 1.5 1.5M15 12.75l1.5 1.5-1.5 1.5M13 12l-2 4M6 3.75h7.5L19.5 9.75V19.5a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V4.5A.75.75 0 016 3.75z" />
      </svg>
    );
  }
  if (fileType === "csv") {
    return (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h16.5v15H3.75v-15z M3.75 9.75h16.5M3.75 14.25h16.5M9.75 4.5v15M15 4.5v15" />
      </svg>
    );
  }
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 3v4.5a.75.75 0 00.75.75H19.5M6 3.75h7.5L19.5 9.75V19.5a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V4.5A.75.75 0 016 3.75z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v1.5A2.25 2.25 0 005.25 20h13.5A2.25 2.25 0 0021 18v-1.5M16.5 12l-4.5 4.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}

function formatSize(bytes) {
  if (!bytes) return "—";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function formatRelativeTime(dateString) {
  if (!dateString) return "";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  return new Date(dateString).toLocaleDateString();
}

function StatusBadge({ status }) {
  const styles = {
    ready: "text-emerald-400",
    profiled: "text-emerald-400",
    failed: "text-rose-400",
    processing: "text-indigo-300",
    uploading: "text-indigo-300",
    uploaded: "text-slate-400",
  };
  return (
    <span className={`text-xs font-medium ${styles[status] || "text-slate-400"}`}>
      {STATUS_LABEL[status] || status}
    </span>
  );
}

// Inline confirmation tooltip that replaces the trash button
function DeleteConfirm({ onConfirm, onCancel, isDeleting }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-2.5 py-1.5">
      <span className="text-xs text-rose-300">Delete?</span>
      <button
        onClick={(e) => { e.stopPropagation(); onConfirm(); }}
        disabled={isDeleting}
        className="rounded px-1.5 py-0.5 text-xs font-medium text-rose-300 hover:bg-rose-500/20 disabled:opacity-50 transition-colors"
      >
        {isDeleting ? "…" : "Yes"}
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onCancel(); }}
        disabled={isDeleting}
        className="rounded px-1.5 py-0.5 text-xs font-medium text-slate-400 hover:bg-slate-700/50 disabled:opacity-50 transition-colors"
      >
        No
      </button>
    </div>
  );
}

export default function RecentUploads({
  datasets,
  selectedId,
  onSelect,
  uploadingFiles,
  onDelete,       // (id: string) => Promise<void>
  onDeleteMany,   // (ids: string[]) => Promise<void>
  onDownload,     // (id: string, originalName: string) => Promise<void>
}) {
  const isEmpty = datasets.length === 0 && uploadingFiles.length === 0;

  // Per-row confirm state: id → boolean
  const [confirmingId, setConfirmingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Multi-select
  const [selected, setSelected] = useState(new Set());
  const [bulkConfirm, setBulkConfirm] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const isSelecting = selected.size > 0;

  const toggleSelect = (e, id) => {
    e.stopPropagation();
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === datasets.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(datasets.map((d) => d._id)));
    }
  };

  const clearSelection = () => {
    setSelected(new Set());
    setBulkConfirm(false);
  };

  // Single delete
  const handleDeleteConfirm = async (id) => {
    setDeletingId(id);
    try {
      await onDelete(id);
      setConfirmingId(null);
    } finally {
      setDeletingId(null);
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    setBulkDeleting(true);
    try {
      await onDeleteMany([...selected]);
      setSelected(new Set());
      setBulkConfirm(false);
    } finally {
      setBulkDeleting(false);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-2 min-h-[28px]">
        {isSelecting ? (
          <>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-200">
                {selected.size} selected
              </span>
              <button
                onClick={clearSelection}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Cancel
              </button>
            </div>

            {bulkConfirm ? (
              <div className="flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-2.5 py-1.5">
                <span className="text-xs text-rose-300">
                  Delete {selected.size} dataset{selected.size > 1 ? "s" : ""}?
                </span>
                <button
                  onClick={handleBulkDelete}
                  disabled={bulkDeleting}
                  className="rounded px-1.5 py-0.5 text-xs font-medium text-rose-300 hover:bg-rose-500/20 disabled:opacity-50 transition-colors"
                >
                  {bulkDeleting ? "Deleting…" : "Yes, delete"}
                </button>
                <button
                  onClick={() => setBulkConfirm(false)}
                  disabled={bulkDeleting}
                  className="rounded px-1.5 py-0.5 text-xs font-medium text-slate-400 hover:bg-slate-700/50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setBulkConfirm(true)}
                className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-400 transition-colors hover:bg-rose-500/20"
              >
                <TrashIcon />
                Delete {selected.size}
              </button>
            )}
          </>
        ) : (
          <>
            <h3 className="text-base font-semibold text-slate-50">Recent uploads</h3>
            <div className="flex items-center gap-3">
              {uploadingFiles.length > 0 && (
                <span className="text-xs font-medium uppercase tracking-wide text-indigo-300">
                  Active tasks
                </span>
              )}
              {datasets.length > 1 && (
                <button
                  onClick={toggleSelectAll}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Select all
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {isEmpty && (
        <p className="py-6 text-center text-sm text-slate-500">
          No datasets yet. Upload one to get started.
        </p>
      )}

      <ul className="flex-1 space-y-2 overflow-y-auto">
        {/* In-flight uploads */}
        {uploadingFiles.map((upload) => (
          <li
            key={upload.tempId}
            className="rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                {fileIcon(upload.fileType)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-slate-100">{upload.name}</p>
                  <span className="shrink-0 text-xs text-slate-500">{formatSize(upload.size)}</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all ${
                      upload.status === "failed" ? "bg-rose-500" : "bg-indigo-400"
                    }`}
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
                <div className="mt-1.5">
                  <StatusBadge status={upload.status} />
                </div>
              </div>
            </div>
          </li>
        ))}

        {/* Persisted datasets */}
        {datasets.map((dataset) => {
          const isSelected = dataset._id === selectedId;
          const isChecked = selected.has(dataset._id);
          const isConfirming = confirmingId === dataset._id;
          const isThisDeleting = deletingId === dataset._id;

          return (
            <li key={dataset._id}>
              <div
                className={`group relative flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                  isChecked
                    ? "border-rose-500/40 bg-rose-500/5"
                    : isSelected
                    ? "border-indigo-500/60 bg-indigo-500/10"
                    : "border-slate-800 bg-slate-950/30 hover:border-slate-700"
                }`}
              >
                {/* Checkbox (shown in select mode, or on hover) */}
                <button
                  type="button"
                  onClick={(e) => toggleSelect(e, dataset._id)}
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                    isChecked
                      ? "border-rose-400 bg-rose-500/20"
                      : "border-slate-700 bg-transparent"
                  } ${
                    isSelecting
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                  aria-label={isChecked ? "Deselect" : "Select"}
                >
                  {isChecked && (
                    <svg className="h-2.5 w-2.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </button>

                {/* File icon */}
                <button
                  type="button"
                  onClick={() => !isSelecting && onSelect(dataset)}
                  className="flex min-w-0 flex-1 items-start gap-3 text-left"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      dataset.status === "ready" || dataset.status === "profiled"
                        ? "bg-indigo-500/20 text-indigo-300"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {dataset.status === "ready" || dataset.status === "profiled" ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      fileIcon(dataset.fileType)
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-slate-100">
                        {dataset.originalName}
                      </p>
                      <span className="shrink-0 text-xs text-slate-500">
                        {formatSize(dataset.sizeBytes)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <StatusBadge status={dataset.status} />
                      <span className="text-xs text-slate-600">·</span>
                      <span className="text-xs text-slate-500">
                        {formatRelativeTime(dataset.createdAt)}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Row actions — hidden during bulk select mode */}
                {!isSelecting && (
                  <div className="ml-1 mt-0.5 flex shrink-0 items-center gap-0.5">
                    {/* Download */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload(dataset._id, dataset.originalName);
                      }}
                      className="rounded-lg p-1.5 text-slate-600 opacity-0 transition-all hover:bg-indigo-500/10 hover:text-indigo-400 group-hover:opacity-100"
                      aria-label="Download dataset"
                    >
                      <DownloadIcon />
                    </button>

                    {/* Delete / confirm */}
                    {isConfirming ? (
                      <DeleteConfirm
                        onConfirm={() => handleDeleteConfirm(dataset._id)}
                        onCancel={() => setConfirmingId(null)}
                        isDeleting={isThisDeleting}
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmingId(dataset._id);
                        }}
                        className="rounded-lg p-1.5 text-slate-600 opacity-0 transition-all hover:bg-rose-500/10 hover:text-rose-400 group-hover:opacity-100"
                        aria-label="Delete dataset"
                      >
                        <TrashIcon />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}