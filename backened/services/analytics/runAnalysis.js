
import { executeQuery } from "./executeQuery.js";
import { generateSql } from "./generateSql.js";
import { loadDataset } from "./loadDataset.js";


export async function runAnalysis(candidates,signedUrl){

const connection = await loadDataset(signedUrl)
const results = []
for(let candidate of candidates ){
    const sql =  generateSql(candidate)
   const result = await executeQuery(connection,sql)
   results.push({
    candidate,sql,result
})
}

return results
}

