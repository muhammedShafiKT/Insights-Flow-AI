

export function profileCategorical(values){

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
    topValues :[]
  };
}

        const frequency = {}
        for(const value of validvalues){
            frequency[value] = (frequency[value]||0) + 1
        }
  const topValues= Object.entries(frequency).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([value,count])=>({value,count}))
 



   

return {
    count : validvalues.length,
    missingCount,
    missingPercent : Number(((missingCount/values.length)*100).toFixed(2)),
    uniqueCount : Object.keys(frequency).length,
   topValues
    


}
}