

export function profileDate(values){

    const validvalues = values.filter(
        (value)=>
        value!==null&&value!==undefined&&String(value).trim()!=="" )

        const missingCount = values.length - validvalues.length
if (validvalues.length === 0) {
  return {
    count: 0,
    missingCount: values.length,
    missingPercent: 100,
    earliest : null ,
    latest : null
  };
}

const dates = validvalues.map((value)=>(new Date(value)))
   

return {
    count : dates.length,
    missingCount,
    missingPercent : Number(((missingCount/values.length)*100).toFixed(2)),
    earliest : new Date( Math.min(...dates)),
   latest :new Date( Math.max(...dates))
    


}
}