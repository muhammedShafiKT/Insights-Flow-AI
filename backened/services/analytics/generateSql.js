// Wraps a column/identifier name in double quotes for DuckDB,
// escaping any embedded double quotes per SQL standard.
function quoteIdent(name) {
    if (typeof name !== "string" || name.length === 0) {
        throw new Error(`Invalid identifier: ${JSON.stringify(name)}`);
    }
    return `"${name.replace(/"/g, '""')}"`;
}

export function generateSql(candidate) {
    switch (candidate.type) {
        case "comparison": {
            const category = quoteIdent(candidate.category);
            const metric = quoteIdent(candidate.metric);
            return `
       SELECT ${category},
       AVG(TRY_CAST(${metric} AS DOUBLE)) AS value
       FROM dataset
       GROUP BY ${category}
       ORDER BY value DESC
       `;
        }

        case "distribution": {
            const column = quoteIdent(candidate.column);
            return `
       SELECT ${column}
       FROM dataset
       `;
        }

        case "correlation": {
            const x = quoteIdent(candidate.x);
            const y = quoteIdent(candidate.y);
            return `
       SELECT ${x}, ${y}
       FROM dataset
       `;
        }

        case "trend": {
            const date = quoteIdent(candidate.date);
            const metric = quoteIdent(candidate.metric);
            return `
        SELECT ${date},
        AVG(TRY_CAST(${metric} AS DOUBLE)) AS value
        FROM dataset
        GROUP BY ${date}
        ORDER BY ${date}
        `;
        }

        default:
            throw new Error(`Unsupported analysis type : ${candidate.type}`);
    }
}




// export function generateSql(candidate){
// switch (candidate.type) {
//     case "comparison":
//        return `
//        SELECT ${candidate.category},
//        AVG(${candidate.metric}) AS value
//        FROM dataset
//        GROUP BY ${candidate.category}
//        ORDER BY value DESC
//        ` 
//         break;

//     case "distribution":
//         return `
//         SELECT ${candidate.column},
//        FROM dataset
//        `
//         break;

//     case "correlation":
//         return `
//          SELECT ${candidate.x},${candidate.y}
//        FROM dataset
//        `
//         break; 
//     case "trend" :
//         return `
//         SELECT ${candidate.date},
//         AVG(${candidate.metric}) AS value
//         FROM dataset
//         GROUP BY ${candidate.date}
//         ORDER BY ${candidate.date}
//         `       
//         break;
//     default:
//         throw new Error(
//             `Unsupported analysis type : ${candidate.type}`
//         )
//         break;
// }
// }
