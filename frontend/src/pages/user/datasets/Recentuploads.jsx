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
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 3v4.5a.75.75 0 00.75.75H19.5M9 12.75l-1.5 1.5 1.5 1.5M15 12.75l1.5 1.5-1.5 1.5M13 12l-2 4M6 3.75h7.5L19.5 9.75V19.5a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V4.5A.75.75 0 016 3.75z" />
      </svg>
    );
  }
  if (fileType === "csv") {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h16.5v15H3.75v-15z M3.75 9.75h16.5M3.75 14.25h16.5M9.75 4.5v15M15 4.5v15" />
      </svg>
    );
  }
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 3v4.5a.75.75 0 00.75.75H19.5M6 3.75h7.5L19.5 9.75V19.5a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V4.5A.75.75 0 016 3.75z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v1.5A2.25 2.25 0 005.25 20h13.5A2.25 2.25 0 0021 18v-1.5M16.5 12l-4.5 4.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
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
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function StatusBadge({ status }) {
  const styles = {
    ready: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    profiled: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    failed: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    processing: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    uploading: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    uploaded: "text-slate-400 bg-slate-800/50 border-slate-700/50",
  };
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium tracking-wide ${styles[status] || styles.uploaded}`}>
      {STATUS_LABEL[status] || status}
    </span>
  );
}

function DeleteConfirm({ onConfirm, onCancel, isDeleting }) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-950/80 px-2 py-1 backdrop-blur-sm shadow-xl">
      <span className="text-[11px] font-medium text-rose-300 px-1">Delete?</span>
      <button
        onClick={(e) => { e.stopPropagation(); onConfirm(); }}
        disabled={isDeleting}
        className="rounded bg-rose-500 px-2 py-0.5 text-[11px] font-semibold text-white hover:bg-rose-600 disabled:opacity-50 transition-colors"
      >
        {isDeleting ? "…" : "Yes"}
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onCancel(); }}
        disabled={isDeleting}
        className="rounded px-2 py-0.5 text-[11px] font-medium text-slate-300 hover:bg-slate-800 transition-colors"
      >
        No
      </button>
    </div>
  );
}

export default function RecentUploads({
  datasets = [],
  selectedId,
  onSelect,
  uploadingFiles = [],
  onDelete,
  onDeleteMany,
  onDownload,
  onGenerateDashboard,
}) {
  const isEmpty = datasets.length === 0 && uploadingFiles.length === 0;

  const [confirmingId, setConfirmingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

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

  const handleDeleteConfirm = async (id) => {
    setDeletingId(id);
    try {
      await onDelete(id);
      setConfirmingId(null);
    } finally {
      setDeletingId(null);
    }
  };

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
    <div className="flex h-full flex-col rounded-2xl border border-slate-800/80 bg-slate-900/30 p-5 backdrop-blur-xl shadow-2xl">
      {/* Header Context Switcher */}
      <div className="mb-5 flex items-center justify-between gap-4 min-h-[36px] pb-3 border-b border-slate-800/50">
        {isSelecting ? (
          <div className="flex w-full items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-5 items-center rounded-full bg-indigo-500/10 px-2.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                {selected.size} selected
              </span>
              <button
                onClick={clearSelection}
                className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
              >
                Clear
              </button>
            </div>

            {bulkConfirm ? (
              <div className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-950/40 px-2.5 py-1">
                <span className="text-xs font-medium text-rose-300 pr-1">
                  Confirm absolute deletion?
                </span>
                <button
                  onClick={handleBulkDelete}
                  disabled={bulkDeleting}
                  className="rounded-lg bg-rose-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-rose-600 disabled:opacity-50 transition-colors"
                >
                  {bulkDeleting ? "Deleting…" : "Yes, remove"}
                </button>
                <button
                  onClick={() => setBulkConfirm(false)}
                  disabled={bulkDeleting}
                  className="rounded-lg px-2 py-1 text-xs font-medium text-slate-400 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setBulkConfirm(true)}
                className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400 transition-all hover:bg-rose-500/20 hover:border-rose-500/50 shadow-sm"
              >
                <TrashIcon />
                Delete Selected
              </button>
            )}
          </div>
        ) : (
          <>
            <div>
              <h3 className="text-sm font-semibold text-slate-200 tracking-tight">Recent Datasets</h3>
              <p className="text-[11px] text-slate-500">Manage and explore loaded file frames</p>
            </div>
            <div className="flex items-center gap-3">
              {uploadingFiles.length > 0 && (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10 animate-pulse">
                  <span className="h-1 w-1 rounded-full bg-indigo-400"></span>
                  Processing
                </span>
              )}
              {datasets.length > 1 && (
                <button
                  onClick={toggleSelectAll}
                  className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Select all
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-12 text-center flex-1">
          <div className="mb-3 rounded-2xl bg-slate-800/20 p-3 text-slate-600 border border-slate-800/40">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
          </div>
          <p className="text-xs font-medium text-slate-400">No data frames ready</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Upload a JSON or CSV file to build dashboards.</p>
        </div>
      )}

      <ul className="flex-1 space-y-2 overflow-y-auto pr-1">
        {/* In-flight uploads */}
        {uploadingFiles.map((upload) => (
          <li
            key={upload.tempId}
            className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-3.5 backdrop-blur-sm"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse">
                {fileIcon(upload.fileType)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-medium text-slate-200">{upload.name}</p>
                  <span className="shrink-0 text-[10px] font-medium text-slate-500 tracking-wider font-mono">{formatSize(upload.size)}</span>
                </div>
                <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-slate-800/60">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      upload.status === "failed" ? "bg-rose-500" : "bg-indigo-500"
                    }`}
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <StatusBadge status={upload.status} />
                  <span className="text-[10px] font-semibold text-indigo-400/80 font-mono">{upload.progress}%</span>
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
            <li key={dataset._id} className="relative group">
              <div
                onClick={() => !isSelecting && onSelect(dataset)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${
                  isSelecting ? "cursor-default" : "cursor-pointer"
                } ${
                  isChecked
                    ? "border-rose-500/30 bg-rose-500/5 shadow-inner"
                    : isSelected
                    ? "border-indigo-500/40 bg-indigo-500/10"
                    : "border-slate-800/60 bg-slate-950/20 hover:border-slate-700 hover:bg-slate-800/20"
                }`}
              >
                {/* Unified Selection/Icon Column */}
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
                  <button
                    type="button"
                    onClick={(e) => toggleSelect(e, dataset._id)}
                    className={`absolute inset-0 z-10 flex items-center justify-center rounded-lg border transition-all duration-150 ${
                      isChecked
                        ? "border-rose-500 bg-rose-500 text-white"
                        : "border-slate-700 bg-slate-900 hover:border-slate-500"
                    } ${isSelecting ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                    aria-label={isChecked ? "Deselect framework item" : "Select framework item"}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </button>

                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg border text-slate-400 transition-opacity ${
                    isSelecting ? "opacity-0" : "opacity-100 group-hover:opacity-0"
                  } ${
                    isSelected ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" : "bg-slate-800/40 border-slate-800/60"
                  }`}>
                    {fileIcon(dataset.fileType)}
                  </div>
                </div>

                {/* Primary Data Row Info */}
                <div className="min-w-0 flex-1 pr-16">
                  <p className="truncate text-xs font-medium text-slate-200 transition-colors group-hover:text-white">
                    {dataset.originalName}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-[11px]">
                    <StatusBadge status={dataset.status} />
                    <span className="text-slate-700">•</span>
                    <span className="text-slate-500 font-medium">
                      {formatRelativeTime(dataset.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Action Frame Layer */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pl-4">
                  {/* Metadata shown by default, fades on hover */}
                  <span className="text-[10px] font-medium text-slate-500 font-mono tracking-wider transition-opacity group-hover:opacity-0 pointer-events-none group-focus-within:opacity-0">
                    {formatSize(dataset.sizeBytes)}
                  </span>

                  {/* Actions overlay panel */}
                  {!isSelecting && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-gradient-to-l from-slate-900 via-slate-900/90 to-transparent pl-6 py-1 opacity-0 transition-all duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                      {isConfirming ? (
                        <DeleteConfirm
                          onConfirm={() => handleDeleteConfirm(dataset._id)}
                          onCancel={() => setConfirmingId(null)}
                          isDeleting={isThisDeleting}
                        />
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onGenerateDashboard(dataset._id);
                            }}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-amber-400"
                            title="Generate dashboard views"
                          >
                            <DashboardIcon />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDownload(dataset._id, dataset.originalName);
                            }}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-indigo-400"
                            title="Download raw file"
                          >
                            <DownloadIcon />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmingId(dataset._id);
                            }}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                            title="Delete file element"
                          >
                            <TrashIcon />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}