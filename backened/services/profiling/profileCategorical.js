export function profileCategorical(values, uniqueRatio) {
  const validvalues = values.filter(
    (value) => value !== null && value !== undefined && String(value).trim() !== ""
  );

  const missingCount = values.length - validvalues.length;

  if (validvalues.length === 0) {
    return {
      count: 0,
      missingCount: values.length,
      missingPercent: 100,
      uniqueCount: 0,
      topValues: [],
      subType: "empty",
    };
  }

  const frequency = {};
  let isEmailColumn = false;

  if (String(validvalues[0]).includes("@")) {
    isEmailColumn = true;
  }

  for (const value of validvalues) {
    const strVal = String(value).trim();
    frequency[strVal] = (frequency[strVal] || 0) + 1;
  }

  const topValues = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([value, count]) => ({ value, count }));

  const uniqueCount = Object.keys(frequency).length;

  let subType = "standard-nominal";
  if (isEmailColumn) {
    subType = "email";
  } else if (uniqueRatio > 0.85) {
    subType = "high-cardinality-text";
  } else if (uniqueCount <= 10) {
    subType = "low-cardinality"; // good for pie/bar charts, safe grouping key
  }

  return {
    count: validvalues.length,
    missingCount,
    missingPercent: Number(((missingCount / values.length) * 100).toFixed(2)),
    uniqueCount,
    topValues,
    subType,
  };
}