import { useRef, useState, useCallback } from "react";

const ACCEPTED_EXTENSIONS = [".csv", ".xlsx", ".xls", ".json"];

function isAcceptedFile(file) {
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

export default function UploadZone({ onFileSelected }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState(null);

  const handleFiles = useCallback(
    (fileList) => {
      const file = fileList?.[0];
      if (!file) return;

      if (!isAcceptedFile(file)) {
        setRejectionMessage(`"${file.name}" rejected. Format unsupported.`);
        return;
      }

      setRejectionMessage(null);
      onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);
  const handleBrowseClick = () => inputRef.current?.click();

  const handleInputChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = ""; 
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* ─── UPLOAD ELEMENT MATRIX (SOLID BORDERS) ────────────────────────────── */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex flex-col items-center justify-center rounded-2xl border p-10 text-center transition-all duration-300 backdrop-blur-xl shadow-2xl select-none group ${
          isDragging
            ? "border-indigo-500/80 bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.15)]"
            : "border-slate-800/80 bg-slate-950/20 hover:border-slate-700/80 hover:bg-slate-900/30"
        }`}
      >
        {/* Glow Element Accent */}
        <div className={`absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none bg-gradient-to-b from-indigo-500/10 to-transparent ${isDragging ? "opacity-100" : ""}`} />

        {/* Dynamic Icon Shell */}
        <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-300 ${
          isDragging
            ? "bg-indigo-500/20 border-indigo-400 text-indigo-300 shadow-[0_0_15px_rgba(129,140,248,0.3)]"
            : "bg-slate-900 border-slate-800 text-slate-500 group-hover:border-slate-700 group-hover:text-slate-400"
        }`}>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
            />
          </svg>
        </div>

        {/* Messaging Text Architecture */}
        <div className="space-y-1.5 relative z-10">
          <h2 className="text-sm font-semibold text-slate-200 tracking-tight">
            {isDragging ? "Drop to ingest context arrays" : "Drag & drop dataset stream"}
          </h2>
          <p className="max-w-md text-xs leading-relaxed text-slate-500 font-sans px-4">
            AI processing automatically profiles data arrays to instantiate live metadata metrics.
          </p>
        </div>

        {/* Form Element Action Interface */}
        <div className="mt-6 relative z-10">
          <button
            type="button"
            onClick={handleBrowseClick}
            className="rounded-xl border border-slate-800 bg-[#030712] px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest text-slate-300 transition-all hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-400 hover:shadow-[0_0_15px_rgba(99,102,241,0.1)]"
          >
            Browse Matrix Files
          </button>
        </div>

        {/* Extension Token Layout */}
        <div className="mt-6 flex items-center gap-1.5 font-mono text-[9px] text-slate-600 uppercase tracking-widest relative z-10">
          <span>Supported variants:</span>
          {ACCEPTED_EXTENSIONS.map((ext) => (
            <span key={ext} className="rounded bg-slate-950/60 border border-slate-900 px-1 py-0.5 text-slate-500 font-bold lowercase">
              {ext.replace(".", "")}
            </span>
          ))}
        </div>

        {/* Hidden System Receiver */}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(",")}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* ─── OVERLAYS / WARNING CHANNELS ──────────────────────────────────────── */}
      {rejectionMessage && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 px-3 py-2.5 text-xs text-rose-400 font-mono tracking-wide">
          <svg className="h-4 w-4 shrink-0 text-rose-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="truncate">{rejectionMessage}</span>
        </div>
      )}
    </div>
  );
}