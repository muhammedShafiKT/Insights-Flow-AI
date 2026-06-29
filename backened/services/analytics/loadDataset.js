// import { createConnection } from "./duckdb.service.js";

// export async function loadDataset(url) {
//     const { connection } = await createConnection() // ✅ destructure
//     await connection.run(`
//         CREATE TABLE dataset AS
//         SELECT *
//         FROM read_csv_auto('${url}')
//     `)
//     return connection
// }

import { createConnection } from "./duckdb.service.js";
import { buildReadSource, buildExtensionSetup } from "./sqlSource.helper.js"

export async function loadDataset(url, fileType, skipRows = 0) {
    const { connection } = await createConnection()
    const extensionSetup = buildExtensionSetup(fileType)
    const readSource = buildReadSource(url, fileType, skipRows)

    if (extensionSetup) {
        await connection.run(extensionSetup)
    }

    await connection.run(`
        CREATE TABLE dataset AS
        SELECT * FROM ${readSource}
    `)
    return connection
}