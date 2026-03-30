export type UrlTableSortDirection = "asc" | "desc";

export type UrlTableSort = {
  field: string;
  direction: UrlTableSortDirection;
};

export type UrlTableRangeFilter = {
  from: string;
  to: string;
};

export type UrlTableFilterValue =
  | string
  | string[]
  | UrlTableRangeFilter;

export type UrlTableFilters = Record<string, UrlTableFilterValue>;

export type UrlTableState = {
  page: number;
  pageSize: number;
  search?: string;
  filters?: UrlTableFilters;
  sort?: UrlTableSort;
};

export type UrlTableStateConfig = {
  page?: string;
  pageSize?: string;
  search?: string;
  sort?: string;
  filterPrefix?: string;
};

const DEFAULT_CONFIG: Required<
  Pick<
    UrlTableStateConfig,
    "page" | "pageSize" | "search" | "sort" | "filterPrefix"
  >
> = {
  page: "page",
  pageSize: "pageSize",
  search: "search",
  sort: "sort",
  filterPrefix: "filter.",
};

function toIntOrDefault(value: string | null | undefined, fallback: number): number {
  if (!value) return fallback;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function splitCommaSeparated(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function parseRangeFromString(raw: string): UrlTableRangeFilter | null {
  const i = raw.indexOf(":");
  if (i === -1) return null;
  const from = raw.slice(0, i).trim();
  const to = raw.slice(i + 1).trim();
  if (!from || !to) return null;
  return { from, to };
}

function encodeFilterValue(value: UrlTableFilterValue): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(String).join(",");
  return `${value.from}:${value.to}`;
}

export function serializeTableState(
  state: UrlTableState,
  config: UrlTableStateConfig = {},
): string {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const params = new URLSearchParams();

  params.set(cfg.page, String(state.page));
  params.set(cfg.pageSize, String(state.pageSize));

  const search = state.search?.trim();
  if (search) params.set(cfg.search, search);

  if (state.sort && state.sort.field.trim() && state.sort.direction) {
    params.set(cfg.sort, `${state.sort.field}:${state.sort.direction}`);
  }

  if (state.filters) {
    for (const [filterId, raw] of Object.entries(state.filters)) {
      if (raw == null) continue;
      const encoded = encodeFilterValue(raw);
      if (!encoded.trim()) continue;
      params.set(`${cfg.filterPrefix}${filterId}`, encoded);
    }
  }

  return params.toString();
}

export function parseTableState(
  queryStringOrParams: string | URLSearchParams,
  config: UrlTableStateConfig = {},
): UrlTableState {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  const params =
    typeof queryStringOrParams === "string"
      ? new URLSearchParams(
          queryStringOrParams.startsWith("?")
            ? queryStringOrParams.slice(1)
            : queryStringOrParams,
        )
      : queryStringOrParams;

  const page = toIntOrDefault(params.get(cfg.page), 1);
  const pageSize = toIntOrDefault(params.get(cfg.pageSize), 10);

  const searchRaw = params.get(cfg.search);
  const search = searchRaw?.trim();

  const sortRaw = params.get(cfg.sort);
  let sort: UrlTableSort | undefined;
  if (sortRaw) {
    const [fieldRaw, dirRaw] = sortRaw.split(":");
    const field = (fieldRaw ?? "").trim();
    const dir = (dirRaw ?? "").trim();
    if (field && (dir === "asc" || dir === "desc")) {
      sort = {
        field,
        direction: dir,
      };
    }
  }

  const filters: UrlTableFilters = {};
  const prefix = cfg.filterPrefix;

  for (const [key, value] of params.entries()) {
    if (!key.startsWith(prefix)) continue;
    const filterId = key.slice(prefix.length);
    if (!filterId) continue;
    if (value == null) continue;

    // If it's comma-separated, treat it as multi-value.
    if (value.includes(",")) {
      const values = splitCommaSeparated(value);
      if (values.length > 0) filters[filterId] = values;
      continue;
    }

    // Otherwise, treat "from:to" as a single range value.
    const range = parseRangeFromString(value);
    if (range) {
      filters[filterId] = range;
      continue;
    }

    filters[filterId] = value;
  }

  return {
    page,
    pageSize,
    search: search ? search : undefined,
    filters: Object.keys(filters).length > 0 ? filters : undefined,
    sort,
  };
}

/**
 * Example:
 * const next: UrlTableState = {
 *   page: 2,
 *   pageSize: 20,
 *   search: "invoice",
 *   filters: {
 *     status: ["Active", "Pending"],
 *     updatedAt: { from: "2024-01-01", to: "2024-01-31" },
 *   },
 *   sort: { field: "title", direction: "asc" },
 * };
 * const qs = serializeTableState(next);
 * // => "page=2&pageSize=20&search=invoice&sort=title:asc&filter.status=Active,Pending&filter.updatedAt=2024-01-01:2024-01-31"
 *
 * const parsed = parseTableState(qs);
 * // parsed.page === 2, parsed.pageSize === 20, etc.
 */

