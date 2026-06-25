import { createConnection } from "./duckdb.service.js";

export async function loadDataset(url) {
    const { connection } = await createConnection() // ✅ destructure
    await connection.run(`
        CREATE TABLE dataset AS
        SELECT *
        FROM read_csv_auto('${url}')
    `)
    return connection
}