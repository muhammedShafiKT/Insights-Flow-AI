import { useState } from "react";

export default function DatasetUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | success | error
  const [response, setResponse] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setStatus("idle");
      setResponse(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus("uploading");
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file); // field name MUST match multer's upload.single("file")

    try {
      const res = await fetch("http://localhost:3000/api/datasets/upload", {
        method: "POST",
        credentials: "include", // sends your JWT cookie automatically
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setResponse(data);
        return;
      }

      setStatus("success");
      setResponse(data);
    } catch (err) {
      setStatus("error");
      setResponse({ message: err.message });
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>
        Dataset upload test
      </h2>

      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
        style={{ marginBottom: 12, display: "block" }}
      />

      {file && (
        <p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
          Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || status === "uploading"}
        style={{
          padding: "8px 16px",
          fontSize: 14,
          cursor: !file || status === "uploading" ? "not-allowed" : "pointer",
        }}
      >
        {status === "uploading" ? "Uploading..." : "Upload"}
      </button>

      {status === "success" && (
        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: "#e6f9ec",
            color: "#0a5c2e",
            fontSize: 12,
            borderRadius: 6,
            overflowX: "auto",
          }}
        >
          {JSON.stringify(response, null, 2)}
        </pre>
      )}

      {status === "error" && (
        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: "#fdecea",
            color: "#a32d2d",
            fontSize: 12,
            borderRadius: 6,
            overflowX: "auto",
          }}
        >
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}