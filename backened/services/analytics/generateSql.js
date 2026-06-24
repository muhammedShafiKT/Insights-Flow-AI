function quoteIdent(name) {
    if (typeof name !== "string" || name.length === 0) {
        throw new Error(`Invalid identifier: ${JSON.stringify(name)}`);
    }
    return `"${name.replace(/"/g, '""')}"`;
}

// Casts column to VARCHAR first, so REGEXP_EXTRACT never receives
// BIGINT/INTEGER/DOUBLE/DATE — fixes DuckDB Binder Error on numeric columns.
function cleanNumeric(quotedCol) {
    return `TRY_CAST(
                REPLACE(
                    REGEXP_EXTRACT(TRY_CAST(${quotedCol} AS VARCHAR), '[\\d,]+(?:\\.\\d+)?'),
                    ',', ''
                ) AS DOUBLE
            )`;
}

export function generateSql(candidate) {
    switch (candidate.type) {

        case "comparison": {
            const category = quoteIdent(candidate.category);
            const metric   = quoteIdent(candidate.metric);
            return `
                SELECT ${category} AS category,
                       AVG(${cleanNumeric(metric)}) AS value
                FROM   dataset
                WHERE  ${cleanNumeric(metric)} IS NOT NULL
                GROUP  BY ${category}
                ORDER  BY value DESC
            `;
        }

        case "distribution": {
            const column = quoteIdent(candidate.column);
            return `
                WITH parsed AS (
                    SELECT ${cleanNumeric(column)} AS val
                    FROM   dataset
                    WHERE  ${cleanNumeric(column)} IS NOT NULL
                ),
                stats AS (
                    SELECT MIN(val) AS min_val,
                           MAX(val) AS max_val
                    FROM parsed
                ),
                bucketed AS (
                    SELECT
                        FLOOR(
                            (p.val - s.min_val)
                            / NULLIF((s.max_val - s.min_val), 0)
                            * 20
                        ) AS bucket,
                        p.val,
                        s.min_val,
                        s.max_val
                    FROM parsed p, stats s
                )
                SELECT
                    ROUND(min_val + (bucket / 20.0) * (max_val - min_val), 2) AS x,
                    COUNT(*) AS count
                FROM   bucketed
                GROUP  BY bucket, min_val, max_val
                ORDER  BY bucket
            `;
        }

        case "correlation": {
            const x = quoteIdent(candidate.x);
            const y = quoteIdent(candidate.y);
            return `
                SELECT
                    ${cleanNumeric(x)} AS x,
                    ${cleanNumeric(y)} AS y
                FROM dataset
                WHERE ${cleanNumeric(x)} IS NOT NULL
                  AND ${cleanNumeric(y)} IS NOT NULL
            `;
        }

        case "trend": {
            const date   = quoteIdent(candidate.date);
            const metric = quoteIdent(candidate.metric);
            return `
                SELECT ${date}                      AS date,
                       AVG(${cleanNumeric(metric)}) AS value
                FROM   dataset
                WHERE  ${cleanNumeric(metric)} IS NOT NULL
                GROUP  BY ${date}
                ORDER  BY ${date}
            `;
        }

        default:
            throw new Error(`Unsupported analysis type: ${candidate.type}`);
    }
}