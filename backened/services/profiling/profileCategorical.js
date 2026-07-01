
export function profileCategorical(values, uniqueRatio) {

    const validvalues = values.filter(
        (value)=>
        value!==null&&value!==undefined&&String(value).trim()!=="" )

    const missingCount = values.length - validvalues.length
    if (validvalues.length === 0) {
      return {
        count: 0,
        missingCount: values.length,
        missingPercent: 100,
        uniqueCount : 0,
        topValues :[],
        subType: "empty"
      };
    }

    const frequency = {}
    let isEmailColumn = false;

    // Check if values resemble an email configuration
    if (validvalues.length > 0 && String(validvalues[0]).includes("@")) {
        isEmailColumn = true;
    }

    for(const value of validvalues){
        const strVal = String(value).trim();
        frequency[strVal] = (frequency[strVal]||0) + 1
    }
    
    // Bumped slice to 10 for better visualization ranges on high metrics
    const topValues = Object.entries(frequency)
        .sort((a,b)=>b[1]-a[1])
        .slice(0,10)
        .map(([value,count])=>({value,count}))

    // 4. ADDED DYNAMIC SUBTYPE DETERMINATION
    // Categorizes based on text data structure to stop bad visual options downstream
    let subType = "standard-nominal";
    if (uniqueRatio > 0.85 && !isEmailColumn) {
        subType = "high-cardinality-text"; // Names, descriptions, etc.
    } else if (isEmailColumn) {
        subType = "email";
    }

    return {
        count : validvalues.length,
        missingCount,
        missingPercent : Number(((missingCount/values.length)*100).toFixed(2)),
        uniqueCount : Object.keys(frequency).length,
        topValues,
        subType
    }
}