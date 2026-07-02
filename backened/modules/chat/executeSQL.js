
import { createConnection } from "../../services/analytics/duckdb.service.js"
import { buildExtensionSetup, buildReadSource } from "../../services/analytics/sqlSource.helper.js" // adjust path

export async function executeSQL(sql, signedUrl, fileType, skipRows = 0) {
    const { connection } = await createConnection()
    try {
        const extensionSetup = buildExtensionSetup(fileType)
        const readSource = buildReadSource(signedUrl, fileType, skipRows)

        if (extensionSetup) {
            await connection.run(extensionSetup)
        }

        await connection.run(`
            CREATE OR REPLACE VIEW dataset AS
            SELECT *
            FROM ${readSource};
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


