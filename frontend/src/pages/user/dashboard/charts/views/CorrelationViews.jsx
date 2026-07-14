import React from "react";
import { ResponsiveContainer, ScatterChart, Scatter, ComposedChart, Line, ZAxis, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChartCard, CustomTooltip, GRID_COLOR, PRIMARY_ACCENT, SECONDARY_ACCENT, TICK_STYLE } from "../ChartCard";
import { linearRegression, sampleData } from "../chartUtils";

function SampleToggle({ totalCount, shownCount, showingAll, onToggle }) {
  if (totalCount <= shownCount && !showingAll) return null; // nothing was ever sampled out
  if (totalCount === shownCount) return null; // sampled count already equals total

  return (
    <div className="flex items-center justify-between px-1 pb-1">
      <span className="text-[11px] text-slate-500">
        {showingAll ? `Showing all ${totalCount} points` : `Showing ${shownCount} of ${totalCount} points (sampled)`}
      </span>
      <button
        type="button"
        onClick={onToggle}
        className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
      >
        {showingAll ? "Show sampled" : "Show all"}
      </button>
    </div>
  );
}

export const ScatterChartView = React.memo(function ScatterChartView({ chart, insight }) {
  const { xField, yField, title } = chart;
  const [showAll, setShowAll] = React.useState(false);

  const mapped = React.useMemo(
    () => chart.data.map(d => ({ ...d, [xField]: Number(d[xField]), [yField]: Number(d[yField]) })),
    [chart.data, xField, yField]
  );
  const sampled = React.useMemo(() => sampleData(mapped), [mapped]);
  const data = showAll ? mapped : sampled;

  return (
    <ChartCard title={title} insightText={insight}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" />
          <XAxis dataKey={xField} type="number" name={xField} stroke="#475569" tick={TICK_STYLE} axisLine={false} tickLine={false} />
          <YAxis dataKey={yField} type="number" name={yField} stroke="#475569" tick={TICK_STYLE} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.08)", strokeDasharray: "3 3" }} />
          <Scatter data={data} fill={PRIMARY_ACCENT} shape="circle" line={false} isAnimationActive={!showAll} />
        </ScatterChart>
      </ResponsiveContainer>
      <SampleToggle
        totalCount={mapped.length}
        shownCount={sampled.length}
        showingAll={showAll}
        onToggle={() => setShowAll(v => !v)}
      />
    </ChartCard>
  );
});

export const BubbleChartView = React.memo(function BubbleChartView({ chart, insight }) {
  const { xField, yField, title } = chart;
  const [showAll, setShowAll] = React.useState(false);

  const mapped = React.useMemo(() => {
    return chart.data.map(d => {
      const x = Number(d[xField]);
      const y = Number(d[yField]);
      return { ...d, [xField]: x, [yField]: y, z: Math.abs(x * y) || 1 };
    });
  }, [chart.data, xField, yField]);
  const sampled = React.useMemo(() => sampleData(mapped), [mapped]);
  const data = showAll ? mapped : sampled;

  return (
    <ChartCard title={title} insightText={insight}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" />
          <XAxis dataKey={xField} type="number" name={xField} stroke="#475569" tick={TICK_STYLE} axisLine={false} tickLine={false} />
          <YAxis dataKey={yField} type="number" name={yField} stroke="#475569" tick={TICK_STYLE} axisLine={false} tickLine={false} />
          <ZAxis dataKey="z" range={[50, 400]} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.05)" }} />
          <Scatter data={data} fill={SECONDARY_ACCENT} fillOpacity={0.4} stroke={SECONDARY_ACCENT} strokeWidth={1.5} isAnimationActive={!showAll} />
        </ScatterChart>
      </ResponsiveContainer>
      <SampleToggle
        totalCount={mapped.length}
        shownCount={sampled.length}
        showingAll={showAll}
        onToggle={() => setShowAll(v => !v)}
      />
    </ChartCard>
  );
});

export const LineFitChartView = React.memo(function LineFitChartView({ chart, insight }) {
  const { xField, yField, title } = chart;
  const [showAll, setShowAll] = React.useState(false);

  const sortedMapped = React.useMemo(() => {
    return chart.data
      .map(d => ({ ...d, [xField]: Number(d[xField]), [yField]: Number(d[yField]) }))
      .sort((a, b) => a[xField] - b[xField]);
  }, [chart.data, xField, yField]);

  // Regression is always computed on the FULL dataset, regardless of what's plotted,
  // so the fit line stays statistically correct even when points are sampled for display.
  const fit = React.useMemo(() => linearRegression(sortedMapped, xField, yField), [sortedMapped, xField, yField]);

  const sampledPoints = React.useMemo(() => sampleData(sortedMapped), [sortedMapped]);
  const pointsToPlot = showAll ? sortedMapped : sampledPoints;

  const dataWithFit = React.useMemo(() => {
    if (!fit) return pointsToPlot;
    return pointsToPlot.map(d => ({ ...d, fit: fit.slope * d[xField] + fit.intercept }));
  }, [pointsToPlot, fit, xField]);

  const hasFit = !!fit;

  return (
    <ChartCard title={title} insightText={insight}>
      <ResponsiveContainer>
        <ComposedChart data={dataWithFit} margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" />
          <XAxis dataKey={xField} type="number" stroke="#475569" tick={TICK_STYLE} axisLine={false} tickLine={false} />
          <YAxis type="number" stroke="#475569" tick={TICK_STYLE} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Scatter dataKey={yField} fill={PRIMARY_ACCENT} isAnimationActive={!showAll} />
          {hasFit && <Line dataKey="fit" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />}
        </ComposedChart>
      </ResponsiveContainer>
      <SampleToggle
        totalCount={sortedMapped.length}
        shownCount={sampledPoints.length}
        showingAll={showAll}
        onToggle={() => setShowAll(v => !v)}
      />
    </ChartCard>
  );
});