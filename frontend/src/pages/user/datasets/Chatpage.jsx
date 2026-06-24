import { useState, useRef, useEffect } from "react";
import api from "../../../services/api";

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
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 3v4.5a.75.75 0 00.75.75H19.5M9 12.75l-1.5 1.5 1.5 1.5M15 12.75l1.5 1.5-1.5 1.5M13 12l-2 4M6 3.75h7.5L19.5 9.75V19.5a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V4.5A.75.75 0 016 3.75z" />
      </svg>
    );
  }
  if (fileType === "csv") {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.5h16.5v15H3.75v-15z M3.75 9.75h16.5M3.75 14.25h16.5M9.75 4.5v15M15 4.5v15" />
      </svg>
    );
  }
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 3v4.5a.75.75 0 00.75.75H19.5M6 3.75h7.5L19.5 9.75V19.5a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V4.5A.75.75 0 016 3.75z" />
    </svg>
  );
}

function formatSize(bytes) {
  if (!bytes) return "—";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default function Chatpage({ datasets = [] }) {
  const [selectedDataset, setSelectedDataset] = useState(() => datasets[0] || null);
  const [messages, setMessages] = useState([
    {
      id: "system-init",
      role: "assistant",
      text: "System core linked. Select an active dataset from the directory on the left to start asking questions.",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const messagesEndRef = useRef(null);

  // Scroll to view targets
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  // Fixed asynchronous handle along with setting context
  const handleSelectDataset = async (dataset) => {
    try {
      setSelectedDataset(dataset);
      
      // Optional: Fetch refined single dataset metrics from backend if needed
      const result = await api.get("/datasets");
      
      // Flash structural updates into context notice
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          role: "assistant",
          text: `Context shifted target to dataset: ${dataset.originalName}. Directory mapped and analyzed successfully.`,
        },
      ]);
    } catch (error) {
      console.error("Failed shifting target dataset runtime scope:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedDataset || isProcessing) return;

    const userText = inputMessage;
    setInputMessage("");
    setIsProcessing(true);

    // Append client message
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", text: userText },
    ]);

    try {
      // Replace with your real API pathing parameters as needed
      // const response = await api.post("/chat", { message: userText, datasetId: selectedDataset._id });
      
      // Mock delayed resolution interface wrapper
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "assistant",
          text: `Processed context request relative to columns: ${selectedDataset.columns?.join(", ")}. Systems running analytics operations cleanly.`,
        },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#030712] text-slate-100 selection:bg-indigo-500/30">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* ── LEFT PANEL: DATASET DIRECTORY ─────────────────────────────────────── */}
      <aside className="relative z-10 flex w-80 shrink-0 flex-col border-r border-slate-900 bg-slate-950/40 backdrop-blur-md">
        <div className="border-b border-slate-900 p-5">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
            <h2 className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Context Directory
            </h2>
          </div>
          <h3 className="text-sm font-black tracking-tight text-slate-200">
            Select Dataset
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {datasets.length === 0 ? (
            <p className="py-8 text-center font-mono text-xs text-slate-600 uppercase tracking-widest">
              No datasets uploaded
            </p>
          ) : (
            datasets.map((dataset) => {
              const isActive = selectedDataset?._id === dataset._id;

              return (
                <div
                  key={dataset._id}
                  onClick={() => handleSelectDataset(dataset)}
                  className={`group relative flex flex-col rounded-xl border p-3.5 transition-all duration-200 select-none cursor-pointer ${
                    isActive
                      ? "border-indigo-500/40 bg-indigo-500/5 shadow-md shadow-black/30"
                      : "border-slate-900 bg-slate-950/40 hover:border-slate-800 hover:bg-slate-900/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
                        isActive
                          ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                          : "bg-slate-900 border-slate-800 text-slate-500 group-hover:text-slate-400"
                      }`}
                    >
                      {fileIcon(dataset.fileType)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-xs font-semibold ${
                          isActive
                            ? "text-slate-100"
                            : "text-slate-300 transition-colors group-hover:text-slate-100"
                        }`}
                      >
                        {dataset.originalName}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 font-mono text-[9px] text-slate-500 uppercase tracking-wider">
                        <span>{formatSize(dataset.sizeBytes)}</span>
                        <span>•</span>
                        <span
                          className={
                            dataset.status === "ready" || dataset.status === "profiled"
                              ? "text-emerald-500/80"
                              : dataset.status === "failed"
                              ? "text-rose-500/80"
                              : "text-amber-500/80"
                          }
                        >
                          {STATUS_LABEL[dataset.status] || dataset.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* ── RIGHT PANEL: CHAT ──────────────────────────────────────────────────── */}
      <main className="relative z-10 flex flex-1 flex-col bg-slate-950/10">
        <header className="flex h-[69px] items-center justify-between border-b border-slate-900 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="font-mono text-xs uppercase tracking-widest text-slate-500">
              Active dataset:
            </div>
            {selectedDataset ? (
              <span className="rounded bg-indigo-500/5 border border-indigo-500/20 px-2.5 py-1 font-mono text-xs font-bold text-indigo-400">
                {selectedDataset.originalName}
              </span>
            ) : (
              <span className="font-mono text-xs text-rose-400 uppercase tracking-wider animate-pulse">
                No dataset selected
              </span>
            )}
          </div>
          <div className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">
            InsightFlow AI · Secure
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => {
            const isAI = msg.role === "assistant";
            return (
              <div
                key={msg.id}
                className={`flex w-full ${isAI ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-2xl rounded-2xl border p-4 backdrop-blur-sm shadow-sm ${
                    isAI
                      ? "border-slate-900 bg-slate-950/40 text-slate-300"
                      : "border-indigo-500/20 bg-indigo-500/5 text-slate-100"
                  }`}
                >
                  <div className="font-mono text-[9px] uppercase tracking-wider text-slate-500 mb-1.5">
                    {isAI ? "◇ InsightFlow AI" : "◆ You"}
                  </div>
                  <p className="text-xs leading-relaxed tracking-wide whitespace-pre-wrap">
                    {msg.text}
                  </p>
                </div>
              </div>
            );
          })}

          {isProcessing && (
            <div className="flex w-full justify-start">
              <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-4 flex items-center gap-2">
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:300ms]" />
                </span>
                <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">
                  Analyzing…
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <footer className="border-t border-slate-900 p-4 bg-slate-950/40 backdrop-blur-md">
          <div className="mx-auto max-w-4xl relative">
            <textarea
              rows={1}
              disabled={!selectedDataset || isProcessing}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                selectedDataset
                  ? `Ask anything about "${selectedDataset.originalName}"… (Enter to send)`
                  : "Select a dataset on the left to begin…"
              }
              className="w-full resize-none rounded-xl border border-slate-900 bg-[#030712] py-3.5 pl-4 pr-32 text-xs text-slate-200 placeholder:text-slate-600 focus:border-indigo-500/40 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 transition-colors leading-relaxed"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || !selectedDataset || isProcessing}
                className="rounded-lg bg-indigo-600 px-4 py-2 font-mono text-[10px] uppercase font-bold tracking-widest text-white transition-all hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-600/20 disabled:text-slate-500"
              >
                Send
              </button>
            </div>
          </div>
          <p className="mt-2 text-center font-mono text-[9px] text-slate-700 uppercase tracking-widest">
            Shift + Enter for new line
          </p>
        </footer>
      </main>
    </div>
  );
}