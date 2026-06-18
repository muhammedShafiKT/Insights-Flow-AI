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
        setRejectionMessage(`${file.name} isn't a supported format. Use CSV, XLSX, or JSON.`);
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
    e.target.value = ""; // allow re-selecting the same file
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-colors duration-150 ${
          isDragging
            ? "border-indigo-400 bg-indigo-500/10"
            : "border-indigo-500/40 bg-slate-900/40"
        }`}
      >
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20">
          <svg
            className="h-7 w-7 text-indigo-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v1.5A2.25 2.25 0 005.25 20h13.5A2.25 2.25 0 0021 18v-1.5M16.5 8.25L12 3.75 7.5 8.25M12 3.75v12.75"
            />
          </svg>
        </div>

        <h2 className="text-lg font-semibold text-slate-50">Drag and drop your dataset</h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
          Support for CSV, JSON, and Excel files. AI will automatically profile your data
          structures and generate a preview.
        </p>

        <button
          type="button"
          onClick={handleBrowseClick}
          className="mt-6 rounded-lg bg-indigo-400 px-5 py-2.5 text-sm font-medium text-indigo-950 transition-colors hover:bg-indigo-300"
        >
          Browse files
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(",")}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {rejectionMessage && (
        <p className="mt-2 text-sm text-rose-400">{rejectionMessage}</p>
      )}
    </div>
  );
}