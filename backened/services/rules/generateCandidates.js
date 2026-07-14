const MAX_DISTRIBUTION = 10;
const MAX_COMPARISON = 15;
const MAX_TREND = 10;
const MAX_CORRELATION = 10;
const MAX_FREQUENCY = 10;

function qualityScore(colName, profile) {
    const prof = profile[colName] || {};
    let score = 100;
    score -= (prof.missingPercent || 0);
    if (prof.subType === "low-cardinality") score += 10;
    if (prof.subType === "high-cardinality-text") score -= 30;
    return score;
}

export function generateCandidates(validation, profile) {
    const candidates = [];

    const getProfileForColumn = (colName) => {
        if (!profile) return null;
        if (profile[colName]) return profile[colName];
        const foundKey = Object.keys(profile).find(
            (k) => k.trim().toLowerCase() === colName.trim().toLowerCase()
        );
        return foundKey ? profile[foundKey] : null;
    };

    const numericColumns = (validation.numericColumns || []).filter((c) => {
        const prof = getProfileForColumn(c);
        return prof ? !prof.isIdentifier : true;
    });

    const categoricalColumns = (validation.categoricalColumns || []).filter((c) => {
        const prof = getProfileForColumn(c);
        if (!prof) return true;
        if (prof.isIdentifier) return false;
        if (prof.subType === "high-cardinality-text") return false;
        return true;
    });

    const datetimeColumns = validation.datetimeColumns || [];

    const effectiveMetrics = numericColumns.length > 0 ? numericColumns : ["row_count"];

    // --- DISTRIBUTION ---
    if (validation.availableAnalysis.includes("distribution") && numericColumns.length > 0) {
        const items = numericColumns
            .map((column) => ({ type: "distribution", column }))
            .sort((a, b) => qualityScore(b.column, profile) - qualityScore(a.column, profile));
        candidates.push(...items.slice(0, MAX_DISTRIBUTION));
    }

    // --- COMPARISON ---
    if (validation.availableAnalysis.includes("comparison")) {
        const items = [];
        for (const category of categoricalColumns) {
            for (const metric of effectiveMetrics) {
                items.push({
                    type: "comparison",
                    metric,
                    category,
                    isDerivedMetric: metric === "row_count",
                });
            }
        }
        items.sort((a, b) => {
            const scoreA = qualityScore(a.category, profile) + (a.isDerivedMetric ? 0 : qualityScore(a.metric, profile));
            const scoreB = qualityScore(b.category, profile) + (b.isDerivedMetric ? 0 : qualityScore(b.metric, profile));
            return scoreB - scoreA;
        });
        candidates.push(...items.slice(0, MAX_COMPARISON));
    }

    // --- TREND ---
    if (validation.availableAnalysis.includes("trend")) {
        const items = [];
        for (const date of datetimeColumns) {
            for (const metric of effectiveMetrics) {
                items.push({
                    type: "trend",
                    metric,
                    date,
                    isDerivedMetric: metric === "row_count",
                });
            }
        }
        items.sort((a, b) => {
            const scoreA = qualityScore(a.date, profile) + (a.isDerivedMetric ? 0 : qualityScore(a.metric, profile));
            const scoreB = qualityScore(b.date, profile) + (b.isDerivedMetric ? 0 : qualityScore(b.metric, profile));
            return scoreB - scoreA;
        });
        candidates.push(...items.slice(0, MAX_TREND));
    }

    // --- CORRELATION ---
    if (validation.availableAnalysis.includes("correlation") && numericColumns.length > 1) {
        const items = [];
        for (let i = 0; i < numericColumns.length; i++) {
            for (let j = i + 1; j < numericColumns.length; j++) {
                items.push({ type: "correlation", x: numericColumns[i], y: numericColumns[j] });
            }
        }
        items.sort((a, b) => {
            const scoreA = qualityScore(a.x, profile) + qualityScore(a.y, profile);
            const scoreB = qualityScore(b.x, profile) + qualityScore(b.y, profile);
            return scoreB - scoreA;
        });
        candidates.push(...items.slice(0, MAX_CORRELATION));
    }

    // --- FREQUENCY ---
    if (validation.availableAnalysis.includes("frequency")) {
        const items = categoricalColumns
            .map((column) => ({ type: "frequency", column }))
            .sort((a, b) => qualityScore(b.column, profile) - qualityScore(a.column, profile));
        candidates.push(...items.slice(0, MAX_FREQUENCY));
    }

    // --- TIME COUNT ---
    if (validation.availableAnalysis.includes("timeCount")) {
        for (const date of datetimeColumns) {
            candidates.push({ type: "timeCount", date });
        }
    }

    return candidates;
}