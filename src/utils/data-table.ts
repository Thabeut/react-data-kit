import type { InternalGroupRow, InternalRow } from "../types/data-table";

export const BASE_ROW_KEY = "__datatable_group_";

export function isGroupRow<T>(row: InternalRow<T>): row is InternalGroupRow {
  return (row as InternalGroupRow).__group === true;
}

export function buildGroupedData<T>(
  data: T[],
  getGroupLabel: (record: T) => string,
  order?: string[],
): { groupedData: InternalRow<T>[]; groupOrder: string[] } {
  const groups = new Map<string, T[]>();

  data.forEach((item) => {
    const key = getGroupLabel(item);
    const current = groups.get(key) ?? [];
    current.push(item);
    groups.set(key, current);
  });

  const finalOrder =
    order?.filter((key) => groups.has(key)) ?? Array.from(groups.keys());

  const grouped: InternalRow<T>[] = [];

  finalOrder.forEach((groupKey) => {
    const rows = groups.get(groupKey);
    if (!rows) {
      return;
    }

    grouped.push({
      __group: true,
      __groupKey: groupKey,
    });

    rows.forEach((row) => {
      grouped.push(row);
    });
  });

  return {
    groupedData: grouped,
    groupOrder: finalOrder,
  };
}

export function sliceGroupedDataForPage<T>(
  flat: InternalRow<T>[],
  page: number,
  pageSize: number,
): InternalRow<T>[] {
  const dataLineIndices: number[] = [];
  for (let i = 0; i < flat.length; i++) {
    if (!isGroupRow(flat[i])) dataLineIndices.push(i);
  }
  const n = dataLineIndices.length;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, n);
  if (start >= n) return [];

  const takeDataIndices = new Set(dataLineIndices.slice(start, end));

  const out: InternalRow<T>[] = [];
  let lastEmittedGroupKey: string | null = null;

  for (let i = 0; i < flat.length; i++) {
    const row = flat[i];
    if (isGroupRow(row)) {
      continue;
    }
    if (!takeDataIndices.has(i)) continue;

    let g = i - 1;
    while (g >= 0 && !isGroupRow(flat[g])) g--;
    const gk =
      g >= 0 && isGroupRow(flat[g])
        ? (flat[g] as InternalGroupRow).__groupKey
        : "";

    if (lastEmittedGroupKey !== gk) {
      if (g >= 0 && isGroupRow(flat[g])) {
        out.push(flat[g] as InternalRow<T>);
      }
      lastEmittedGroupKey = gk;
    }
    out.push(row);
  }
  return out;
}
