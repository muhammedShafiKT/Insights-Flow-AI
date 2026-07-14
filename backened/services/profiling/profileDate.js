export function profileDate(values) {
  const validvalues = values.filter(
    (value) => value !== null && value !== undefined && String(value).trim() !== ""
  );

  const missingCount = values.length - validvalues.length;

  if (validvalues.length === 0) {
    return {
      count: 0,
      missingCount: values.length,
      missingPercent: 100,
      invalidCount: 0,
      earliest: null,
      latest: null,
    };
  }

  const parsedDates = validvalues.map((value) => new Date(value));
  const dates = parsedDates.filter((d) => !isNaN(d.getTime()));
  const invalidCount = parsedDates.length - dates.length;

  if (dates.length === 0) {
    return {
      count: 0,
      missingCount,
      missingPercent: Number(((missingCount / values.length) * 100).toFixed(2)),
      invalidCount,
      earliest: null,
      latest: null,
    };
  }

  return {
    count: dates.length,
    missingCount,
    missingPercent: Number(((missingCount / values.length) * 100).toFixed(2)),
    invalidCount, // values that passed detection's 80% threshold but failed to parse here
    earliest: new Date(Math.min(...dates)),
    latest: new Date(Math.max(...dates)),
  };
}