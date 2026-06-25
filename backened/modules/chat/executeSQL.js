import { createConnection } from "../../services/analytics/duckdb.service.js";

export async function executeSQL(sql, signedUrl) {
    const { connection } = await createConnection()
    try {
        await connection.run(`
            CREATE OR REPLACE VIEW dataset AS
            SELECT *
            FROM read_csv_auto('${signedUrl}');
        `)
        const reader = await connection.runAndReadAll(sql)
        const rows = reader.getRowObjects()

        return rows.map(row =>
            Object.fromEntries(
                Object.entries(row).map(([k, v]) => [
                    k, typeof v === "bigint" ? Number(v) : v
                ])
            )
        )
    } catch (error) {
        console.error(error)
        throw error
    }
}