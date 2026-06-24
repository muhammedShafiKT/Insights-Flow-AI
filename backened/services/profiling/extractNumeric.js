export function extractNumeric(value) {
  if (value === null || value === undefined || value === "") {
    return NaN;
  }

  const str = String(value).trim();

  // Explicit null markers
  if (/^(n\/a|na|none|nil|-|—)$/i.test(str)) {
    return NaN;
  }

  // Unit token can be followed by extra descriptive words (e.g. "kWh battery",
  // "kWh Higher End Model") — match the unit itself and swallow any trailing
  // words after it, rather than requiring the unit to sit at the exact end.
  const unitPattern = /\s*(kwh|cc|hp|km\/h|kmh|mph|nm|sec|s|kg|lbs|rpm|kw|ps|battery|batt|electric|hybrid\s*batt?)\b.*$/i;

  // Label-first pattern: "Battery (68-98 kWh)", "Battery (98 kWh)".
  // Use the FIRST parenthetical that contains a digit, but only treat this
  // as a true single label-first value if nothing meaningful (another
  // "/" or "," separated variant) follows the matched parenthetical.
  const labelFirstMatch = str.match(/^[a-zA-Z\s]+\(([^)]*\d[^)]*)\)?/i);
  if (labelFirstMatch) {
    const remainder = str.slice(labelFirstMatch[0].length);
    if (!/[/,]/.test(remainder)) {
      return extractNumeric(labelFirstMatch[1]);
    }
  }

  // Strip everything after + (e.g. "+ Electric Motor", "+ batt", "+ Battery")
  let normalized = str.split(/\s*\+\s*/)[0].trim();

  const UNIT_WORD = "(?:kwh|cc|hp|km\\/h|kmh|mph|nm|sec|kg|lbs|rpm|kw|ps|battery|batt|electric|hybrid)";

  // Split a string into engine/battery "variants" on "/" or on a comma —
  // but only when that comma is genuinely separating two variants
  // (e.g. "999 cc / 1498 cc", "HYBRID(2,494 cc),V6(3,456 cc)"), never when
  // it's a thousands separator (digit,digit) or an unrelated label/value
  // pair from a totally different column shape (e.g. "Model,2024").
  // A comma only counts as a variant-separator if the text immediately
  // following it (up to the next separator) contains a recognized unit
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

      // Per-segment label-wrapped number: "HYBRID(2,494 cc)", "V6(3,456 cc)" —
      // the parenthetical here IS the value, so unwrap it instead of letting
      // the generic "(...)" annotation-stripper below discard the number.
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

      // Now handle ranges — commas already gone so "1,500 - 2,000" → "1500 - 2000"
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
