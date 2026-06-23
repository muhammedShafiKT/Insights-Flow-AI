export function generateCanditates(validation){
const candidates = []
if(validation.availableAnalysis.includes("distribution")){

    for(const column of validation.numericColumns){
        candidates.push({
            type : "distribution",
            column
        })
    }
}


if(validation.availableAnalysis.includes("comparison")){

    for(const category of validation.categoricalColumns){
        for (const metric of validation.numericColumns){
        candidates.push({
            type : "comparison",
            metric,category
        })
    }
    }
       
}


if(validation.availableAnalysis.includes("trend")){

       for(const date of validation.datetimeColumns){
        for (const metric of validation.numericColumns){
        candidates.push({
            type : "trend",
            metric,date
        })
    }
    }
}


if(validation.availableAnalysis.includes("correlation")){
     for (let i = 0;i<validation.numericColumns.length;i++){
        for (let j = i+1;j<validation.numericColumns.length;j++){
            candidates.push({
                type : "correlation",
                x : validation.numericColumns[i],
                y : validation.numericColumns[j]
            })
        }
     }
}

   return candidates
}