// runAnalysis.js
import { executeQuery } from "./executeQuery.js";
import { generateSql } from "./generateSql.js";
import { loadDataset } from "./loadDataset.js";

export async function runAnalysis(candidates, signedUrl, fileType, skipRows) {
    const connection = await loadDataset(signedUrl, fileType, skipRows);
    const results = [];

    for (const candidate of candidates) {
        let sql;
        try {
            sql = generateSql(candidate);
            const result = await executeQuery(connection, sql);
            results.push({ candidate, sql, result, success: true });
        } catch (err) {
            console.error(
                `Candidate failed: ${candidate.type} (${candidate.column || candidate.metric || ""})`,
                err.message
            );
            results.push({ candidate, sql, error: err.message, success: false });
        }
    }

    return results;
}