const VARIANTS = ["line", "area", "bar"];
function normalizeDuckDBValue(v) {
  if (v && typeof v === "object" && typeof v.days === "number") {
    const ms = v.days * 86400000;
    return new Date(ms).toISOString().slice(0, 10); 
  }
  return v;
}
export function generateTrendChart(candidate, result) {
    const variant = VARIANTS.includes(candidate.chartVariant)
        ? candidate.chartVariant
        : VARIANTS[0];

    return {
        chartType: variant,
        title: `Average ${candidate.metric} Trend`,
        xField: "date",
        yField: 'value',
        data: result.map(([date, value]) => ({ date : normalizeDuckDBValue(date), value }))
    }
}