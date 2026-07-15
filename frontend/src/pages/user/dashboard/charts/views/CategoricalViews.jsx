import React from "react";
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ChartCard, CustomTooltip, ChartGradients, GRID_COLOR, PALETTE, TICK_STYLE } from "../chartCard.jsx";

const LIMIT_STEPS = [10, 20, Infinity]; // Infinity = "All"

/**
 * Shared hook: sorts data by yField (desc) and slices to a step-based limit
 * that the user can cycle through: 10 -> 20 -> All -> back to 10.
 */
function useTopNData(rawData, yField, { sort = true } = {}) {
  const [step, setStep] = React.useState(0);

  const sortedData = React.useMemo(() => {
    const mapped = rawData.map(d => ({ ...d, [yField]: Number(d[yField]) }));
    if (!sort) return mapped;
    return [...mapped].sort((a, b) => b[yField] - a[yField]);
  }, [rawData, yField, sort]);

  const total = sortedData.length;
  const limit = LIMIT_STEPS[step];
  const isTruncated = total > LIMIT_STEPS[0]; // whether toggle should show at all
  const visibleData = React.useMemo(
    () => (limit === Infinity ? sortedData : sortedData.slice(0, limit)),
    [sortedData, limit]
  );

  const cycleNext = React.useCallback(() => {
    setStep(s => {
      // skip a step if total is already <= that step's limit (no point offering it)
      let next = s + 1;
      while (next < LIMIT_STEPS.length - 1 && total <= LIMIT_STEPS[next]) next++;
      if (next >= LIMIT_STEPS.length) next = 0;
      return next;
    });
  }, [total]);

  const reset = React.useCallback(() => setStep(0), []);

  return { visibleData, total, isTruncated, step, cycleNext, reset };
}

function ShowMoreToggle({ total, visibleCount, step, onCycle, onReset }) {
  if (total <= LIMIT_STEPS[0]) return null;

  const isAll = LIMIT_STEPS[step] === Infinity;
  const nextLimit = LIMIT_STEPS[Math.min(step + 1, LIMIT_STEPS.length - 1)];
  const nextLabel = nextLimit === Infinity ? "Show all" : `Show top ${nextLimit}`;

  return (
    <div className="flex items-center justify-between px-1 pb-1">
      <span className="text-[11px] text-slate-500">
        Showing {visibleCount} of {total}
      </span>
      <div className="flex items-center gap-3">
        {isAll ? (
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Show top {LIMIT_STEPS[0]}
          </button>
        ) : (
          <button
            type="button"
            onClick={onCycle}
            className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {nextLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export const BarChartView = React.memo(function BarChartView({ chart, insight }) {
  const { xField, yField, title } = chart;
  const { visibleData, total, isTruncated, step, cycleNext, reset } = useTopNData(chart.data, yField);

  return (
    <ChartCard title={title} insightText={insight}>
      <ResponsiveContainer>
        <BarChart data={visibleData} margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
          <ChartGradients />
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey={xField} stroke="#475569" tick={TICK_STYLE} axisLine={false} tickLine={false} />
          <YAxis stroke="#475569" tick={TICK_STYLE} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
          <Bar dataKey={yField} fill="url(#glow-indigo)" radius={[6, 6, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
      {isTruncated && (
        <ShowMoreToggle
          total={total}
          visibleCount={visibleData.length}
          step={step}
          onCycle={cycleNext}
          onReset={reset}
        />
      )}
    </ChartCard>
  );
});

export const HorizontalBarChartView = React.memo(function HorizontalBarChartView({ chart, insight }) {
  const { xField, yField, title } = chart;
  const { visibleData, total, isTruncated, step, cycleNext, reset } = useTopNData(chart.data, yField);

  return (
    <ChartCard title={title} insightText={insight}>
      <ResponsiveContainer>
        <BarChart data={visibleData} layout="vertical" margin={{ top: 10, right: 15, bottom: 0, left: -10 }}>
          <ChartGradients />
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" horizontal={false} />
          <XAxis type="number" stroke="#475569" tick={TICK_STYLE} axisLine={false} tickLine={false} />
          <YAxis dataKey={xField} type="category" stroke="#475569" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
          <Bar dataKey={yField} fill="url(#glow-cyan)" radius={[0, 6, 6, 0]} maxBarSize={16} />
        </BarChart>
      </ResponsiveContainer>
      {isTruncated && (
        <ShowMoreToggle
          total={total}
          visibleCount={visibleData.length}
          step={step}
          onCycle={cycleNext}
          onReset={reset}
        />
      )}
    </ChartCard>
  );
});

export const PieChartView = React.memo(function PieChartView({ chart, donut = false, insight }) {
  const { xField, yField, title } = chart;
  const { visibleData, total, isTruncated, step, cycleNext, reset } = useTopNData(chart.data, yField);

  return (
    <ChartCard title={title} insightText={insight}>
      <ResponsiveContainer>
        <PieChart>
          <ChartGradients />
          <Pie
            data={visibleData}
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
            {visibleData.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11, bottom: 0, fontFamily: "sans-serif", color: "#94a3b8" }} iconSize={7} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
      {isTruncated && (
        <ShowMoreToggle
          total={total}
          visibleCount={visibleData.length}
          step={step}
          onCycle={cycleNext}
          onReset={reset}
        />
      )}
    </ChartCard>
  );
});