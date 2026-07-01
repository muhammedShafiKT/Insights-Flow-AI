export function generateCandidates(validation, profile) {
    const candidates = []

    // 1. Helper function to safely look up keys regardless of minor casing/whitespace mismatches
    const getProfileForColumn = (colName) => {
        if (!profile) return null;
        if (profile[colName]) return profile[colName];
        // Case-insensitive fallback lookup
        const foundKey = Object.keys(profile).find(k => k.trim().toLowerCase() === colName.trim().toLowerCase());
        return foundKey ? profile[foundKey] : null;
    };

    // 2. Filter out explicit identifiers (like Index or Customer Id)
    const numericColumns = (validation.numericColumns || []).filter(c => {
        const prof = getProfileForColumn(c);
        return prof ? !prof.isIdentifier : true;
    });
    
    // 3. Filter out identifiers AND messy high-cardinality columns (Names, IDs)
    const categoricalColumns = (validation.categoricalColumns || []).filter(c => {
        const prof = getProfileForColumn(c);
        if (!prof) return true; // If unknown, keep it safe
        if (prof.isIdentifier) return false;
        if (prof.subType === "high-cardinality-text") return false;
        return true;
    });

    const datetimeColumns = validation.datetimeColumns || [];

    // 4. Fallback to row_count ONLY if no real metrics exist
    const effectiveMetrics = numericColumns.length > 0 ? numericColumns : ["row_count"];

    // --- DISTRIBUTION ---
    if (validation.availableAnalysis.includes("distribution") && numericColumns.length > 0) {
        for (const column of numericColumns) {
            candidates.push({ type: "distribution", column });
        }
    }

    // --- COMPARISON (e.g., Metrics by Country/Region) ---
    if (validation.availableAnalysis.includes("comparison")) {
        let compCount = 0;
        for (const category of categoricalColumns) {
            for (const metric of effectiveMetrics) {
                if (compCount > 15) break;
                candidates.push({ 
                    type: "comparison", 
                    metric, 
                    category,
                    isDerivedMetric: metric === "row_count"
                });
                compCount++;
            }
        }
    }

    // --- TREND ---
    if (validation.availableAnalysis.includes("trend")) {
        for (const date of datetimeColumns) {
            for (const metric of effectiveMetrics) {
                candidates.push({ 
                    type: "trend", 
                    metric, 
                    date,
                    isDerivedMetric: metric === "row_count"
                });
            }
        }
    }

    // --- CORRELATION ---
    if (validation.availableAnalysis.includes("correlation") && numericColumns.length > 1) {
        let corrCount = 0;
        for (let i = 0; i < numericColumns.length; i++) {
            for (let j = i + 1; j < numericColumns.length; j++) {
                if (corrCount > 10) break;
                candidates.push({ type: "correlation", x: numericColumns[i], y: numericColumns[j] });
                corrCount++;
            }
        }
    }
    
    // --- FREQUENCY ---
if (validation.availableAnalysis.includes("frequency")) {
        for (const column of categoricalColumns) { //  FIXED: Now loops through the filtered array
            candidates.push({ type: "frequency", column });
        }
    }

    // --- TIME COUNT ---
    if (validation.availableAnalysis.includes("timeCount")) {
        for (const date of datetimeColumns) {
            candidates.push({ type: "timeCount", date });
        }
    }

    return candidates;
}