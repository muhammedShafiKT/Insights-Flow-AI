const VARIANTS = ["histogram", "boxplot", "areaDistribution"];

export function generateDistributionChart(candidate, result) {
    const variant = VARIANTS.includes(candidate.chartVariant)
        ? candidate.chartVariant
        : VARIANTS[0];

    return {
        chartType: variant,
        title: `Average ${candidate.column} Distribution`,
        data: result.map(([value]) => ({ value }))
    }
}