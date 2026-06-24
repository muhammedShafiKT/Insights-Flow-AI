import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCandidates, generateDashboard } from "../../../services/dashboard.api.js";

const MAX_SELECTED = 8;

// ─── Chart-type variants per category (must match backend CHART_VARIANTS) ──
const CHART_VARIANTS = {
  distribution: ["histogram", "boxplot", "areaDistribution"],
  comparison: ["bar", "horizontalBar", "pie", "donut"],
  correlation: ["scatter", "bubble", "lineFit"],
  trend: ["line", "area", "bar"],
};

const VARIANT_LABELS = {
  histogram: "Histogram",
  boxplot: "Box plot",
  areaDistribution: "Area",
  bar: "Bar",
  horizontalBar: "Horizontal bar",
  pie: "Pie",
  donut: "Donut",
  scatter: "Scatter",
  bubble: "Bubble",
  lineFit: "Trend line",
  line: "Line",
  area: "Area",
};

// ─── Section meta (High-Fidelity Dark Canvas Theme) ──────────────────────────
const SECTIONS = [
  {
    type: "distribution",
    title: "Distribution Dynamics",
    description: "Understand mathematical spread and metric density configurations",
    icon: "📊",
    accent: "text-emerald-400",
    accentBg: "bg-emerald-500/5",
    accentBorder: "border-emerald-500/20",
    dot: "bg-emerald-400",
    selBg: "bg-emerald-500/5",
    selBorder: "border-emerald-500/50",
  },
  {
    type: "comparison",
    title: "Comparative Vectors",
    description: "Evaluate quantitative metrics against categorical parameters",
    icon: "📈",
    accent: "text-indigo-400",
    accentBg: "bg-indigo-500/5",
    accentBorder: "border-indigo-500/20",
    dot: "bg-indigo-400",
    selBg: "bg-indigo-500/5",
    selBorder: "border-indigo-500/50",
  },
  {
    type: "correlation",
    title: "Relational Correlation",
    description: "Trace structural dependencies between multidimensional variables",
    icon: "🔗",
    accent: "text-amber-400",
    accentBg: "bg-amber-500/5",
    accentBorder: "border-amber-500/20",
    dot: "bg-amber-400",
    selBg: "bg-amber-500/5",
    selBorder: "border-amber-500/50",
  },
  {
    type: "trend",
    title: "Temporal Trends",
    description: "Monitor sequence trajectory parameters across chronological bounds",
    icon: "📉",
    accent: "text-rose-400",
    accentBg: "bg-rose-500/5",
    accentBorder: "border-rose-500/20",
    dot: "bg-rose-400",
    selBg: "bg-rose-500/5",
    selBorder: "border-rose-500/50",
  },
];

function humanize(str) {
  return String(str || "").replace(/_/g, " ");
}

function getLabel(c) {
  if (c.type === "distribution") return humanize(c.column);
  if (c.type === "comparison") return `${humanize(c.metric)} by ${humanize(c.category)}`;
  if (c.type === "correlation") return `${humanize(c.x)} vs ${humanize(c.y)}`;
  if (c.type === "trend") return `${humanize(c.metric)} over time`;
  return "";
}

function getSubLabel(c) {
  const variantLabel = VARIANT_LABELS[c.chartVariant] || VARIANT_LABELS[CHART_VARIANTS[c.type]?.[0]];
  if (c.type === "distribution") return variantLabel;
  if (c.type === "comparison") return `${variantLabel} · ${humanize(c.category)}`;
  if (c.type === "correlation") return variantLabel;
  if (c.type === "trend") return variantLabel;
  return "";
}

