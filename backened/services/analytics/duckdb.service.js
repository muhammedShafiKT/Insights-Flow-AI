import { DuckDBInstance } from "@duckdb/node-api"

export async function createConnection(){
const instance = await DuckDBInstance.create(":memory:")
const connection = await instance.connect()
return connection;
}