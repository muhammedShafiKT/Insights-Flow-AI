export function extractNumeric(value) {
  if (value === null || value === undefined || value === "") {
    return NaN;
  }

  const str = String(value).trim();

  if (/^(n\/a|na|none|nil|-|—)$/i.test(str)) {
    return NaN;
  }


  const unitPattern = /\s*(kwh|cc|hp|km\/h|kmh|mph|nm|sec|s|kg|lbs|rpm|kw|ps|battery|batt|electric|hybrid\s*batt?)\b.*$/i;

  const labelFirstMatch = str.match(/^[a-zA-Z\s]+\(([^)]*\d[^)]*)\)?/i);
  if (labelFirstMatch) {
    const remainder = str.slice(labelFirstMatch[0].length);
    if (!/[/,]/.test(remainder)) {
      return extractNumeric(labelFirstMatch[1]);
    }
  }
  let normalized = str.split(/\s*\+\s*/)[0].trim();

  const UNIT_WORD = "(?:kwh|cc|hp|km\\/h|kmh|mph|nm|sec|kg|lbs|rpm|kw|ps|battery|batt|electric|hybrid)";

  // word or an opening paren — real measurement variants always do.
  function splitVariants(s) {
    const parts = [];
    let last = 0;
    const sepRe = /\s*\/\s*|,/g;
    let m;
    while ((m = sepRe.exec(s))) {
      if (m[0].trim() === "/") {
        parts.push(s.slice(last, m.index));
        last = sepRe.lastIndex;
        continue;
      }
      // comma case: skip if it's a thousands separator (digit on both sides)
      const before = s[m.index - 1];
      const after = s[m.index + 1];
      if (/\d/.test(before) && /\d/.test(after)) continue;

      const rest = s.slice(m.index + 1);
      const nextBoundaryIdx = rest.search(/\/|,(?!\d)/);
      const lookahead = nextBoundaryIdx === -1 ? rest : rest.slice(0, nextBoundaryIdx);
      const looksLikeVariant = new RegExp(UNIT_WORD, "i").test(lookahead) || /\(/.test(lookahead);
      if (looksLikeVariant) {
        parts.push(s.slice(last, m.index));
        last = m.index + 1;
      }
    }
    parts.push(s.slice(last));
    return parts.map(p => p.trim());
  }

  const segments = splitVariants(normalized);

  const numbers = segments
    .map(seg => {
      seg = seg.trim();

      const segLabelMatch = seg.match(/^[a-zA-Z\s]+\(([^)]*\d[^)]*)\)$/i);
      if (segLabelMatch) {
        seg = segLabelMatch[1];
      }

      let cleaned = seg
        .replace(/\(.*?\)/g, "")    // strip parentheticals: "(V6)", "(petrol)", "(I4)"
        .replace(/~/, "")            // strip tilde
        .trim()
        .replace(/^\$/, "")
        .replace(/%$/, "")
        .replace(unitPattern, "")    // strip unit suffixes FIRST
        .replace(/,/g, "")           // THEN remove commas (thousand separators)
        .trim();

     
      const rangeMatch = cleaned.match(/^(-?\d+(\.\d+)?)\s*-\s*(-?\d+(\.\d+)?)$/);
      if (rangeMatch) {
        const a = Number(rangeMatch[1]);
        const b = Number(rangeMatch[3]);
        return (a + b) / 2;
      }

      if (/[a-zA-Z]/.test(cleaned)) return NaN;

      const match = cleaned.match(/^-?\d+(\.\d+)?$/);
      return match ? Number(cleaned) : NaN;
    })
    .filter(n => !isNaN(n));

  if (numbers.length === 0) return NaN;

  return numbers[0];
}
