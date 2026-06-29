
import XLSX from "xlsx"
import Papa from "papaparse"

export function papaparseCSV(buffer) {
    const csvText = buffer.toString("utf8")
    const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true
    })
    if (result.errors.length) {
        throw new Error("invalid CSV file")
    }
    return result.data
}

// ---- header-row detection -------------------------------------------------

function scoreHeaderRow(rows, idx) {
    const row = rows[idx]
    const nonEmpty = row.filter(c => c !== null && c !== undefined && String(c).trim() !== "")

    if (nonEmpty.length < 2) return -1

    const fillRatio = nonEmpty.length / row.length
    const strRatio = nonEmpty.filter(c => typeof c === "string").length / nonEmpty.length

    let score = fillRatio + strRatio

    const nextRow = rows[idx + 1]
    if (nextRow) {
        const nextNonEmpty = nextRow.filter(c => c !== null && c !== undefined && String(c).trim() !== "")
        if (nextNonEmpty.length > 0) {
            const nextNumericRatio = nextNonEmpty.filter(c => typeof c === "number").length / nextNonEmpty.length
            score += nextNumericRatio
        }
    }

    return score
}

function detectHeaderRow(rows, maxScan = 10) {
    let bestIdx = 0
    let bestScore = -1

    const scanLimit = Math.min(maxScan, rows.length)
    for (let i = 0; i < scanLimit; i++) {
        const s = scoreHeaderRow(rows, i)
        if (s > bestScore) {
            bestScore = s
            bestIdx = i
        }
    }

    return { index: bestIdx, score: bestScore }
}

function normalizeHeaders(headerRow) {
    const seen = new Map()
    return headerRow.map((cell, i) => {
        let name = (cell === null || cell === undefined) ? "" : String(cell).trim()
        if (name === "") {
            name = `Unnamed Column ${i + 1}`
        }
        if (seen.has(name)) {
            const count = seen.get(name) + 1
            seen.set(name, count)
            name = `${name} (${count})`
        } else {
            seen.set(name, 1)
        }
        return name
    })
}

// ---------------------------------------------------------------------------

// Now returns { rows, headerRowIndex } instead of just rows, so callers can
// persist headerRowIndex (used later as the DuckDB `skip` value, so analysis
// queries skip the same junk rows that profiling skipped).
export function parseExcel(buffer) {
    try {
        const workbook = XLSX.read(buffer, { type: "buffer" })
        const firstsheet = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstsheet]

        const rawRows = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: null
        })

        if (rawRows.length === 0) {
            return { rows: [], headerRowIndex: 0 }
        }

        const { index: headerRowIndex } = detectHeaderRow(rawRows)
        const headers = normalizeHeaders(rawRows[headerRowIndex])
        const dataRows = rawRows.slice(headerRowIndex + 1)

        const rows = dataRows
            .filter(row => row.some(cell => cell !== null && cell !== undefined && String(cell).trim() !== ""))
            .map(row => {
                const obj = {}
                headers.forEach((header, i) => {
                    obj[header] = row[i] !== undefined ? row[i] : null
                })
                return obj
            })

        return { rows, headerRowIndex }
    } catch (error) {
        throw new Error("Invalid Excel File")
    }
}

// CSV never has this problem (Papa Parse handles header:true correctly from
// row 1 always), so headerRowIndex is always 0 for csv.
export function Dataparser(buffer, extension) {
    switch (extension) {
        case "csv":
            return { rows: papaparseCSV(buffer), headerRowIndex: 0 }

        case "xlsx":
        case "xls":
            return parseExcel(buffer)

        default:
            throw new Error("invalid data type")
    }
}

export function ExtractMetadata(rows) {
    if (!rows.length) {
        return { rowCount: 0, columnCount: 0, columns: [] }
    }
    const columns = Object.keys(rows[0])
    return { rowCount: rows.length, columnCount: columns.length, columns }
}