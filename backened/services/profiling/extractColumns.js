export function extractColumns(rows){
const columns = {}
const headers = Object.keys(rows[0])

for (const header of headers){
    columns[header]=[]
}
for(const row of rows){
    for (const header of headers){
        columns[header].push(row[header])
    }
}
return columns
}