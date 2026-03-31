import type { ReactNode } from "react";
import { useCallback, useMemo } from "react";
import { DataTable } from "../data-table";
import type {
  DataTableActionsConfig,
  DataTableColumnInfo,
  DataTableCustomColors,
  DataTableFilterConfig,
  DataTableGroupConfig,
  DataTableKey,
  DataTablePaginationConfig,
  DataTablePaginationState,
  DataTableProps,
  DataTableSortState,
} from "../../types/data-table";
import type {
  UrlTableFilterValue,
  UrlTableRangeFilter,
  UrlTableSort,
  UrlTableState,
} from "../../utils/url-table-state";

export interface QueryResultAdapter<TItem, TRaw> {
  selectItems: (data: TRaw | undefined) => TItem[];
  selectTotalItems?: (data: TRaw | undefined) => number;
}

export type QueryTableQueryArgs = {
  page: number;
  [key: string]: unknown;
};

export type QueryTableRequestPayload<
  TQueryArgs extends object = QueryTableQueryArgs,
> = {
  tag: { type: string };
  query: TQueryArgs;
};

type TUseQueryHook<TQueryArgs extends object, TRaw> = (
  args: QueryTableRequestPayload<TQueryArgs>,
) => {
  data?: TRaw;
  isLoading: boolean;
  isFetching?: boolean;
  refetch: () => void;
};

export interface QueryTableProps<
  TItem extends { [key: string]: unknown },
  TRaw,
> {
  tableState: UrlTableState;
  onTableStateChange: (next: UrlTableState) => void;

  tableId: string;
  rowKey: DataTableProps<TItem>["rowKey"];
  columnsInfo: DataTableColumnInfo<TItem>[];

  useQuery: TUseQueryHook<Record<string, unknown>, TRaw>;
  tag: { type: string; id?: string };
  extraQuery?: Record<string, unknown>;
  resultAdapter: QueryResultAdapter<TItem, TRaw>;

  pageSizeOptions?: DataTablePaginationConfig["pageSizeOptions"];
  initialPageSize?: number;

  className?: string;
  customColors?: DataTableCustomColors;

  filters?: DataTableFilterConfig[];
  groupConfig?: DataTableGroupConfig<TItem>;

  renderToolbarRight?: ReactNode;
  renderToolbarLeft?: ReactNode;
  searchPlaceholder?: string;

  actions?: DataTableActionsConfig<TItem>;
  disableSelectionAndBookmark?: boolean;
  hideColumnOptions?: boolean;
  onSelectionChange?: (selectedRowKeys: DataTableKey[], rows: TItem[]) => void;
  onBookmarkChange?: (bookmarkedRowKeys: DataTableKey[], rows: TItem[]) => void;
  onRowClick?: (record: TItem) => void;

  // Query arg mapping keys
  limitKey?: string;
  searchKey?: string;
  sortKey?: string;
  filterQueryKeys?: Record<string, string>;
}

function mapSortToDataTableSort(
  sort: UrlTableSort | undefined,
): DataTableSortState | null {
  if (!sort) return null;
  return {
    columnId: sort.field,
    order: sort.direction === "asc" ? "ascend" : "descend",
  };
}

function mapFilterValueForDataTable(
  raw: UrlTableFilterValue | undefined,
  filter: DataTableFilterConfig,
): unknown {
  if (raw == null) return undefined;

  const type = filter.type ?? "multi";

  if (type === "date") {
    if (typeof raw === "string") {
      const i = raw.indexOf(":");
      if (i === -1) return undefined;
      const from = raw.slice(0, i).trim();
      const to = raw.slice(i + 1).trim();
      if (!from || !to) return undefined;
      return { date_from: from, date_to: to };
    }

    const range = raw as UrlTableRangeFilter;
    if (
      typeof range.from !== "string" ||
      typeof range.to !== "string" ||
      !range.from.trim() ||
      !range.to.trim()
    ) {
      return undefined;
    }

    return { date_from: range.from, date_to: range.to };
  }

  if (type === "single") {
    if (Array.isArray(raw)) return raw[0] != null ? String(raw[0]) : undefined;
    if (typeof raw === "string") return raw;
    return undefined;
  }

  // multi
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === "string") return [raw];
  return undefined;
}

