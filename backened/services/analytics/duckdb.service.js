
import { DuckDBInstance } from "@duckdb/node-api"

export async function createConnection() {
    const db = await DuckDBInstance.create(":memory:")
    const connection = await db.connect()
    return { db, connection } 
}