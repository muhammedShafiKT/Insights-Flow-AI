import React from "react";
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ChartCard, CustomTooltip, ChartGradients, GRID_COLOR, PALETTE, TICK_STYLE } from "../ChartCard";

export const BarChartView = React.memo(function BarChartView({ chart, insight }) {
  const { xField, yField, title } = chart;
  const data = React.useMemo(
    () => chart.data.map(d => ({ ...d, [yField]: Number(d[yField]) })),
    [chart.data, yField]
  );
  return (
    <ChartCard title={title} insightText={insight}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
          <ChartGradients />
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey={xField} stroke="#475569" tick={TICK_STYLE} axisLine={false} tickLine={false} />
          <YAxis stroke="#475569" tick={TICK_STYLE} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
          <Bar dataKey={yField} fill="url(#glow-indigo)" radius={[6, 6, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});

export const HorizontalBarChartView = React.memo(function HorizontalBarChartView({ chart, insight }) {
  const { xField, yField, title } = chart;
  const data = React.useMemo(
    () => chart.data.map(d => ({ ...d, [yField]: Number(d[yField]) })),
    [chart.data, yField]
  );
  return (
    <ChartCard title={title} insightText={insight}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 15, bottom: 0, left: -10 }}>
          <ChartGradients />
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" horizontal={false} />
          <XAxis type="number" stroke="#475569" tick={TICK_STYLE} axisLine={false} tickLine={false} />
          <YAxis dataKey={xField} type="category" stroke="#475569" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
          <Bar dataKey={yField} fill="url(#glow-cyan)" radius={[0, 6, 6, 0]} maxBarSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});

export const PieChartView = React.memo(function PieChartView({ chart, donut = false, insight }) {
  const { xField, yField, title } = chart;
  const data = React.useMemo(
    () => chart.data.map(d => ({ ...d, [yField]: Number(d[yField]) })),
    [chart.data, yField]
  );
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
});