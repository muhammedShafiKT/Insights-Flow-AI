import { createConnection } from "./duckdb.service.js";
export async function loadDataset(url) {
    const connection = await createConnection()
    await connection.run(`
        CREATE TABLE dataset AS
        select *
        FROM read_csv_auto('${url}')
        `)
        return connection
} 
