import { detectColumnType } from "./detectColumnType.js";
import { profileCategorical } from "./profileCategorical.js";
import { profileDate } from "./profileDate.js";
import { profileNumeric } from "./profileNumeric.js";

export function generateProfile(columns) {
    const profile = {}
    for (const [columnName, values] of Object.entries(columns)) {
        const type = detectColumnType(values)

        if (type == "numeric") {
            profile[columnName] = {
                type,
                ...profileNumeric(values)
            }
        }

        if (type == "categorical") {
            profile[columnName] = {
                type,
                ...profileCategorical(values)
            }
        }

        if (type == "datetime") {
            profile[columnName] = {
                type,
                ...profileDate(values)
            }
        }
    }
    return profile
}