function mapFilterValueForQuery(
  raw: UrlTableFilterValue | undefined,
  filter: DataTableFilterConfig,
): unknown {
  if (raw == null) return undefined;
  const type = filter.type ?? "multi";

  if (type === "date") {
    if (typeof raw === "string") {
      const i = raw.indexOf(":");
      if (i === -1) return undefined;
      const from = raw.slice(0, i).trim();
      const to = raw.slice(i + 1).trim();
      if (!from || !to) return undefined;
      return { date_from: from, date_to: to };
    }

    const range = raw as UrlTableRangeFilter;
    if (
      typeof range.from !== "string" ||
      typeof range.to !== "string" ||
      !range.from.trim() ||
      !range.to.trim()
    ) {
      return undefined;
    }

    return { date_from: range.from, date_to: range.to };
  }

  if (type === "single") {
    if (Array.isArray(raw)) return raw[0] != null ? String(raw[0]) : undefined;
    if (typeof raw === "string") return raw;
    return undefined;
  }

  // multi
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === "string") return [raw];
  return undefined;
}

export function QueryTable<TItem extends { [key: string]: unknown }, TRaw>(
  props: QueryTableProps<TItem, TRaw>,
) {
  const {
    tableState,
    onTableStateChange,

    tableId,
    rowKey,
    columnsInfo,

    useQuery,
    tag,
    extraQuery,
    resultAdapter,

    pageSizeOptions = [5, 10, 20, 50],
    initialPageSize,

    className,
    customColors,

    filters,
    groupConfig,
    renderToolbarRight,
    renderToolbarLeft,
    searchPlaceholder,
    actions,
    disableSelectionAndBookmark,
    hideColumnOptions,
    onSelectionChange,
    onBookmarkChange,
    onRowClick,

    limitKey = "limit",
    searchKey = "search",
    sortKey = "sort",
    filterQueryKeys,
  } = props;

  const resolvedPageSize =
    tableState.pageSize || initialPageSize || pageSizeOptions[0] || 10;

  const paginationState: DataTablePaginationState = useMemo(
    () => ({
      page: tableState.page,
      pageSize: resolvedPageSize,
    }),
    [tableState.page, resolvedPageSize],
  );

  const dataTableFilterValues = useMemo(() => {
    const next: Record<string, unknown> = {};
    if (!filters) return next;

    for (const filter of filters) {
      const raw = tableState.filters?.[filter.id];
      const mapped = mapFilterValueForDataTable(raw, filter);
      if (mapped == null) continue;
      if (Array.isArray(mapped) && mapped.length === 0) continue;
      next[filter.id] = mapped;
    }

    return next;
  }, [filters, tableState.filters]);

  const sortState = useMemo(
    () => mapSortToDataTableSort(tableState.sort),
    [tableState.sort],
  );

  const query = useMemo(() => {
    const q: Record<string, unknown> = {
      page: tableState.page,
      [limitKey]: resolvedPageSize,
      ...(extraQuery ?? {}),
    };

    const s = tableState.search?.trim();
    if (s) {
      q[searchKey] = s;
    }

    if (tableState.sort) {
      q[sortKey] = {
        field: tableState.sort.field,
        direction: tableState.sort.direction,
      };
    }

    // Include known filters (from UI config) first to keep encoding consistent.
    if (filters) {
      for (const filter of filters) {
        const raw = tableState.filters?.[filter.id];
        if (raw == null) continue;
        const queryKey = filterQueryKeys?.[filter.id] ?? filter.id;
        const mapped = mapFilterValueForQuery(raw, filter);
        if (mapped == null) continue;
        q[queryKey] = mapped;
      }
    }

    // Then include any extra filters not in the UI config.
    if (tableState.filters) {
      for (const [filterId, raw] of Object.entries(tableState.filters)) {
        if (filters?.some((f) => f.id === filterId)) continue;
        const queryKey = filterQueryKeys?.[filterId] ?? filterId;
        if (raw == null) continue;
        q[queryKey] = raw;
      }
    }

    return q;
  }, [
    tableState.page,
    resolvedPageSize,
    extraQuery,
    tableState.search,
    tableState.sort,
    filters,
    filterQueryKeys,
    tableState.filters,
    limitKey,
    searchKey,
    sortKey,
  ]);

  const { data, isLoading, isFetching, refetch } = useQuery({
    tag,
    query,
  });

  const items = resultAdapter.selectItems(data);
  const totalItems =
    resultAdapter.selectTotalItems?.(data) ?? items.length ?? 0;

  const onSearch = useCallback(
    (value: string) => {
      const nextSearch = value.trim() || undefined;
      onTableStateChange({
        ...tableState,
        page: 1,
        search: nextSearch,
      });
    },
    [onTableStateChange, tableState],
  );

  const onPageChange = useCallback(
    (nextPage: number, nextPageSize: number) => {
      onTableStateChange({
        ...tableState,
        page: nextPage,
        pageSize: nextPageSize,
      });
    },
    [onTableStateChange, tableState],
  );

  const onSortChange = useCallback(
    (next: DataTableSortState | null) => {
      onTableStateChange({
        ...tableState,
        page: 1,
        sort: next
          ? {
              field: next.columnId,
              direction: next.order === "ascend" ? "asc" : "desc",
            }
          : undefined,
      });
    },
    [onTableStateChange, tableState],
  );

  const onFilterChange = useCallback(
    (filterId: string, value: unknown) => {
      const filterCfg = filters?.find((f) => f.id === filterId);
      const type = filterCfg?.type ?? "multi";

      const nextFilters: Record<string, UrlTableFilterValue> = {
        ...(tableState.filters ?? {}),
      };

      if (type === "date") {
        if (!value) {
          delete nextFilters[filterId];
        } else if (
          typeof value === "object" &&
          value !== null &&
          "date_from" in value &&
          "date_to" in value
        ) {
          const v = value as { date_from?: unknown; date_to?: unknown };
          const from = typeof v.date_from === "string" ? v.date_from : null;
          const to = typeof v.date_to === "string" ? v.date_to : null;
          if (from && to) {
            nextFilters[filterId] = { from, to };
          } else {
            delete nextFilters[filterId];
          }
        } else {
          delete nextFilters[filterId];
        }
      } else if (type === "single") {
        const nextValues = Array.isArray(value) ? value.map(String) : [];
        const first = nextValues[0];
        if (!first) {
          delete nextFilters[filterId];
        } else {
          nextFilters[filterId] = first;
        }
      } else {
        const nextValues = Array.isArray(value) ? value.map(String) : [];
        if (nextValues.length === 0) {
          delete nextFilters[filterId];
        } else {
          nextFilters[filterId] = nextValues;
        }
      }

      onTableStateChange({
        ...tableState,
        page: 1,
        filters: Object.keys(nextFilters).length > 0 ? nextFilters : undefined,
      });
    },
    [filters, onTableStateChange, tableState],
  );

  return (
    <DataTable<TItem>
      tableId={tableId}
      rowKey={rowKey}
      columnsInfo={columnsInfo}
      dataSource={items}
      serverMode
      loading={Boolean(isFetching ?? isLoading)}
      pagination={{
        pageSizeOptions,
        defaultPageSize:
          pageSizeOptions[0] ?? initialPageSize ?? paginationState.pageSize,
        totalItems,
      }}
      paginationState={paginationState}
      onPageChange={onPageChange}
      sortState={sortState}
      onSortChange={onSortChange}
      filters={filters}
      filterValues={dataTableFilterValues}
      onFilterChange={onFilterChange}
      onRefresh={refetch}
      renderToolbarLeft={renderToolbarLeft}
      renderToolbarRight={renderToolbarRight}
      searchValue={searchPlaceholder ? tableState.search : undefined}
      onSearch={searchPlaceholder ? onSearch : undefined}
      searchPlaceholder={searchPlaceholder}
      actions={actions}
      disableSelectionAndBookmark={disableSelectionAndBookmark}
      hideColumnOptions={hideColumnOptions}
      onSelectionChange={onSelectionChange}
      onBookmarkChange={onBookmarkChange}
      onRowClick={onRowClick}
      groupConfig={groupConfig}
      className={className}
      customColors={customColors}
    />
  );
}
