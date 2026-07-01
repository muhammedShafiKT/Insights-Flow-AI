import React from "react";
import { ResponsiveContainer, ScatterChart, Scatter, ComposedChart, Line, ZAxis, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChartCard, CustomTooltip, GRID_COLOR, PRIMARY_ACCENT, SECONDARY_ACCENT, TICK_STYLE } from "../ChartCard";
import { linearRegression, sampleData } from "../chartUtils";

export const ScatterChartView = React.memo(function ScatterChartView({ chart, insight }) {
  const { xField, yField, title } = chart;
  const data = React.useMemo(() => {
    const mapped = chart.data.map(d => ({ ...d, [xField]: Number(d[xField]), [yField]: Number(d[yField]) }));
    return sampleData(mapped);
  }, [chart.data, xField, yField]);
  return (
    <ChartCard title={title} insightText={insight}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" />
          <XAxis dataKey={xField} type="number" name={xField} stroke="#475569" tick={TICK_STYLE} axisLine={false} tickLine={false} />
          <YAxis dataKey={yField} type="number" name={yField} stroke="#475569" tick={TICK_STYLE} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.08)", strokeDasharray: "3 3" }} />
          <Scatter data={data} fill={PRIMARY_ACCENT} shape="circle" line={false} />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});

export const BubbleChartView = React.memo(function BubbleChartView({ chart, insight }) {
  const { xField, yField, title } = chart;
  const data = React.useMemo(() => {
    const mapped = chart.data.map(d => {
      const x = Number(d[xField]);
      const y = Number(d[yField]);
      return { ...d, [xField]: x, [yField]: y, z: Math.abs(x * y) || 1 };
    });
    return sampleData(mapped);
  }, [chart.data, xField, yField]);
  return (
    <ChartCard title={title} insightText={insight}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" />
          <XAxis dataKey={xField} type="number" name={xField} stroke="#475569" tick={TICK_STYLE} axisLine={false} tickLine={false} />
          <YAxis dataKey={yField} type="number" name={yField} stroke="#475569" tick={TICK_STYLE} axisLine={false} tickLine={false} />
          <ZAxis dataKey="z" range={[50, 400]} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.05)" }} />
          <Scatter data={data} fill={SECONDARY_ACCENT} fillOpacity={0.4} stroke={SECONDARY_ACCENT} strokeWidth={1.5} />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});

export const LineFitChartView = React.memo(function LineFitChartView({ chart, insight }) {
  const { xField, yField, title } = chart;
  const dataWithFit = React.useMemo(() => {
    const data = chart.data
      .map(d => ({ ...d, [xField]: Number(d[xField]), [yField]: Number(d[yField]) }))
      .sort((a, b) => a[xField] - b[xField]);
    const fit = linearRegression(data, xField, yField);
    return fit ? data.map(d => ({ ...d, fit: fit.slope * d[xField] + fit.intercept })) : data;
  }, [chart.data, xField, yField]);

  const hasFit = dataWithFit.length > 0 && dataWithFit[0].fit !== undefined;

  return (
    <ChartCard title={title} insightText={insight}>
      <ResponsiveContainer>
        <ComposedChart data={dataWithFit} margin={{ top: 10, right: 10, bottom: 0, left: -25 }}>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="4 4" />
          <XAxis dataKey={xField} type="number" stroke="#475569" tick={TICK_STYLE} axisLine={false} tickLine={false} />
          <YAxis type="number" stroke="#475569" tick={TICK_STYLE} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Scatter dataKey={yField} fill={PRIMARY_ACCENT} />
          {hasFit && <Line dataKey="fit" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />}
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});