//numeric

function isNumeric(value){
if (value === null || value === undefined || value === "") {
    return false;
  }
const cleaned = String(value).replace(/[$,%]/g,"").replace(/,/g,"")
return !isNaN(Number(cleaned))
}

function isDate(value){
      if (value === null || value === undefined || value === "") {
    return false;
  }
    return !isNaN(Date.parse(value))
}



export function detectColumnType(values){
   const nonEmpty = values.filter((value)=>{
    return(
    value!==null &&
    value !==undefined &&
    String(value).trim()!==""
    )
   })

    if (nonEmpty.length === 0) {
    return "categorical";
  }
   const numericCount=nonEmpty.filter(isNumeric).length
   const dateCount=nonEmpty.filter(isDate).length
   if(numericCount/nonEmpty.length> 0.9){
    return "numeric"
   }
   if(dateCount/nonEmpty.length> 0.9){
    return "datetime"
   }
   return "categorical"
}


