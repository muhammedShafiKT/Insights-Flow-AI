import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDashboard } from "../../../services/dashboard.api.js";
import ChartRenderer from "./charts/chartRenderer.jsx";
import api from "../../../services/api.js";
import { Database, FileText, ChevronRight, LayoutDashboard, RefreshCw } from "lucide-react";

// ─── Dataset Selector Sidebar ─────────────────────────────────────────────────

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
          <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-800/50" />
        ))}
      </div>
    );
  }

  if (!datasets.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
        <Database size={24} className="text-slate-600" />
        <p className="text-xs text-slate-500">No datasets uploaded yet.</p>
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
                  {ds.status}
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

// ─── Generate Dashboard Panel ─────────────────────────────────────────────────

function GenerateDashboardPanel({ id }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
          <LayoutDashboard size={28} className="text-indigo-400" />
        </div>
        <h2 className="text-lg font-bold text-slate-100">No dashboard yet</h2>
        <p className="max-w-sm text-sm text-slate-400">
          Select charts and configure your dashboard to visualize this dataset.
        </p>
      </div>
      <button
        onClick={() => navigate(`/datasets/${id}/charts`)}
        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        <LayoutDashboard size={15} />
        Generate Dashboard
      </button>
    </div>
  );
}

// ─── Cross-chart aggregate engine ─────────────────────────────────────────────

