import { extractNumeric } from "./extractNumeric.js";

function isNumeric(value) {
  return !isNaN(extractNumeric(value));
}

function isDate(value) {
  if (value === null || value === undefined || String(value).trim() === "") {
    return false;
  }

  const str = String(value).trim();

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
    return { type: "categorical", isIdentifier: false, uniqueRatio: 0 };
  }

  const numericCount = nonEmpty.filter(isNumeric).length;
  const dateCount = nonEmpty.filter(isDate).length;
  const uniqueValues = new Set(nonEmpty.map((value) => String(value).trim()));
  const uniqueCount = uniqueValues.size;
  const uniqueRatio = uniqueCount / nonEmpty.length;

  const nameSaysId = ID_NAME_PATTERN.test(columnName.trim());

  // Identifiers: near-unique AND (name says so, OR values are pure integer codes)
  const looksLikeIntegerCode = nonEmpty.every(
    (v) => /^-?\d+$/.test(String(v).trim())
  );
  const isIdentifier =
    uniqueRatio >= 0.98 &&
    (nameSaysId || (looksLikeIntegerCode && nonEmpty.length > 20));

  let type = "categorical";

  if (numericCount / nonEmpty.length >= 0.8) {
    type = "numeric";
  } else if (dateCount / nonEmpty.length >= 0.8) {
    type = "datetime";
  }

  // Low-cardinality numeric override: flags, ratings, encoded categories
  // (e.g. 0/1 binary, 1-5 Likert scale) should NOT be treated as continuous numeric.
  const isLowCardinalityNumeric =
    type === "numeric" &&
    !isIdentifier &&
    uniqueCount <= 10 &&
    uniqueRatio < 0.05;

  if (isLowCardinalityNumeric) {
    type = "categorical";
  }

  return {
    type,
    isIdentifier,
    uniqueRatio,
    uniqueCount,
    wasNumericLikeCategorical: isLowCardinalityNumeric, // useful downstream signal
  };
}