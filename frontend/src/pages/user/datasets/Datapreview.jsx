import { useState } from "react";

function DownloadIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v1.5A2.25 2.25 0 005.25 20h13.5A2.25 2.25 0 0021 18v-1.5M16.5 12l-4.5 4.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

function TableIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
    </svg>
  );
}

export default function DataPreview({ dataset, previewRows, isLoading, onDownload }) {
  // Gracefully render state when no dataset is loaded
  if (!dataset) {
    return (
      <div className="flex h-full min-h-[350px] flex-col items-center justify-center rounded-2xl border border-slate-800/60 bg-slate-900/20 p-8 text-center backdrop-blur-xl">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/40 text-slate-600">
          <TableIcon />
        </div>
        <h4 className="text-sm font-semibold text-slate-400 tracking-tight">No Active Framework Selected</h4>
        <p className="mt-1 text-xs text-slate-500 max-w-xs leading-relaxed">
          Select an indexed file matrix stream from your dashboard sidebar index to parse raw schema fields.
        </p>
      </div>
    );
  }

  const isNotReady = dataset.status === "processing" || dataset.status === "queued" || dataset.status === "uploading";
  const hasRows = !isLoading && !isNotReady && previewRows && previewRows.rows?.length > 0;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-xl shadow-2xl overflow-hidden">
      
      {/* ─── GLASS PANEL HEADER ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-800/50 bg-slate-950/40 p-4 shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`h-1.5 w-1.5 rounded-full ${isNotReady ? "bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]" : "bg-indigo-400 shadow-[0_0_8px_#818cf8]"}`} />
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">Data Preview Matrix</h3>
          </div>
          <p className="truncate text-xs font-medium text-slate-500 max-w-[240px] sm:max-w-md" title={dataset.originalName}>
            {dataset.originalName}
          </p>
        </div>

        {/* Action Tray */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            disabled={isNotReady}
            onClick={() => onDownload(dataset._id, dataset.originalName)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-[#030712] px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-400 disabled:cursor-not-allowed disabled:opacity-30"
            title="Download target array elements"
          >
            <DownloadIcon />
            <span className="hidden sm:inline">Download Raw</span>
          </button>
        </div>
      </div>

      {/* ─── DATA MATRIX CORE SHELL ────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 relative overflow-y-auto">
        
        {/* Loading State Skeleton Layout */}
        {isLoading && (
          <div className="w-full p-4 space-y-3 animate-pulse">
            <div className="h-6 bg-slate-800/40 rounded-lg w-full" />
            <div className="h-9 bg-slate-950/30 rounded-lg w-full" />
            <div className="h-9 bg-slate-950/10 rounded-lg w-full" />
            <div className="h-9 bg-slate-950/30 rounded-lg w-full" />
          </div>
        )}

        {/* In-Flight System Workers Context */}
        {!isLoading && isNotReady && (
          <div className="flex flex-col items-center justify-center h-full min-h-[250px] p-6 text-center">
            <div className="relative mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-400/90">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-slate-300">
              Pipeline Parsing: Stream status is currently <span className="text-amber-400 lowercase">[{dataset.status}]</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xs leading-relaxed">
              The tabular evaluation template structure blocks automatically pending comprehensive frame layout synchronization.
            </p>
          </div>
        )}

        {/* Primary Data Grid Presentation */}
        {hasRows && (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-950/10 backdrop-blur-sm sticky top-0 z-10">
                  {previewRows.columns.map((col, idx) => (
                    <th 
                      key={col} 
                      className={`border-b border-slate-800 bg-[#060b17] px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 first:pl-5 last:pr-5 ${
                        idx > 0 ? "border-l border-slate-900/50" : ""
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/40">
                {previewRows.rows.map((row, i) => (
                  <tr 
                    key={i} 
                    className="group transition-colors hover:bg-slate-800/10"
                  >
                    {previewRows.columns.map((col, idx) => (
                      <td 
                        key={col} 
                        className={`px-4 py-2.5 text-xs text-slate-300 transition-colors group-hover:text-slate-100 first:pl-5 last:pr-5 font-sans tracking-wide ${
                          idx > 0 ? "border-l border-slate-900/20" : ""
                        }`}
                      >
                        {row[col] !== undefined && row[col] !== null && row[col] !== "" ? (
                          String(row[col])
                        ) : (
                          <span className="text-slate-700 select-none">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty Exception Pipeline */}
        {!isLoading && !isNotReady && (!previewRows || previewRows.rows?.length === 0) && (
          <div className="flex flex-col items-center justify-center h-full min-h-[250px] p-6 text-center">
            <p className="text-xs font-semibold text-slate-400">Zero Length Core Matrix</p>
            <p className="text-[11px] text-slate-600 mt-0.5">The engine parsed the schema but found no internal tuples.</p>
          </div>
        )}
      </div>

      {/* ─── STICKY FOOTER NAVIGATION TRAY ────────────────────────────────────── */}
      {hasRows && dataset.rowCount > previewRows.rows.length && (
        <div className="p-3 border-t border-slate-800/40 bg-slate-950/20 shrink-0">
          <button
            type="button"
            className="w-full rounded-xl border border-slate-800/80 bg-[#030712] py-2 text-center font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-400 transition-all hover:bg-indigo-500/5 hover:border-indigo-500/30 hover:text-indigo-300 shadow-sm"
          >
            Expose remaining {(dataset.rowCount - previewRows.rows.length).toLocaleString()} cells of {dataset.rowCount.toLocaleString()} total arrays →
          </button>
        </div>
      )}
    </div>
  );
}