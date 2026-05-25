// Lightweight CSV export utility for admin tables.
// UTF-8 BOM is prepended so Excel reads Arabic correctly.

export type CsvColumn<T> = {
  header: string;
  value: (row: T) => string | number | null | undefined;
};

const escape = (v: unknown): string => {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const head = columns.map((c) => escape(c.header)).join(",");
  const body = rows
    .map((r) => columns.map((c) => escape(c.value(r))).join(","))
    .join("\r\n");
  return `${head}\r\n${body}`;
}

export function downloadCsv<T>(filename: string, rows: T[], columns: CsvColumn<T>[]) {
  const csv = toCsv(rows, columns);
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}-${stamp}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
