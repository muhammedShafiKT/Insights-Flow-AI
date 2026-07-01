

import React from "react";
import { BarChartView, HorizontalBarChartView, PieChartView } from "./views/CategoricalViews";
import { LineChartView, AreaTrendChartView } from "./views/TrendViews";
import { ScatterChartView, BubbleChartView, LineFitChartView } from "./views/CorrelationViews";
import { DistributionChartView, BoxPlotChartView } from "./views/DistributionViews";
import { generateInsightText } from "./chartUtils";

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950 p-8 text-center text-xs font-mono tracking-wide text-slate-500">
      <svg className="mx-auto h-6 w-6 text-slate-700 mb-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      NO_ACTIVE_TELEMETRY_LOGS
    </div>
  );
}

export default function ChartRenderer({ chart }) {
  const hasData = chart && Array.isArray(chart.data) && chart.data.length > 0;

  // Only compute insight text for chart types that actually consume it (skips boxplot, which builds its own)
  const generatedInsight = React.useMemo(
    () => (hasData ? generateInsightText(chart) : null),
    [hasData, chart]
  );

  if (!hasData) return <EmptyState />;

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