function DownloadIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v1.5A2.25 2.25 0 005.25 20h13.5A2.25 2.25 0 0021 18v-1.5M16.5 12l-4.5 4.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

export default function DataPreview({ dataset, previewRows, isLoading, onDownload }) {
  if (!dataset) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center">
        <p className="text-sm text-slate-500">
          Select a dataset from your uploads to preview its rows here.
        </p>
      </div>
    );
  }

const notReady = dataset.status === "processing" || dataset.status === "queued";
const canDownload = true; // uploaded = ready

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-50">Data preview</h3>
        <div className="flex items-center gap-2">
          <span className="truncate text-xs text-slate-500">{dataset.originalName}</span>
          {canDownload && (
            <button
              type="button"
              onClick={() => onDownload(dataset._id, dataset.originalName)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300"
              title="Download original file"
            >
              <DownloadIcon />
              Download
            </button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex h-48 items-center justify-center text-sm text-slate-500">
          Loading preview…
        </div>
      )}

      {!isLoading && notReady && (
        <div className="flex h-48 flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm text-slate-400">
            This dataset is still {dataset.status === "processing" ? "being profiled" : "queued"}.
          </p>
          <p className="text-xs text-slate-600">The preview will appear once profiling finishes.</p>
        </div>
      )}

      {!isLoading && !notReady && previewRows && previewRows.rows?.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
                {previewRows.columns.map((col) => (
                  <th key={col} className="px-3 py-2 font-medium">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-transparent" : "bg-slate-950/30"}>
                  {previewRows.columns.map((col) => (
                    <td key={col} className="px-3 py-2.5 text-slate-200">
                      {String(row[col] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {dataset.rowCount > previewRows.rows.length && (
            <button
              type="button"
              className="mt-3 w-full rounded-lg border border-slate-800 py-2 text-center text-xs font-medium text-indigo-300 transition-colors hover:bg-slate-800/50"
            >
              View all {dataset.rowCount.toLocaleString()} rows →
            </button>
          )}
        </div>
      )}

      {!isLoading && !notReady && (!previewRows || previewRows.rows?.length === 0) && (
        <div className="flex h-48 items-center justify-center text-sm text-slate-500">
          No preview data available for this dataset.
        </div>
      )}
    </div>
  );
}