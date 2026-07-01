const VARIANTS = ["bar", "horizontalBar", "pie", "donut"];

export function generateFrequencyChart(candidate, result) {
    const variant = VARIANTS.includes(candidate.chartVariant)
        ? candidate.chartVariant
        : VARIANTS[0];

    return {
        chartType: variant,
        title: `Count by ${candidate.column}`,
        xField: "category",
        yField: "value",
        data: result.map(([category, value]) => ({ category, value }))
    }
}