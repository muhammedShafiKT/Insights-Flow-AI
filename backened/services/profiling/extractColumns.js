const EMPTY_HEADER_PATTERN = /^(__EMPTY(_\d+)?|column\d+|field\d+|unnamed.*)$/i

export function extractColumns(rows) {
    const columns = {}
    const headers = Object.keys(rows[0]).filter(
        header => header.trim() !== "" && !EMPTY_HEADER_PATTERN.test(header.trim())
    )

    for (const header of headers) {
        columns[header] = []
    }
    for (const row of rows) {
        for (const header of headers) {
            columns[header].push(row[header])
        }
    }
    return columns
}