/**
 * Builds the correct DuckDB table-source SQL fragment based on file extension.
 * Supports: .csv, .xlsx
 *
 * @param {string} url - signed URL (or path) to the file
 * @param {string} extension - file extension, e.g. "csv", "xlsx" (case-insensitive, leading dot optional)
 * @returns {string} SQL fragment usable after FROM, e.g. read_csv_auto('...')
 */
export function buildReadSource(url, extension, skipRows = 0) {
    const ext = (extension || "").toLowerCase().replace(/^\./, "")

    switch (ext) {
        case "csv":
            return skipRows > 0
                ? `read_csv_auto('${url}', skip=${skipRows})`
                : `read_csv_auto('${url}')`
        case "xlsx": {
            if (skipRows > 0) {
                // read_xlsx has no "skip" param — it uses an Excel-style cell
                // range instead (e.g. "A4:ZZ1000000"). headerRowIndex is
                // 0-indexed, so the real header sits at Excel row (skipRows + 1).
                const startRow = skipRows + 1
                return `read_xlsx('${url}', range='A${startRow}:ZZ1000000', header=true, stop_at_empty=true)`
            }
            return `read_xlsx('${url}')`
        }
        default:
            throw new Error(`Unsupported file extension for DuckDB ingestion: "${extension}"`)
    }
}

/**
 * Returns any DuckDB extension install/load statements required before
 * querying a file of the given extension. xlsx needs the community "excel"
 * extension; csv needs nothing extra.
 *
 * @param {string} extension
 * @returns {string} SQL statements to run before the FROM clause (may be empty string)
 */
export function buildExtensionSetup(extension) {
    const ext = (extension || "").toLowerCase().replace(/^\./, "")

    if (ext === "xlsx") {
        return `INSTALL excel; LOAD excel;`
    }
    return ""
}