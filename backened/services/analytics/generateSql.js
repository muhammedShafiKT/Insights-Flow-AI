function quoteIdent(name) {
    if (typeof name !== "string" || name.length === 0) {
        throw new Error(`Invalid identifier: ${JSON.stringify(name)}`);
    }
    return `"${name.replace(/"/g, '""')}"`;
}


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
            

            if (candidate.metric === "row_count" || candidate.isDerivedMetric) {
                return `
                    SELECT ${category} AS category,
                           COUNT(*) AS value
                    FROM   dataset
                    WHERE  ${category} IS NOT NULL
                    GROUP  BY ${category}
                    ORDER  BY value DESC
                    LIMIT  20
                `;
            }

            const metric = quoteIdent(candidate.metric);
            return `
                SELECT ${category} AS category,
                       AVG(${cleanNumeric(metric)}) AS value
                FROM   dataset
                WHERE  ${cleanNumeric(metric)} IS NOT NULL
                  AND  ${category} IS NOT NULL
                GROUP  BY ${category}
                ORDER  BY value DESC
                LIMIT  20
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
            const date = quoteIdent(candidate.date);
            
            if (candidate.metric === "row_count" || candidate.isDerivedMetric) {
                return `
                    SELECT CAST(${date} AS VARCHAR) AS date,
                           COUNT(*) AS value
                    FROM   dataset
                    WHERE  ${date} IS NOT NULL
                    GROUP  BY ${date}
                    ORDER  BY ${date} ASC
                `;
            }

            const metric = quoteIdent(candidate.metric);
            return `
                SELECT CAST(${date} AS VARCHAR) AS date,
                       AVG(${cleanNumeric(metric)}) AS value
                FROM   dataset
                WHERE  ${cleanNumeric(metric)} IS NOT NULL
                  AND  ${date} IS NOT NULL
                GROUP  BY ${date}
                ORDER  BY ${date} ASC
            `;
        }

        case "frequency": {
            const column = quoteIdent(candidate.column);
            return `
                SELECT ${column} AS category,
                       COUNT(*) AS value
                FROM   dataset
                WHERE  ${column} IS NOT NULL
                GROUP  BY ${column}
                ORDER  BY value DESC
                LIMIT  20
            `;
        }

        case "timeCount": {
            const date = quoteIdent(candidate.date);
            return `
                SELECT CAST(${date} AS VARCHAR) AS date,
                       COUNT(*) AS value
                FROM   dataset
                WHERE  ${date} IS NOT NULL
                GROUP  BY ${date}
                ORDER  BY ${date} ASC
            `;
        }

        default:
            throw new Error(`Unsupported analysis type: ${candidate.type}`);
    }
}