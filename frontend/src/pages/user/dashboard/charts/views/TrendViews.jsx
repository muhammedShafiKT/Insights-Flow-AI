import React from "react";
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChartCard, CustomTooltip, ChartGradients, GRID_COLOR, PRIMARY_ACCENT, SECONDARY_ACCENT, TICK_STYLE } from "../ChartCard";

export const LineChartView = React.memo(function LineChartView({ chart, insight }) {
  const { xField, yField, title } = chart;
  const data = React.useMemo(
    () => chart.data.map(d => ({ ...d, [yField]: Number(d[yField]) })),
    [chart.data, yField]
  );
  return (
    <ChartCard title={title} insightText={insight}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey={xField} stroke="#475569" tick={TICK_STYLE} axisLine={false} tickLine={false} />
          <YAxis stroke="#475569" tick={TICK_STYLE} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey={yField} stroke={PRIMARY_ACCENT} strokeWidth={3} dot={{ r: 4, strokeWidth: 2, stroke: "#0f172a", fill: SECONDARY_ACCENT }} activeDot={{ r: 6, strokeWidth: 0, fill: SECONDARY_ACCENT }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});

export const AreaTrendChartView = React.memo(function AreaTrendChartView({ chart, insight }) {
  const { xField, yField, title } = chart;
  const data = React.useMemo(
    () => chart.data.map(d => ({ ...d, [yField]: Number(d[yField]) })),
    [chart.data, yField]
  );
  return (
    <ChartCard title={title} insightText={insight}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
          <ChartGradients />
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey={xField} stroke="#475569" tick={TICK_STYLE} axisLine={false} tickLine={false} />
          <YAxis stroke="#475569" tick={TICK_STYLE} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey={yField} stroke={PRIMARY_ACCENT} strokeWidth={3} fill="url(#area-gradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});