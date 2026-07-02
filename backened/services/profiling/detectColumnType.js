
import { extractNumeric } from "./extractNumeric.js";

function isNumeric(value) {
  return !isNaN(extractNumeric(value));
}

function isDate(value) {
  if (value === null || value === undefined || String(value).trim() === "") {
    return false;
  }

  const str = String(value).trim();

  // 1. STRENGTHENED DATE REASONABILITY CHECK
  // Ensures it follows typical separator layouts (YYYY-MM-DD, MM/DD/YYYY, etc.)
  // and completely blocks standard phone numbers like 001-626-114-5844 or +1-539-402-0259
  const REASONABLE_DATE_PATTERN = /^\d{2,4}[/\-.]\d{1,2}[/\-.]\d{2,4}/;
  if (!REASONABLE_DATE_PATTERN.test(str)) {
    return false;
  }

  return !isNaN(Date.parse(str));
}

const ID_NAME_PATTERN = /^(id|index|uuid|guid)$|_id$|id$/i;

export function detectColumnType(values, columnName = "") {
  const nonEmpty = values.filter(value =>
    value !== null &&
    value !== undefined &&
    String(value).trim() !== ""
  );

  if (nonEmpty.length === 0) {
    return { type: "categorical", isIdentifier: false };
  }

  const numericCount = nonEmpty.filter(isNumeric).length;
  const dateCount = nonEmpty.filter(isDate).length;
  const uniqueCount = new Set(nonEmpty.map((value) => String(value).trim())).size;
  const uniqueRatio = uniqueCount / nonEmpty.length;

  const nameSaysId = ID_NAME_PATTERN.test(columnName.trim());
  
  const isIdentifier = uniqueRatio >= 0.98 && (nameSaysId || nonEmpty.length > 20);

  let type = "categorical";

  if (numericCount / nonEmpty.length >= 0.8) {
    type = "numeric";
  } else if (dateCount / nonEmpty.length >= 0.8) {
    type = "datetime";
  }

  return { type, isIdentifier, uniqueRatio };
}