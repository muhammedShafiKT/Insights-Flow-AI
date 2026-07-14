export function validateProfile(profile){

    const MAX_MISSING_PERCENT = 50

    const validation = {
        numericColumns: [],
        categoricalColumns: [],
        groupableCategoricalColumns: [], // subset safe for comparison/frequency charts
        datetimeColumns: [],
        availableAnalysis: [],
        warnings: []
    }

    for (const [columnName, columnProfile] of Object.entries(profile)) {
        if (columnProfile.isIdentifier) continue // skip identifiers entirely

        if (columnProfile.missingPercent > MAX_MISSING_PERCENT) {
            validation.warnings.push(`${columnName} is ${columnProfile.missingPercent}% missing — excluded from analysis`)
            continue
        }

        if (columnProfile.wasNumericLikeCategorical) {
            validation.warnings.push(`${columnName}: numeric-looking column reclassified as categorical (low cardinality)`)
        }

        switch (columnProfile.type) {
            case "numeric":
                validation.numericColumns.push(columnName)
                break

            case "categorical":
                validation.categoricalColumns.push(columnName)
                if (columnProfile.subType !== "high-cardinality-text" && columnProfile.subType !== "email") {
                    validation.groupableCategoricalColumns.push(columnName)
                }
                break

            case "datetime":
                validation.datetimeColumns.push(columnName)
                break

            default:
                validation.warnings.push(`unknown type for column ${columnName}`)
        }
    }

    // --- NUMERIC SPECIFIC ANALYSIS ---
    if (validation.numericColumns.length >= 1) {
        validation.availableAnalysis.push("distribution")
    }
    if (validation.numericColumns.length >= 2) {
        validation.availableAnalysis.push("correlation")
    }

    // --- MULTI-VARIABLE RELATIONSHIPS ---
    if (validation.numericColumns.length >= 1 && validation.groupableCategoricalColumns.length >= 1) {
        validation.availableAnalysis.push("comparison")
    }
    if (validation.numericColumns.length >= 1 && validation.datetimeColumns.length >= 1) {
        validation.availableAnalysis.push("trend")
    }

    if (validation.groupableCategoricalColumns.length >= 1) {
        validation.availableAnalysis.push("frequency")
    }
    if (validation.datetimeColumns.length >= 1) {
        validation.availableAnalysis.push("timeCount")
    }

    return validation
}