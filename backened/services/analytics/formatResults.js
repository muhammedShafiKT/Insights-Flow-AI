// formatResult.js
export const formatResult = (rows) => {
  return rows.map((row) =>
    row.map((value) =>
      typeof value === "bigint" ? Number(value) : value
    )
  );
}; 