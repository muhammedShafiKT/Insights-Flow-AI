import XLSX from "xlsx"
import Papa from "papaparse"

export function papaparseCSV(buffer){
    
const csvText = buffer.toString("utf8")
const result = Papa.parse(csvText,{
header :true,
skipEmptyLines :true
})
if(result.errors.length){
    throw new error("invalid CSV file")
}
return result.data
}

export function parseExcel(buffer){
    try {
        const workbook  = XLSX.read(buffer,{
            type : "buffer"
        })
        const firstsheet = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstsheet] 
        return XLSX.utils.sheet_to_json(worksheet)
    } catch (error) {
        throw new error("Invalid Excel File")
    }
}

export function Dataparser(buffer,extension){
  switch(extension){
    case "csv" :
    return papaparseCSV(buffer)

    case "xlsx" :
        case "xls" :
            return parseExcel(buffer)

            default : 
            throw new Error ("invalid data type")
  }
}
export function ExtractMetadata(rows){
if(!rows.length){
    return{
         rowCount: 0,
      columnCount: 0,
      columns: [],
    }
}

const columns = Object.keys(rows[0])
return{
       rowCount: rows.length,
      columnCount: columns.length,
      columns,
}
}