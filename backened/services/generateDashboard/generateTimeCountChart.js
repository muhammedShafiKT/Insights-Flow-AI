const VARIANTS = ["line", "area", "bar"];

export function generateTimeCountChart(candidate, result) {
    const variant = VARIANTS.includes(candidate.chartVariant)
        ? candidate.chartVariant
        : VARIANTS[0];

    return {
        chartType: variant,
        title: `Records over time`,
        xField: "category",
        yField: "value",
        data: result.map(([category, value]) => ({ category, value }))
    }
}