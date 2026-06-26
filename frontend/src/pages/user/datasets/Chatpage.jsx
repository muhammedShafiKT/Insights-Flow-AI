import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Bot, Copy, SendHorizontal, User, Database, ChevronRight, FileText, Terminal, Sparkles } from "lucide-react";
import { useChat } from "../../../hooks/Usechat.js";
import api from "../../../services/api.js";

const STATUS_LABEL = {
  uploading: "Uploading…",
  uploaded: "Queued",
  processing: "Profiling…",
  profiled: "Profiled",
  ready: "Ready",
  failed: "Failed",
};

// ─── Typing Indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex w-full justify-start items-start gap-3.5 animate-fadeIn">
      <Avatar />
      <div className="rounded-2xl rounded-tl-none border border-slate-800/80 bg-slate-900/40 px-4 py-3 backdrop-blur-sm shadow-xl">
        <div className="flex items-center gap-1.5 py-1 px-1">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="h-2 w-2 animate-bounce rounded-full bg-indigo-400/80"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ isUser }) {
  return (
    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all ${
      isUser
        ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.15)]"
        : "bg-slate-900 border-slate-800 text-slate-400"
    }`}>
      {isUser ? <User size={15} strokeWidth={2.5} /> : <Bot size={15} strokeWidth={2.5} />}
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ role, content }) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(content)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
      .catch(console.error);
  };

  return (
    <div className={`flex w-full items-start gap-3.5 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <Avatar isUser={false} />}

      <div className={`flex flex-col max-w-[75%] group ${isUser ? "items-end" : "items-start"}`}>
        <div className={`rounded-2xl px-4 py-3 text-[13px] leading-6 tracking-wide shadow-xl backdrop-blur-sm border transition-all ${
          isUser
            ? "rounded-tr-none border-indigo-500/30 bg-indigo-600/10 text-slate-100 shadow-indigo-950/20"
            : "rounded-tl-none border-slate-800/60 bg-slate-950/30 text-slate-300"
        }`}>
          <p className="whitespace-pre-wrap break-words font-sans">{content}</p>
        </div>

        {!isUser && (
          <button
            onClick={copy}
            className="mt-1 flex items-center gap-1 rounded-lg px-2 py-0.5 font-mono text-[10px] tracking-wide text-slate-500 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-slate-900 hover:text-slate-300 transition-opacity"
          >
            <Copy size={10} /> {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>

      {isUser && <Avatar isUser={true} />}
    </div>
  );
}

// ─── Dataset Selector ─────────────────────────────────────────────────────────

function DatasetSelector({ currentId, onSelect }) {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/datasets")
      .then(({ data }) => setDatasets(data.datasets || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-900/50 border border-slate-900/30" />
        ))}
      </div>
    );
  }

  if (!datasets.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-8 text-center h-48">
        <Database size={20} className="text-slate-700" />
        <p className="font-mono text-[10px] uppercase tracking-wider text-slate-600">No active structures</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2 overflow-y-auto p-4 flex-1">
      {datasets.map((ds) => {
        const isActive = ds._id === currentId;
        return (
          <li key={ds._id}>
            <button
              type="button"
              onClick={() => onSelect(ds._id)}
              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 select-none ${
                isActive
                  ? "border-indigo-500/40 bg-indigo-500/10 text-white shadow-inner shadow-black/20"
                  : "border-slate-900 bg-slate-950/40 text-slate-400 hover:border-slate-800 hover:bg-slate-900/20 hover:text-slate-200"
              }`}
            >
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                isActive ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" : "bg-slate-900 border-slate-800 text-slate-600"
              }`}>
                <FileText size={13} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`truncate text-xs font-semibold ${isActive ? "text-slate-200" : "text-slate-400"}`}>
                  {ds.originalName}
                </p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-500">
                  {STATUS_LABEL[ds.status] || ds.status}
                </p>
              </div>
              {isActive && <ChevronRight size={13} className="shrink-0 text-indigo-400 animate-pulse" />}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

const SUGGESTIONS = ["Total rows count", "Average revenue value", "Scan missing values", "Expose top 10 rows"];

function EmptyState({ onSuggest, hasDataset }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center max-w-xl mx-auto text-center px-4 animate-fadeIn">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/50 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
        <Sparkles size={20} strokeWidth={1.5} />
      </div>
      <h2 className="text-base font-bold text-slate-200 tracking-tight">AI Data Analysis Terminal</h2>
      <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
        {hasDataset
          ? "Dataset loaded. Ask anything about your data."
          : "Select a dataset from the left panel to begin."}
      </p>

      {hasDataset && (
        <div className="mt-8 grid grid-cols-2 gap-2.5 w-full">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSuggest(s)}
              className="rounded-xl border border-slate-900 bg-slate-950/40 p-3 font-mono text-[10px] uppercase font-bold tracking-wider text-slate-400 transition-all hover:border-slate-800 hover:bg-slate-900/30 hover:text-slate-200 text-center"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Chat Input ───────────────────────────────────────────────────────────────

function ChatInput({ loading, onSend, disabled }) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim() || loading || disabled) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <footer className="border-t border-slate-900 bg-slate-950/40 backdrop-blur-md p-4 shrink-0">
      <div className="mx-auto max-w-4xl">
        <div className={`flex items-end gap-3 rounded-xl border bg-[#030712] p-3 transition-colors duration-200 ${
          disabled ? "border-slate-950 opacity-40 cursor-not-allowed" : "border-slate-900 focus-within:border-indigo-500/40"
        }`}>
          <textarea
            rows={1}
            value={text}
            disabled={loading || disabled}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); }
            }}
            placeholder={disabled ? "Select a dataset to start chatting..." : "Ask anything about your data..."}
            className="max-h-36 flex-1 resize-none bg-transparent py-1.5 text-xs text-slate-200 outline-none placeholder:text-slate-600 leading-relaxed disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={submit}
            disabled={loading || !text.trim() || disabled}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition-all hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-900 disabled:text-slate-600"
          >
            <SendHorizontal size={14} />
          </button>
        </div>
        <div className="mt-2.5 text-center font-mono text-[9px] uppercase tracking-widest text-slate-600 select-none">
          Enter to send · Shift + Enter for new line
        </div>
      </div>
    </footer>
  );
}

