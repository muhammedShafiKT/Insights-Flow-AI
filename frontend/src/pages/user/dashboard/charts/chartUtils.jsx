// ─── SHARED CHART UTILITIES ──────────────────────────────────────────────────

export function generateInsightText(chart) {
  try {
    const { chartType, data, yField, xField } = chart;
    if (!data || data.length === 0) return null;

    const values = data.map(d => Number(d[yField] ?? d.value)).filter(v => !isNaN(v));
    const total = values.reduce((sum, v) => sum + v, 0);
    const avg = total / (values.length || 1);
    const maxVal = values.reduce((m, v) => (v > m ? v : m), -Infinity);

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

export function linearRegression(points, xField, yField) {
  const n = points.length;
  if (n < 2) return null;
  const sumX = points.reduce((s, p) => s + p[xField], 0);
  const sumY = points.reduce((s, p) => s + p[yField], 0);
  const sumXY = points.reduce((s, p) => s + p[xField] * p[yField], 0);
  const sumXX = points.reduce((s, p) => s + p[xField] * p[xField], 0);
  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) return null;
  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

export function buildHistogram(values, binCount = 8) {
  if (!values.length) return [];
  const min = values.reduce((m, v) => (v < m ? v : m), Infinity);
  const max = values.reduce((m, v) => (v > m ? v : m), -Infinity);
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

// Downsample large point sets so scatter/bubble charts don't drop 50k SVG nodes
export function sampleData(data, maxPoints = 2000) {
  if (data.length <= maxPoints) return data;
  const step = Math.ceil(data.length / maxPoints);
  return data.filter((_, i) => i % step === 0);
}