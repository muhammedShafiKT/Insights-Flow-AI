import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ComposedChart,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ZAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Premium Color System
const AXIS_COLOR = "#475569";
const GRID_COLOR = "rgba(30, 41, 59, 0.4)";
const PRIMARY_ACCENT = "#6366f1"; // Indigo core
const SECONDARY_ACCENT = "#22d3ee"; // Cyber cyan

const PALETTE = [
  "url(#glow-indigo)",
  "url(#glow-cyan)",
  "#34d399",
  "#fb7185",
  "#a78bfa",
  "#fbbf24"
];

// ─── DYNAMIC INSIGHT ENGINE ──────────────────────────────────────────────────
function generateInsightText(chart) {
  try {
    const { chartType, data, yField, xField } = chart;
    if (!data || data.length === 0) return null;

    const values = data.map(d => Number(d[yField] ?? d.value)).filter(v => !isNaN(v));
    const total = values.reduce((sum, v) => sum + v, 0);
    const avg = total / (values.length || 1);
    const maxVal = Math.max(...values);

    switch (chartType) {
      case "bar":
      case "horizontalBar": {
        const topItem = data.reduce((max, item) => Number(item[yField]) > Number(max[yField]) ? item : max, data[0]);
        return `Top performer identified as "${topItem[xField]}" at ${Number(topItem[yField]).toLocaleString()}, outperforming baseline averages by ${(((Number(topItem[yField]) - avg) / (avg || 1)) * 100).toFixed(0)}%.`;
      }
      case "pie":
      case "donut": {
        const sorted = [...data].sort((a, b) => Number(b[yField]) - Number(a[yField]));
        return `"${sorted[0][xField]}" commands the sector distribution mix at ${((Number(sorted[0][yField]) / (total || 1)) * 100).toFixed(0)}% total density weight.`;
      }
      case "line":
      case "area": {
        const first = Number(data[0][yField]);
        const last = Number(data[data.length - 1][yField]);
        const pct = (((last - first) / (first || 1)) * 100).toFixed(1);
        return `Timeline trend maps a ${last >= first ? "net variance increase" : "downward adjustment"} of ${pct}% across observations, peaking at ${maxVal.toLocaleString()}.`;
      }
      default:
        return `Telemetry analysis captures ${data.length} data vectors balancing around an operational average of ${avg.toFixed(1)}.`;
    }
  } catch (e) {
    return "Telemetry array tracking structural baseline trends.";
  }
}

// ─── HIGH FIDELITY WRAPPER ───────────────────────────────────────────────────
function ChartCard({ title, insightText, children }) {
  return (
    <div className="group relative rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950/80 p-6 shadow-xl shadow-slate-950/40 backdrop-blur-sm transition-all duration-300 hover:border-slate-700 hover:shadow-2xl hover:shadow-indigo-500/5">
      {/* Top accent glow line */}
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
}

// ─── FROSTED CYBER TOOLTIP ───────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
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
};

