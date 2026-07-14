import { normalizeDuckDBValue } from "./normalizeDuckdbvalue.js";  

const VARIANTS = ["line", "area", "bar"];

export function generateTimeCountChart(candidate, result) {
    const variant = VARIANTS.includes(candidate.chartVariant)
        ? candidate.chartVariant
        : VARIANTS[0];

    return {
        chartType: variant,
        title: `Records over time`,
        xField: "date",
        yField: "value",
        data: result.map(([date, value]) => ({ date: normalizeDuckDBValue(date), value }))
    }
}