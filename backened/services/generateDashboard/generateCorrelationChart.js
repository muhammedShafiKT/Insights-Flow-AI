// export function generateCorrelationChart(candidate,result){
//     return {
//         chartType : "scatter",
//         title : ` ${candidate.x} vs ${candidate.y}`,
//         xField : "x",
//         yField : 'y',
//         data : result.map(([x,y])=>({x,y}))

//     }

// }
const VARIANTS = ["scatter", "bubble", "lineFit"];
 
export function generateCorrelationChart(candidate, result) {
    const variant = VARIANTS.includes(candidate.chartVariant)
        ? candidate.chartVariant
        : VARIANTS[0];
 
    return {
        chartType: variant,
        title: `${candidate.x} vs ${candidate.y}`,
        xField: "x",
        yField: 'y',
        data: result.map(([x, y]) => ({ x, y }))
    }
}