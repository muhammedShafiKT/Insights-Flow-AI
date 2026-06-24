import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDashboard } from "../../../services/dashboard.api.js";
import ChartRenderer from "./chartRenderer.jsx";

// ─── CROSS-CHART AGGREGATE ENGINE ──────────────────────────────────────────
function computeExecutiveMetrics(charts = []) {
  let globalTotalCount = 0;
  let detectedPeaks = [];
  let uniqueKeys = new Set();

  charts.forEach((c) => {
    if (c?.data && Array.isArray(c.data)) {
      globalTotalCount += c.data.length;
      
      // Attempt to look for standout values
      const y = c.yField || "value";
      const x = c.xField || "name";
      c.data.forEach((d) => {
        const val = Number(d[y]);
        if (!isNaN(val)) {
          detectedPeaks.push({ label: d[x] || "Unlabeled Vector", value: val });
        }
      });
      if (c.chartType) uniqueKeys.add(c.chartType);
    }
  });

  // Extract the true peak outlier across all graphs
  const truePeak = detectedPeaks.length > 0 
    ? detectedPeaks.reduce((max, current) => current.value > max.value ? current : max, detectedPeaks[0])
    : null;

  return {
    totalVectors: globalTotalCount,
    distinctLayouts: uniqueKeys.size,
    peakMetric: truePeak,
  };
}

export default function Dashboard() {
  const { id } = useParams();

  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [id]);

  async function loadDashboard() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDashboard(id);
      setDashboard(data);
    } catch (err) {
      console.error("Dashboard load failed:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Failed to load dashboard parameters");
    } finally {
      setIsLoading(false);
    }
  }

  // ─── LOADING STATE ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#030712] font-mono text-xs text-slate-500 gap-3">
        <div className="relative flex h-5 w-5 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-25" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600" />
        </div>
        SYNCHRONIZING_TELEMETRY_CANVAS...
      </div>
    );
  }

  // ─── ERROR STATE ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030712] p-8">
        <div className="w-full max-w-md rounded-2xl border border-rose-950 bg-rose-950/10 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            CRITICAL_CORE_EXCEPTION
          </div>
          <p className="text-sm leading-relaxed text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  // ─── EMPTY STATE ───────────────────────────────────────────────────────────
  if (!dashboard || !dashboard.charts || dashboard.charts.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030712] font-mono text-xs text-slate-600">
        CANVAS_INITIALIZATION_EMPTY: NO DATA STREAM DEFINITIONS
      </div>
    );
  }

  // Derive deep meta insights from the raw arrays
  const summaryMeta = computeExecutiveMetrics(dashboard.charts);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Background Cyber-Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 py-12 md:px-8">
        
        {/* ─── CANVAS HEADER ─────────────────────────────────────────────────── */}
        <header className="relative mb-10 flex flex-col gap-4 border-b border-slate-900 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <span className="rounded bg-indigo-500/10 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                Live Framework
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">ID: {id || "root-node"}</p>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-100 sm:text-3xl">
              {dashboard.title || "Operational Intelligence Canvas"}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Interactive high-fidelity analysis matrix synthesizing multi-source target datasets.
            </p>
          </div>
        </header>

        {/* ─── AI CENTRAL EXECUTIVE MATRIX (CROSS-CHART ANALYSES) ─────────── */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          
          {/* Bento Block 1: Overview synthesis */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-900 bg-slate-950/40 p-5 backdrop-blur-md">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-500/5 blur-xl" />
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Integrated Canvas Profile</p>
            <p className="text-xs leading-relaxed text-slate-400">
              Cross-evaluating <span className="font-semibold text-slate-200">{summaryMeta.distinctLayouts} structural chart topologies</span> running across a centralized pipeline array.
            </p>
          </div>

          {/* Bento Block 2: Vector density counter */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-900 bg-slate-950/40 p-5 backdrop-blur-md">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-cyan-500/5 blur-xl" />
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Telemetry Coordinates</p>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-300">
                {summaryMeta.totalVectors}
              </span>
              <span className="text-[10px] font-medium text-slate-500">Total data indices tracked</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Real-time array monitoring active.</p>
          </div>

          {/* Bento Block 3: Dynamic multi-graph peak finder */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-900 bg-slate-950/40 p-5 backdrop-blur-md">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/5 blur-xl" />
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Absolute Peak Threshold</p>
            {summaryMeta.peakMetric ? (
              <p className="text-xs leading-relaxed text-slate-400">
                Global maximum identified inside vector <span className="font-semibold text-emerald-400">"{summaryMeta.peakMetric.label}"</span> registering at <span className="font-mono font-bold text-slate-200">{summaryMeta.peakMetric.value.toLocaleString()}</span> units.
              </p>
            ) : (
              <p className="text-xs text-slate-500">No scalable outliers calculated in current stream batch.</p>
            )}
          </div>

        </section>

        {/* ─── MAIN CHARTS CORE CANVAS GRID ───────────────────────────────────── */}
        <main className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {dashboard.charts.map((chart, index) => (
            <div key={index} className="transition-all duration-300">
              <ChartRenderer chart={chart} />
            </div>
          ))}
        </main>

        {/* ─── FOOTER TELEMETRY SIGN-OFF ─────────────────────────────────────── */}
        <footer className="mt-16 border-t border-slate-900 pt-6 text-center">
          <p className="font-mono text-[10px] text-slate-600 tracking-wider uppercase">
            System Canvas Operational Architecture · Protocol Stable
          </p>
        </footer>

      </div>
    </div>
  );
}