// ─── Variant pill picker ───────────────────────────────────────────────────
function VariantPicker({ type, value, onChange }) {
  const variants = CHART_VARIANTS[type] || [];
  if (variants.length <= 1) return null;

  return (
    <div
      className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-900 pt-2.5"
      onClick={(e) => e.stopPropagation()}
    >
      {variants.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider transition-all duration-200 ${
            value === v
              ? "bg-slate-100 font-bold text-slate-950"
              : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200"
          }`}
        >
          {VARIANT_LABELS[v] || v}
        </button>
      ))}
    </div>
  );
}

// ─── Single candidate card ──────────────────────────────────────────────────
function CandidateCard({ candidate, selected, locked, section, onToggle, onVariantChange }) {
  return (
    <div
      onClick={() => !locked && onToggle(candidate.id)}
      role="checkbox"
      aria-checked={selected}
      tabIndex={locked ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !locked) onToggle(candidate.id);
      }}
      className={`group flex flex-col rounded-xl border p-4 transition-all duration-200 select-none ${
        locked
          ? "cursor-not-allowed opacity-25 border-slate-900 bg-slate-950/20"
          : selected
          ? `cursor-pointer ${section.selBg} ${section.selBorder} shadow-lg shadow-black/40`
          : "cursor-pointer border-slate-900 bg-slate-950/40 hover:border-slate-800 hover:bg-slate-900/20"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-4 w-4 shrink-0 mt-0.5 items-center justify-center rounded border transition-colors ${
            selected ? `${section.dot} border-transparent` : "border-slate-800 bg-transparent group-hover:border-slate-700"
          }`}
        >
          {selected && (
            <svg className="h-2.5 w-2.5 text-slate-950" fill="none" viewBox="0 0 9 9">
              <path
                d="M1.5 4.5l2 2L7.5 2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className={`truncate text-sm font-semibold tracking-tight transition-colors ${selected ? "text-slate-100" : "text-slate-300 group-hover:text-slate-200"}`}>
            {candidate.label}
          </div>
          <div className={`mt-0.5 font-mono text-[10px] uppercase tracking-wider ${selected ? section.accent : "text-slate-500"}`}>
            {candidate.sub}
          </div>
        </div>
      </div>

      {selected && (
        <VariantPicker
          type={candidate.type}
          value={candidate.chartVariant}
          onChange={(v) => onVariantChange(candidate.id, v)}
        />
      )}
    </div>
  );
}

// ─── Section block ───────────────────────────────────────────────────────────
function Section({ section, candidates, selected, onToggle, onVariantChange, totalSelected }) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(true);

  const filtered = useMemo(() => {
    if (!query.trim()) return candidates;
    return candidates.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));
  }, [candidates, query]);

  const sectionSelectedCount = candidates.filter((c) => selected.has(c.id)).length;

  return (
    <div className={`overflow-hidden rounded-2xl border ${section.accentBorder} bg-slate-950/20 backdrop-blur-md`}>
      <div
        className={`flex cursor-pointer items-center gap-4 px-6 py-4 transition-colors ${section.accentBg} ${
          expanded ? `border-b ${section.accentBorder}` : ""
        }`}
        onClick={() => setExpanded((e) => !e)}
      >
        <span className="text-xl bg-slate-950/40 p-2 rounded-lg border border-slate-900">{section.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
            {section.title}
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-950/60 border border-slate-800 text-slate-400">
              {candidates.length} AVAILABLE
            </span>
            {sectionSelectedCount > 0 && (
              <span className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-slate-950 ${section.dot}`}>
                {sectionSelectedCount} ACTIVE
              </span>
            )}
          </div>
          <div className={`mt-0.5 text-xs ${section.accent}`}>{section.description}</div>
        </div>
        <span className={`text-slate-500 font-mono text-xs transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>
          ▼
        </span>
      </div>

      {expanded && (
        <div className="p-5">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder={`Search schema parameters inside ${section.title.toLowerCase()}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-xl border border-slate-900 bg-slate-950/40 px-4 py-2.5 font-mono text-xs text-slate-200 placeholder:text-slate-600 focus:border-indigo-500/40 focus:outline-none transition-colors"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="py-8 text-center font-mono text-xs text-slate-600 uppercase tracking-wider">No matching coordinate matrices found</p>
          ) : (
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
              {filtered.map((c) => (
                <CandidateCard
                  key={c.id}
                  candidate={c}
                  selected={selected.has(c.id)}
                  locked={!selected.has(c.id) && totalSelected >= MAX_SELECTED}
                  section={section}
                  onToggle={onToggle}
                  onVariantChange={onVariantChange}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function ChartSelectorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rawCandidates, setRawCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [variantOverrides, setVariantOverrides] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const data = await getCandidates(id);
        if (!cancelled) setRawCandidates(data || []);
      } catch (err) {
        if (!cancelled) {
          setLoadError(err.response?.data?.message || err.message || "Failed to load structural metadata array");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const candidates = useMemo(
    () =>
      rawCandidates.map((c, i) => {
        const defaultVariant = CHART_VARIANTS[c.type]?.[0];
        const withVariant = {
          ...c,
          id: i,
          chartVariant: variantOverrides[i] || defaultVariant,
          label: getLabel(c),
        };
        return { ...withVariant, sub: getSubLabel(withVariant) };
      }),
    [rawCandidates, variantOverrides]
  );

  const byType = useMemo(() => {
    const map = {};
    candidates.forEach((c) => {
      if (!map[c.type]) map[c.type] = [];
      map[c.type].push(c);
    });
    return map;
  }, [candidates]);

  function toggle(candidateId) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(candidateId)) {
        next.delete(candidateId);
      } else if (next.size < MAX_SELECTED) {
        next.add(candidateId);
      }
      return next;
    });
  }

  function setVariant(candidateId, variant) {
    setVariantOverrides((prev) => ({ ...prev, [candidateId]: variant }));
  }

  function clearAll() {
    setSelected(new Set());
  }

  const selectedCandidates = [...selected]
    .map((cid) => candidates.find((c) => c.id === cid))
    .filter(Boolean);

  async function handleGenerate() {
    if (selectedCandidates.length === 0) return;
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const payload = selectedCandidates.map(({ id: _cid, label, sub, ...rest }) => rest);
      await generateDashboard(id, payload);
      navigate(`/datasets/${id}/dashboard`);
    } catch (err) {
      setGenerateError(err.response?.data?.message || err.message || "Pipeline orchestration failure");
    } finally {
      setIsGenerating(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#030712] font-mono text-xs text-slate-500 gap-3">
        <div className="relative flex h-5 w-5 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-25" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600" />
        </div>
        ANALYZING_DATASET_SCHEMA_METRIC_VECTORS...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030712] p-8">
        <div className="w-full max-w-md rounded-2xl border border-rose-950 bg-rose-950/10 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            SCHEMA_LOAD_EXCEPTION
          </div>
          <p className="text-sm leading-relaxed text-slate-400">{loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Cyber-Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* ─── HUD HEADS-UP CONTROL MONITOR ─────────────────────────────────── */}
      <div className="sticky top-0 z-50 border-b border-slate-900 bg-[#030712]/80 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto max-w-5xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 ring-1 ring-indigo-500/20 text-indigo-400 font-mono text-sm font-bold">
              ∑
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-slate-100">Canvas Constructor Architecture</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                Select configurations. Max allocation threshold: {MAX_SELECTED} matrices.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-900 px-3.5 py-1.5 rounded-xl">
              <div className="flex gap-1.5">
                {Array.from({ length: MAX_SELECTED }, (_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                      i < selected.size ? "bg-indigo-400 shadow-[0_0_8px_#818cf8]" : "bg-slate-800"
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono text-xs text-slate-500 border-l border-slate-800 pl-3">
                <strong className="font-bold text-slate-200">{selected.size}</strong> / {MAX_SELECTED}
              </span>
            </div>

            <button
              onClick={clearAll}
              disabled={selected.size === 0}
              className="rounded-xl border border-slate-900 bg-slate-950/40 px-4 py-2 font-mono text-xs uppercase tracking-wider text-slate-400 transition-colors hover:bg-slate-900 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-20"
            >
              Reset
            </button>

            <button
              onClick={handleGenerate}
              disabled={selected.size === 0 || isGenerating}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 font-mono text-xs uppercase tracking-widest font-bold text-white transition-all hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-600/20 disabled:text-slate-500 shadow-lg shadow-indigo-600/10"
            >
              {isGenerating ? "COMPILE..." : "COMPILE_CANVAS →"}
            </button>
          </div>
        </div>
      </div>

      {/* Error notification banner */}
      {generateError && (
        <div className="border-b border-rose-500/20 bg-rose-500/5 px-6 py-3 font-mono text-xs text-center text-rose-400">
          ⚠️ PIPELINE CORE ERROR: {generateError}
        </div>
      )}

      {/* Selected pills stream overview */}
      {selectedCandidates.length > 0 && (
        <div className="border-b border-slate-900 bg-slate-950/20 backdrop-blur-md px-6 py-3">
          <div className="mx-auto max-w-5xl flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 mr-1">Active Pipeline Index:</span>
            {selectedCandidates.map((c) => (
              <div
                key={c.id}
                className="flex max-w-[220px] items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-2.5 py-1 text-xs text-indigo-300 font-medium"
              >
                <span className="truncate">{c.label}</span>
                <button
                  onClick={() => toggle(c.id)}
                  aria-label={`Remove ${c.label}`}
                  className="text-sm font-light text-indigo-500 hover:text-indigo-300 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Structural Layout Grid */}
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10 pb-32">
        {candidates.length === 0 && (
          <p className="py-16 text-center font-mono text-xs uppercase tracking-widest text-slate-600">
            No structural candidate dimensions calculated inside source array.
          </p>
        )}
        
        {SECTIONS.map((section) => {
          const sectionCandidates = byType[section.type] || [];
          if (sectionCandidates.length === 0) return null;
          return (
            <Section
              key={section.type}
              section={section}
              candidates={sectionCandidates}
              selected={selected}
              onToggle={toggle}
              onVariantChange={setVariant}
              totalSelected={selected.size}
            />
          );
        })}
      </div>

      {/* High-Fidelity Floating Trigger Matrix */}
      {selected.size === MAX_SELECTED && (
        <div
          onClick={handleGenerate}
          className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 cursor-pointer items-center gap-4 whitespace-nowrap rounded-2xl border border-indigo-500/30 bg-indigo-950/80 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-950/50 backdrop-blur-lg hover:border-indigo-400 transition-all duration-300"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-indigo-200">Matrix Allocation Satisfied</span>
          </div>
          <div className="h-4 w-px bg-indigo-500/20" />
          <span className="font-mono text-xs uppercase tracking-widest font-black text-white">
            {isGenerating ? "Compiling Vector Map..." : "Launch Operations Matrix"}
          </span>
        </div>
      )}
    </div>
  );
}