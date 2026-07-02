const VARIANTS = ["bar", "horizontalBar", "pie", "donut"];

export function generateComparisonChart(candidate, result) {
    const variant = VARIANTS.includes(candidate.chartVariant)
        ? candidate.chartVariant
        : VARIANTS[0];

    return {
        chartType: variant,
        title: `Average ${candidate.metric} by ${candidate.category}`,
        xField: "category",
        yField: 'value',
        data: result.map(([category, value]) => ({ category, value }))
    }
}