// ─── INJECTABLE VISUAL SHADERS ────────────────────────────────────────────────
const ChartGradients = () => (
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

// ─── RE-ENGINEERED GRAPH VIEWS ────────────────────────────────────────────────

function BarChartView({ chart, insight }) {
  const { xField, yField, title } = chart;
  const data = chart.data.map(d => ({ ...d, [yField]: Number(d[yField]) }));
  return (
    <ChartCard title={title} insightText={insight}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
          <ChartGradients />
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey={xField} stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
          <YAxis stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
          <Bar dataKey={yField} fill="url(#glow-indigo)" radius={[6, 6, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function HorizontalBarChartView({ chart, insight }) {
  const { xField, yField, title } = chart;
  const data = chart.data.map(d => ({ ...d, [yField]: Number(d[yField]) }));
  return (
    <ChartCard title={title} insightText={insight}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 15, bottom: 0, left: -10 }}>
          <ChartGradients />
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" horizontal={false} />
          <XAxis type="number" stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
          <YAxis dataKey={xField} type="category" stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
          <Bar dataKey={yField} fill="url(#glow-cyan)" radius={[0, 6, 6, 0]} maxBarSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function PieChartView({ chart, donut = false, insight }) {
  const { xField, yField, title } = chart;
  const data = chart.data.map(d => ({ ...d, [yField]: Number(d[yField]) }));
  return (
    <ChartCard title={title} insightText={insight}>
      <ResponsiveContainer>
        <PieChart>
          <ChartGradients />
          <Pie
            data={data}
            dataKey={yField}
            nameKey={xField}
            cx="50%"
            cy="42%"
            outerRadius={donut ? 82 : 88}
            innerRadius={donut ? 62 : 0}
            paddingAngle={donut ? 4 : 0}
            strokeWidth={3}
            stroke="#090d16"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11, bottom: 0, fontFamily: "sans-serif", color: "#94a3b8" }} iconSize={7} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function LineChartView({ chart, insight }) {
  const { xField, yField, title } = chart;
  const data = chart.data.map(d => ({ ...d, [yField]: Number(d[yField]) }));
  return (
    <ChartCard title={title} insightText={insight}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey={xField} stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
          <YAxis stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey={yField} stroke={PRIMARY_ACCENT} strokeWidth={3} dot={{ r: 4, strokeWidth: 2, stroke: "#0f172a", fill: SECONDARY_ACCENT }} activeDot={{ r: 6, strokeWidth: 0, fill: SECONDARY_ACCENT }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function AreaTrendChartView({ chart, insight }) {
  const { xField, yField, title } = chart;
  const data = chart.data.map(d => ({ ...d, [yField]: Number(d[yField]) }));
  return (
    <ChartCard title={title} insightText={insight}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
          <ChartGradients />
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey={xField} stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
          <YAxis stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey={yField} stroke={PRIMARY_ACCENT} strokeWidth={3} fill="url(#area-gradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function ScatterChartView({ chart, insight }) {
  const { xField, yField, title } = chart;
  const data = chart.data.map(d => ({ ...d, [xField]: Number(d[xField]), [yField]: Number(d[yField]) }));
  return (
    <ChartCard title={title} insightText={insight}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" />
          <XAxis dataKey={xField} type="number" name={xField} stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
          <YAxis dataKey={yField} type="number" name={yField} stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.08)", strokeDasharray: "3 3" }} />
          <Scatter data={data} fill={PRIMARY_ACCENT} shape="circle" line={false} />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function BubbleChartView({ chart, insight }) {
  const { xField, yField, title } = chart;
  const data = chart.data.map(d => ({
    ...d,
    [xField]: Number(d[xField]),
    [yField]: Number(d[yField]),
    z: Math.abs(Number(d[xField]) * Number(d[yField])) || 1,
  }));
  return (
    <ChartCard title={title} insightText={insight}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" />
          <XAxis dataKey={xField} type="number" name={xField} stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
          <YAxis dataKey={yField} type="number" name={yField} stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
          <ZAxis dataKey="z" range={[50, 400]} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.05)" }} />
          <Scatter data={data} fill={SECONDARY_ACCENT} fillOpacity={0.4} stroke={SECONDARY_ACCENT} strokeWidth={1.5} />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function linearRegression(points, xField, yField) {
  const n = points.length;
  if (n < 2) return null;
  const sumX = points.reduce((s, p) => s + p[xField], 0);
  const sumY = points.reduce((s, p) => s + p[yField], 0);
  const sumXY = points.reduce((s, p) => s + p[xField] * p[yField], 0);
  const sumXX = points.reduce((s, p) => s + p[xField] * p[xField], 0);
  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) return null;
  return { slope: (n * sumXY - sumX * sumY) / denom, intercept: (sumY - ((n * sumXY - sumX * sumY) / denom) * sumX) / n };
}

function LineFitChartView({ chart, insight }) {
  const { xField, yField, title } = chart;
  const data = chart.data
    .map(d => ({ ...d, [xField]: Number(d[xField]), [yField]: Number(d[yField]) }))
    .sort((a, b) => a[xField] - b[xField]);

  const fit = linearRegression(data, xField, yField);
  const dataWithFit = fit ? data.map(d => ({ ...d, fit: fit.slope * d[xField] + fit.intercept })) : data;

  return (
    <ChartCard title={title} insightText={insight}>
      <ResponsiveContainer>
        <ComposedChart data={dataWithFit} margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" />
          <XAxis dataKey={xField} type="number" stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
          <YAxis type="number" stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Scatter dataKey={yField} fill={PRIMARY_ACCENT} />
          {fit && <Line dataKey="fit" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />}
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function buildHistogram(values, binCount = 8) {
  if (!values.length) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) return [{ bucket: String(min), count: values.length }];

  const binSize = (max - min) / binCount;
  const bins = Array.from({ length: binCount }, (_, i) => ({ start: min + i * binSize, end: min + (i + 1) * binSize, count: 0 }));

  for (const v of values) {
    let idx = Math.floor((v - min) / binSize);
    if (idx >= binCount) idx = binCount - 1;
    if (idx < 0) idx = 0;
    bins[idx].count += 1;
  }
  return bins.map(b => ({ bucket: `${b.start.toFixed(1)}–${b.end.toFixed(1)}`, count: b.count }));
}

function DistributionChartView({ chart, insight }) {
  const { data, title } = chart;
  const values = data.map(d => Number(d.value)).filter(v => !isNaN(v));
  const histogram = buildHistogram(values);
  return (
    <ChartCard title={title} insightText={insight}>
      <ResponsiveContainer>
        <BarChart data={histogram} margin={{ top: 10, right: 10, bottom: 20, left: -25 }}>
          <ChartGradients />
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="bucket" stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 9 }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" />
          <YAxis stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="url(#glow-indigo)" radius={[5, 5, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function BoxPlotChartView({ chart }) {
  const { data, title } = chart;
  const values = data.map(d => Number(d.value)).filter(v => !isNaN(v)).sort((a, b) => a - b);
  if (values.length === 0) return null;

  const min = values[0];
  const max = values[values.length - 1];
  const q50 = values[Math.floor(values.length * 0.5)];

  const boxData = [{ name: "Bounds Array", lw: q50 - min, uw: max - q50, base: min }];

  return (
    <ChartCard title={title} insightText={`Data spreads across alpha variance borders from Min (${min.toFixed(1)}) up to Max (${max.toFixed(1)}). Current computed center midpoint marks ${q50.toFixed(1)}.`}>
      <ResponsiveContainer>
        <BarChart data={boxData} layout="vertical" margin={{ top: 25, right: 20, bottom: 10, left: -30 }}>
          <CartesianGrid stroke={GRID_COLOR} horizontal={false} strokeDasharray="4 4" />
          <XAxis type="number" domain={[min, max]} stroke={AXIS_COLOR} tick={{ fill: AXIS_COLOR, fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
          <YAxis dataKey="name" type="category" tick={false} axisLine={false} />
          <Bar dataKey="base" stackId="box" fill="transparent" />
          <Bar dataKey="lw" stackId="box" fill="#334155" barSize={3} />
          <Bar dataKey="uw" stackId="box" fill={PRIMARY_ACCENT} fillOpacity={0.6} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// ─── DESERIALIZER ROUTER ─────────────────────────────────────────────────────
export default function ChartRenderer({ chart }) {
  if (!chart || !Array.isArray(chart.data) || chart.data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950 p-8 text-center text-xs font-mono tracking-wide text-slate-500">
        <svg className="mx-auto h-6 w-6 text-slate-700 mb-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        NO_ACTIVE_TELEMETRY_LOGS
      </div>
    );
  }

  const generatedInsight = generateInsightText(chart);

  switch (chart.chartType) {
    case "bar": return <BarChartView chart={chart} insight={generatedInsight} />;
    case "horizontalBar": return <HorizontalBarChartView chart={chart} insight={generatedInsight} />;
    case "pie": return <PieChartView chart={chart} donut={false} insight={generatedInsight} />;
    case "donut": return <PieChartView chart={chart} donut={true} insight={generatedInsight} />;
    case "line": return <LineChartView chart={chart} insight={generatedInsight} />;
    case "area": return <AreaTrendChartView chart={chart} insight={generatedInsight} />;
    case "scatter": return <ScatterChartView chart={chart} insight={generatedInsight} />;
    case "bubble": return <BubbleChartView chart={chart} insight={generatedInsight} />;
    case "lineFit": return <LineFitChartView chart={chart} insight={generatedInsight} />;
    case "histogram":
    case "distribution":
    case "areaDistribution":
      return <DistributionChartView chart={chart} insight={generatedInsight} />;
    case "boxplot": return <BoxPlotChartView chart={chart} />;
    default:
      return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-xs font-mono text-slate-500">
          UNSUPPORTED_CHART_TYPE: {chart.chartType}
        </div>
      );
  }
}