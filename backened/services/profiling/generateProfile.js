
import { detectColumnType } from "./detectColumnType.js";
import { profileCategorical } from "./profileCategorical.js";
import { profileDate } from "./profileDate.js";
import { profileNumeric } from "./profileNumeric.js";

export function generateProfile(columns) {
    const profile = {}
    for (const [columnName, values] of Object.entries(columns)) {
        // Capture uniqueRatio from type detection phase
        const { type, isIdentifier, uniqueRatio } = detectColumnType(values, columnName)
        
        if (type == "numeric") {
            profile[columnName] = { type, isIdentifier, ...profileNumeric(values) }
        }
        if (type == "categorical") {
            // Pass uniqueRatio into the categorical profile parameters
            profile[columnName] = { type, isIdentifier, ...profileCategorical(values, uniqueRatio) }
        }
        if (type == "datetime") {
            profile[columnName] = { type, isIdentifier, ...profileDate(values) }
        }
        if (profile[columnName] && profile[columnName].count === 0) {
            delete profile[columnName]
        }
    }
    return profile
}