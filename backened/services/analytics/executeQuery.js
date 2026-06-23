import { formatResult } from "./formatResults.js"

export async function executeQuery(connection,sql){
const reader= await connection.runAndReadAll(sql)
const rows = formatResult( reader.getRows())
return rows
}