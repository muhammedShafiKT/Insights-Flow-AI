import { extractNumeric } from "./extractNumeric.js";

function isNumeric(value) {
  return !isNaN(extractNumeric(value));
}

function isDate(value) {
  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  ) {
    return false;
  }

  const str = String(value).trim();

  // Require a date separator
  if (!/[\/\-]/.test(str)) {
    return false;
  }

  return !isNaN(Date.parse(str));
}

export function detectColumnType(values) {
  const nonEmpty = values.filter(value =>
    value !== null &&
    value !== undefined &&
    String(value).trim() !== ""
  );

  if (nonEmpty.length === 0) {
    return "categorical";
  }

  const numericCount = nonEmpty.filter(isNumeric).length;
  const dateCount = nonEmpty.filter(isDate).length;
  const uniqueCount = new Set(nonEmpty.map((value)=>String(value).trim())).size
 const uniqueRatio = uniqueCount/nonEmpty.length
  if (numericCount / nonEmpty.length >= 0.8) {
    return "numeric";
  }

  if (dateCount / nonEmpty.length >= 0.8) {
    return "datetime";
  }

  return "categorical";
}