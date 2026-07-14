import { extractNumeric } from "./extractNumeric.js";

export function profileNumeric(values) {
  const validvalues = values.filter(
    (value) => value !== null && value !== undefined && String(value).trim() !== ""
  );

  const missingCount = values.length - validvalues.length;

  if (validvalues.length === 0) {
    return {
      count: 0,
      missingCount: values.length,
      missingPercent: 100,
      unparsedCount: 0,
      min: null,
      max: null,
      mean: null,
    };
  }

  const parsed = validvalues.map(extractNumeric);
  const numbers = parsed.filter((n) => !isNaN(n));
  const unparsedCount = parsed.length - numbers.length;

  if (numbers.length === 0) {
    return {
      count: 0,
      missingCount,
      missingPercent: Number(((missingCount / values.length) * 100).toFixed(2)),
      unparsedCount,
      min: null,
      max: null,
      mean: null,
    };
  }

  const sum = numbers.reduce((a, b) => a + b, 0);

  return {
    count: numbers.length,
    missingCount,
    missingPercent: Number(((missingCount / values.length) * 100).toFixed(2)),
    unparsedCount, // values that looked numeric at detection but failed to parse here — should stay 0 now that both use extractNumeric
    min: Math.min(...numbers),
    max: Math.max(...numbers),
    mean: Number((sum / numbers.length).toFixed(2)),
  };
}