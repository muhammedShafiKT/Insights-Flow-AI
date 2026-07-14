// executeQuery.js
import { formatResult }    from "./formatResults.js"   // confirm this matches your actual filename

export async function executeQuery(connection, sql) {
    const reader = await connection.runAndReadAll(sql);
    const rows = formatResult(reader.getRows());
    return rows;
}