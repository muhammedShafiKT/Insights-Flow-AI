
// import { normalizeDuckDBValue } from "./normalizeDuckdbvalue.js";  
const VARIANTS = ["line", "area", "bar"];
export function generateTrendChart(candidate, result) {
    const variant = VARIANTS.includes(candidate.chartVariant)
        ? candidate.chartVariant
        : VARIANTS[0];

    const title = candidate.isDerivedMetric
        ? `Record Count Trend`
        : `Average ${candidate.metric} Trend`;

    return {
        chartType: variant,
        title,
        xField: "date",
        yField: 'value',
        // data: result.map(([date, value]) => ({ date: normalizeDuckDBValue(date), value }))
        data: result.map(([date, value]) => ({ date, value }))
        
    }
}



