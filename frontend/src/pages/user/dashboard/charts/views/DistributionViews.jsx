import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChartCard, CustomTooltip, ChartGradients, GRID_COLOR, PRIMARY_ACCENT, TICK_STYLE_SM } from "../ChartCard";
import { buildHistogram } from "../chartUtils";

export const DistributionChartView = React.memo(function DistributionChartView({ chart, insight }) {
  const { data, title } = chart;
  const histogram = React.useMemo(() => {
    const values = data.map(d => Number(d.value)).filter(v => !isNaN(v));
    return buildHistogram(values);
  }, [data]);

  return (
    <ChartCard title={title} insightText={insight}>
      <ResponsiveContainer>
        <BarChart data={histogram} margin={{ top: 10, right: 10, bottom: 20, left: -25 }}>
          <ChartGradients />
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="bucket" stroke="#475569" tick={TICK_STYLE_SM} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" />
          <YAxis stroke="#475569" tick={{ fill: "#475569", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="url(#glow-indigo)" radius={[5, 5, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});

export const BoxPlotChartView = React.memo(function BoxPlotChartView({ chart }) {
  const { data, title } = chart;

  const { boxData, min, max, q50 } = React.useMemo(() => {
    const values = data.map(d => Number(d.value)).filter(v => !isNaN(v)).sort((a, b) => a - b);
    if (values.length === 0) return { boxData: null, min: 0, max: 0, q50: 0 };
    const min = values[0];
    const max = values[values.length - 1];
    const q50 = values[Math.floor(values.length * 0.5)];
    return { boxData: [{ name: "Bounds Array", lw: q50 - min, uw: max - q50, base: min }], min, max, q50 };
  }, [data]);

  if (!boxData) return null;

  return (
    <ChartCard title={title} insightText={`Data spreads across alpha variance borders from Min (${min.toFixed(1)}) up to Max (${max.toFixed(1)}). Current computed center midpoint marks ${q50.toFixed(1)}.`}>
      <ResponsiveContainer>
        <BarChart data={boxData} layout="vertical" margin={{ top: 25, right: 20, bottom: 10, left: -30 }}>
          <CartesianGrid stroke={GRID_COLOR} horizontal={false} strokeDasharray="4 4" />
          <XAxis type="number" domain={[min, max]} stroke="#475569" tick={{ fill: "#475569", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
          <YAxis dataKey="name" type="category" tick={false} axisLine={false} />
          <Bar dataKey="base" stackId="box" fill="transparent" />
          <Bar dataKey="lw" stackId="box" fill="#334155" barSize={3} />
          <Bar dataKey="uw" stackId="box" fill={PRIMARY_ACCENT} fillOpacity={0.6} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});