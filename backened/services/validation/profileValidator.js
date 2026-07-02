export function validateProfile(profile){

    const validation = {
        numericColumns : [] ,
        categoricalColumns : [],
        datetimeColumns :[],
        availableAnalysis :[],
        warnings : []
    }

    for(const [columnName, columnProfile] of Object.entries(profile)){
        if (columnProfile.isIdentifier) continue // skip identifiers entirely

        switch (columnProfile.type){
            case "numeric" :
                validation.numericColumns.push(columnName)
                break

            case "categorical" :
                validation.categoricalColumns.push(columnName)
                break

            case "datetime" :
                validation.datetimeColumns.push(columnName)
                break

            default :
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

    // --- MULTI-VARIABLE RELATIONSHIPS (Requires explicit metrics) ---
    if (validation.numericColumns.length >= 1 && validation.categoricalColumns.length >= 1) {
        validation.availableAnalysis.push("comparison")
    }
    if (validation.numericColumns.length >= 1 && validation.datetimeColumns.length >= 1) {
        validation.availableAnalysis.push("trend")
    }

    if (validation.categoricalColumns.length >= 1) {
        validation.availableAnalysis.push("frequency")
    }
    if (validation.datetimeColumns.length >= 1) {
        validation.availableAnalysis.push("timeCount")
    }

    return validation
}