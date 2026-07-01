

function cleanNumber(value){
return(
    Number(
        String(value).replace(/[$,%]/g,"").replace(/,/g,"")
    )
)
}

export function profileNumeric(values){

    const validvalues = values.filter(
        (value)=>
        value!==null&&value!==undefined&&String(value).trim()!=="" )

const numbers = validvalues.map(cleanNumber)  

if (numbers.length === 0) {
  return {
    count: 0,
    missingCount: values.length,
    missingPercent: 100,
    min: null,
    max: null,
    mean: null
  };
}

const missingCount = values.length - validvalues.length
const sum = numbers.reduce((a,b)=>a+b,0)      

return {
    count : numbers.length,
    missingCount,
    missingPercent : Number(((missingCount/values.length)*100).toFixed(2)),
    min : Math.min(...numbers),
    max : Math.max(...numbers),
    mean : Number((sum/numbers.length).toFixed(2)),
    // isIdentifier
}
}
