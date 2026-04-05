/**
 * Parse a stat display value like "+460" or "+100 ألف" into numeric parts.
 * Returns { num, prefix, suffix } for count-up animation.
 */
export function parseStatValue(value: string): { num: number; prefix: string; suffix: string } {
  const match = value.match(/^([+]?)(\d+)(.*)/);
  if (!match) return { num: 0, prefix: "", suffix: value };
  return { num: parseInt(match[2], 10), prefix: match[1], suffix: match[3] };
}
