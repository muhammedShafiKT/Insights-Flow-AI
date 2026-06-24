import { generateComparisonChart } from "./generateComparisonChart.js"
import { generateCorrelationChart } from "./generateCorrelationChart.js"
import { generateDistributionChart } from "./generateDistributionChart.js"
import { generateTrendChart } from "./generateTrendChart.js"

export function generateChart(analysis) {
    const { candidate, result } = analysis
    switch (candidate.type) {
        case "comparison":
            return generateComparisonChart(candidate, result) ;
        case "distribution":
            return generateDistributionChart(candidate, result);

        case "trend":
            return generateTrendChart(candidate, result);

        case "correlation":
            return generateCorrelationChart(candidate, result);

        default:
            throw new Error(
                `unsupported chart type :${candidate.type}`
            )

    }
}