// ─── ChatPage ─────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { messages, dataset, loading, sendMessage, bottomRef } = useChat(id);

  return (
    // NOTE: no h-screen/w-screen/absolute here — this fills the content
    // slot your main layout (sidebar + content area) already provides.
    // Parent route wrapper needs a definite height (e.g. h-screen on the
    // layout root) for this h-full chain to resolve correctly.
    <div className="relative flex h-full min-h-0 w-full overflow-hidden bg-[#030712] text-slate-100 selection:bg-indigo-500/30">

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* ── Dataset sidebar (inner, dataset-scoped — separate from your main app sidebar) ── */}
      <aside className="relative z-10 flex w-72 shrink-0 flex-col border-r border-slate-900 bg-slate-950/40 backdrop-blur-md">
        <div className="border-b border-slate-900 p-4 shrink-0">
          <div className="flex items-center gap-2">
            <Terminal size={13} className="text-slate-500" />
            <h2 className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Context Pipeline
            </h2>
          </div>
        </div>
        <DatasetSelector currentId={id} onSelect={(dsId) => navigate(`/chat/${dsId}`)} />
      </aside>

      {/* ── Main ── */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden bg-slate-950/10 min-w-0">

        {/* Header */}
        <header className="flex h-[60px] items-center border-b border-slate-900 px-6 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500 shrink-0">BOUND_STREAM:</span>
            <p className="truncate font-mono text-xs font-bold text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-2 py-0.5 rounded">
              {dataset?.originalName ?? (id ? "LOCKING_CORE…" : "NULL_VECTOR")}
            </p>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto w-full max-w-4xl flex flex-col min-h-full space-y-6">
            {messages.length === 0 ? (
              <EmptyState onSuggest={sendMessage} hasDataset={!!id} />
            ) : (
              messages.map((msg, i) => (
                <MessageBubble key={i} role={msg.role} content={msg.content} />
              ))
            )}
            {loading && <TypingIndicator />}
            <div ref={bottomRef} className="h-2" />
          </div>
        </div>

        {/* Input */}
        <ChatInput loading={loading} onSend={sendMessage} disabled={!id} />

      </div>
    </div>
  );
}