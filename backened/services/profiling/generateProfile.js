import { detectColumnType } from "./detectColumnType.js";
import { profileCategorical } from "./profileCategorical.js";
import { profileDate } from "./profileDate.js";
import { profileNumeric } from "./profileNumeric.js";

export function generateProfile(columns) {
  const profile = {};

  for (const [columnName, values] of Object.entries(columns)) {
    const { type, isIdentifier, uniqueRatio, uniqueCount, wasNumericLikeCategorical } =
      detectColumnType(values, columnName);

    let typeProfile;
    if (type === "numeric") {
      typeProfile = profileNumeric(values);
    } else if (type === "categorical") {
      typeProfile = profileCategorical(values, uniqueRatio);
    } else if (type === "datetime") {
      typeProfile = profileDate(values);
    }

    if (!typeProfile || typeProfile.count === 0) {
      continue; // skip empty columns entirely, don't add them to profile
    }

    profile[columnName] = {
      type,
      isIdentifier,
      uniqueCount,
      wasNumericLikeCategorical,
      ...typeProfile,
    };
  }

  return profile;
}