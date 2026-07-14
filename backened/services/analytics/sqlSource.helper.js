function escapeSqlString(str) {
    return String(str).replace(/'/g, "''");
}

/**
 * Builds the correct DuckDB table-source SQL fragment based on file extension.
 * Supports: .csv, .xlsx
 */
export function buildReadSource(url, extension, skipRows = 0) {
    const ext = (extension || "").toLowerCase().replace(/^\./, "");
    const safeUrl = escapeSqlString(url);

    switch (ext) {
        case "csv":
            return skipRows > 0
                ? `read_csv_auto('${safeUrl}', skip=${skipRows}, all_varchar=true)`
                : `read_csv_auto('${safeUrl}', all_varchar=true)`;
        case "xlsx": {
            if (skipRows > 0) {
                const startRow = skipRows + 1;
                return `read_xlsx('${safeUrl}', range='A${startRow}:ZZ1000000', header=true, stop_at_empty=true)`;
            }
            return `read_xlsx('${safeUrl}')`;
        }
        default:
            throw new Error(`Unsupported file extension for DuckDB ingestion: "${extension}"`);
    }
}

export function buildExtensionSetup(extension) {
    const ext = (extension || "").toLowerCase().replace(/^\./, "");

    if (ext === "xlsx") {
        return `INSTALL excel; LOAD excel;`;
    }
    return "";
}