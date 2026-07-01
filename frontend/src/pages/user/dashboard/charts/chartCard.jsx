import React from "react";

// Premium Color System
export const AXIS_COLOR = "#475569";
export const GRID_COLOR = "rgba(30, 41, 59, 0.4)";
export const PRIMARY_ACCENT = "#6366f1";
export const SECONDARY_ACCENT = "#22d3ee";

export const PALETTE = [
  "url(#glow-indigo)",
  "url(#glow-cyan)",
  "#34d399",
  "#fb7185",
  "#a78bfa",
  "#fbbf24"
];

// Hoisted static style objects — avoid new object literals every render
export const TICK_STYLE = { fill: AXIS_COLOR, fontSize: 10, fontFamily: "monospace" };
export const TICK_STYLE_SM = { fill: AXIS_COLOR, fontSize: 9 };
export const GRID_DASH = "4 4";

export const ChartCard = React.memo(function ChartCard({ title, insightText, children }) {
  return (
    <div className="group relative rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950/80 p-6 shadow-xl shadow-slate-950/40 backdrop-blur-sm transition-all duration-300 hover:border-slate-700 hover:shadow-2xl hover:shadow-indigo-500/5">
      <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {title && (
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-400 animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</h3>
          </div>
          <span className="font-mono text-[10px] text-slate-600 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800/80">
            SYS.RUNNING
          </span>
        </div>
      )}

      <div className="relative w-full" style={{ height: 260 }}>
        {children}
      </div>

      {insightText && (
        <div className="mt-5 flex items-start gap-3 border-t border-slate-800/80 pt-4">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096M9 21h3m-3 0H6m9.813-5.096A7.5 7.5 0 105.188 15.91M15.812 15.9a7.5 7.5 0 001.353-8.62M18 12a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </div>
          <p className="font-sans text-xs leading-relaxed text-slate-400">
            <span className="font-semibold text-slate-200 tracking-wide">AI SYNTHESIS:</span> {insightText}
          </p>
        </div>
      )}
    </div>
  );
});

export const CustomTooltip = React.memo(function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-800/80 bg-slate-950/90 p-3 font-mono shadow-2xl backdrop-blur-md ring-1 ring-white/10">
        <p className="text-[10px] font-bold text-slate-500 tracking-wider mb-2 border-b border-slate-800 pb-1 uppercase">{label}</p>
        {payload.map((pld, idx) => (
          <div key={idx} className="flex items-center gap-6 py-0.5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full shadow-sm" style={{ backgroundColor: pld.color || pld.fill || PRIMARY_ACCENT }} />
              <span className="text-xs text-slate-400 font-medium">{pld.name || "Telemetry"}:</span>
            </div>
            <span className="text-xs font-bold text-slate-100 ml-auto tracking-tight">
              {typeof pld.value === "number" ? pld.value.toLocaleString() : pld.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
});

export const ChartGradients = () => (
  <defs>
    <linearGradient id="glow-indigo" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.85} />
      <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.35} />
    </linearGradient>
    <linearGradient id="glow-cyan" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.85} />
      <stop offset="100%" stopColor="#0891b2" stopOpacity={0.35} />
    </linearGradient>
    <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.24} />
      <stop offset="40%" stopColor="#22d3ee" stopOpacity={0.06} />
      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
    </linearGradient>
  </defs>
);