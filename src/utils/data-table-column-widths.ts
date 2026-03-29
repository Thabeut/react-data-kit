const STORAGE_PREFIX = "datatable-kit:column-widths:";

export function loadColumnWidths(tableId: string): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + tableId);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(parsed)) {
      const n = Number(v);
      if (Number.isFinite(n) && n > 0) out[k] = n;
    }
    return out;
  } catch {
    return {};
  }
}

export function saveColumnWidths(
  tableId: string,
  widths: Record<string, number>,
): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_PREFIX + tableId,
      JSON.stringify(widths),
    );
  } catch {}
}