function computeExecutiveMetrics(charts = []) {
  let globalTotalCount = 0;
  let detectedPeaks = [];
  let uniqueKeys = new Set();

  charts.forEach((c) => {
    if (c?.data && Array.isArray(c.data)) {
      globalTotalCount += c.data.length;
      const y = c.yField || "value";
      const x = c.xField || "name";
      c.data.forEach((d) => {
        const val = Number(d[y]);
        if (!isNaN(val)) detectedPeaks.push({ label: d[x] || "Unlabeled Vector", value: val });
      });
      if (c.chartType) uniqueKeys.add(c.chartType);
    }
  });

  const truePeak = detectedPeaks.length > 0
    ? detectedPeaks.reduce((max, cur) => cur.value > max.value ? cur : max, detectedPeaks[0])
    : null;

  return { totalVectors: globalTotalCount, distinctLayouts: uniqueKeys.size, peakMetric: truePeak };
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadDashboard = () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    setDashboard(null);
    getDashboard(id)
      .then(setDashboard)
      .catch((err) => setError(err.response?.data?.message || "Failed to load dashboard"))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { loadDashboard(); }, [id]);

  const hasCharts = dashboard?.charts?.length > 0;
  const summaryMeta = hasCharts ? computeExecutiveMetrics(dashboard.charts) : null;

  return (
    // NOTE: no h-screen/w-screen here — this component fills whatever
    // container the parent layout (main sidebar + content area) gives it.
    <div className="relative flex h-full min-h-0 w-full overflow-hidden bg-[#030712] text-slate-100 selection:bg-indigo-500/30">

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* ── Dataset sidebar (inner, dataset-scoped — separate from your main app sidebar) ── */}
      <aside className="relative z-10 flex w-64 shrink-0 flex-col border-r border-slate-900 bg-slate-950/40 backdrop-blur-md">
        <div className="border-b border-slate-900 p-4 shrink-0">
          <div className="flex items-center gap-2">
            <Database size={13} className="text-slate-500" />
            <h2 className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">Datasets</h2>
          </div>
        </div>
        <DatasetSelector
          currentId={id}
          onSelect={(dsId) => navigate(`/datasets/${dsId}/dashboard`)}
        />
      </aside>

      {/* ── Main ── */}
      <div className="relative z-10 flex flex-1 flex-col overflow-y-auto min-w-0">

        {/* No dataset selected */}
        {!id && (
          <div className="flex flex-1 items-center justify-center font-mono text-xs text-slate-600">
            SELECT A DATASET TO VIEW ITS DASHBOARD
          </div>
        )}

        {/* Loading */}
        {id && isLoading && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 font-mono text-xs text-slate-500">
            <div className="relative flex h-5 w-5 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-25" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-indigo-600" />
            </div>
            SYNCHRONIZING_TELEMETRY_CANVAS...
          </div>
        )}

        {/* API error */}
        {id && !isLoading && error && (
          <div className="flex flex-1 items-center justify-center p-8">
            <div className="w-full max-w-md rounded-2xl border border-rose-950 bg-rose-950/10 p-5">
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-2">
                CRITICAL_CORE_EXCEPTION
              </p>
              <p className="text-sm text-slate-400">{error}</p>
            </div>
          </div>
        )}

        {/* No dashboard yet → show generate panel */}
        {id && !isLoading && !error && !hasCharts && (
          <GenerateDashboardPanel id={id} onGenerated={loadDashboard} />
        )}

        {/* Dashboard charts */}
        {id && !isLoading && !error && hasCharts && (
          <div className="relative mx-auto w-full max-w-7xl px-6 py-10 md:px-8">
            <div className="relative">
              <header className="mb-10 flex flex-col gap-2 border-b border-slate-900 pb-8">
                <div className="flex items-center gap-3">
                  <span className="rounded bg-indigo-500/10 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                    Live Framework
                  </span>
                  <span className="h-1 w-1 rounded-full bg-slate-700" />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">ID: {id}</p>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-2xl font-black tracking-tight text-slate-100 sm:text-3xl">
                    {dashboard.title || "Operational Intelligence Canvas"}
                  </h1>
                  <button
                    onClick={() => navigate(`/datasets/${id}/charts`)}
                    title="Regenerate dashboard"
                    className="mt-1 flex shrink-0 items-center gap-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-400 transition hover:bg-indigo-500/20"
                  >
                    <RefreshCw size={12} />
                    Regenerate
                  </button>
                </div>
                <p className="text-sm text-slate-400">
                  Interactive high-fidelity analysis matrix synthesizing multi-source target datasets.
                </p>
              </header>

              <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="relative overflow-hidden rounded-2xl border border-slate-900 bg-slate-950/40 p-5 backdrop-blur-md">
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-500/5 blur-xl" />
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Integrated Canvas Profile</p>
                  <p className="text-xs leading-relaxed text-slate-400">
                    Cross-evaluating <span className="font-semibold text-slate-200">{summaryMeta.distinctLayouts} structural chart topologies</span> running across a centralized pipeline array.
                  </p>
                </div>
                <div className="relative overflow-hidden rounded-2xl border border-slate-900 bg-slate-950/40 p-5 backdrop-blur-md">
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-cyan-500/5 blur-xl" />
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Telemetry Coordinates</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-300">
                      {summaryMeta.totalVectors}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500">Total data indices tracked</span>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-2xl border border-slate-900 bg-slate-950/40 p-5 backdrop-blur-md">
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/5 blur-xl" />
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Absolute Peak Threshold</p>
                  {summaryMeta.peakMetric ? (
                    <p className="text-xs leading-relaxed text-slate-400">
                      Global maximum: <span className="font-semibold text-emerald-400">"{summaryMeta.peakMetric.label}"</span> at{" "}
                      <span className="font-mono font-bold text-slate-200">{summaryMeta.peakMetric.value.toLocaleString()}</span>
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500">No scalable outliers in current stream batch.</p>
                  )}
                </div>
              </section>

              <main className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {dashboard.charts.map((chart, index) => (
                  <div key={index} className="transition-all duration-300">
                    <ChartRenderer chart={chart} />
                  </div>
                ))}
              </main>

              <footer className="mt-16 border-t border-slate-900 pt-6 text-center">
                <p className="font-mono text-[10px] text-slate-600 tracking-wider uppercase">
                  System Canvas Operational Architecture · Protocol Stable
                </p>
              </footer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}