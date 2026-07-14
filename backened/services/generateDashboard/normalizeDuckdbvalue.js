// dateNormalize.js — shared helper
export const normalizeDuckDBValue = (v)=> {
  if (v && typeof v === "object" && typeof v.days === "number") {
    const ms = v.days * 86400000;
    return new Date(ms).toISOString().slice(0, 10);
  }
  return v;
}