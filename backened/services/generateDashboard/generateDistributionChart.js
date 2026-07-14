const VARIANTS = ["histogram", "boxplot", "areaDistribution"];

export function generateDistributionChart(candidate, result) {
    const variant = VARIANTS.includes(candidate.chartVariant)
        ? candidate.chartVariant
        : VARIANTS[0];

    return {
        chartType: variant,
        title: `${candidate.column} Distribution`,
        xField: "value",
        yField: "count",
        data: result.map(([value, count]) => ({ value, count }))
    }
}