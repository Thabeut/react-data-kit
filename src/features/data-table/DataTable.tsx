import { useCallback, useEffect, useMemo, useState } from "react";
import type { Key } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "antd";
import type { TableRowSelection } from "antd/es/table/interface";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { useDataTableColumns } from "./hooks/use-data-table-columns";
import { datatableIconNames } from "../../constants/datatable-icons";
import { Button } from "../../components/button";
import { DateFilterPopover } from "../../components/date-filter-popover";
import type { IDateFilterValue } from "../../components/date-filter-popover";
import { MultiFilterPopover } from "../../components/multi-filter-popover";
import { MultiFilterWithQuery } from "../../components/multi-filter-with-query";
import { DataTableFooter } from "./components/footer";
import { DataTableTableSection } from "./components/table-section";
import { DataTableToolbar } from "./components/toolbar";
import type {
  DataTableColumnInfo,
  DataTableFilterConfig,
  DataTableKey,
  DataTableProps,
  DataTableSortState,
  InternalRow,
} from "../../types/data-table";

import {
  BASE_ROW_KEY,
  buildGroupedData,
  isGroupRow,
  sliceGroupedDataForPage,
} from "../../utils/data-table";
import {
  loadColumnWidths,
  saveColumnWidths,
} from "../../utils/data-table-column-widths";
import { RDK_I18N_DEFAULT_TEXT } from "../../constants/rdk-i18n-keys";
import "./data-table.scss";

export function DataTable<T extends { [key: string]: unknown }>(
  props: DataTableProps<T>,
) {
  const {
    tableId,
    rowKey,
    columnsInfo,
    dataSource,
    pagination,
    className,
    serverMode = false,
    customColors,
    columnResize = false,
    filters,
    filterValues = {},
    onFilterChange,
    groupConfig,
    loading,
    paginationState,
    onFiltersChange,
    onVisibleColumnsChange,
    onPageChange,
    sortState,
    onSortChange,
    onRefresh,
    renderToolbarRight,
    renderToolbarLeft,
    searchValue,
    onSearch,
    searchPlaceholder,
    onSelectionChange,
    onBookmarkChange,
    onRowClick,
    actions,
    disableSelectionAndBookmark,
    hideColumnOptions,
    maxTableHeight,
  } = props;

  const shouldConstrainByHeight = Boolean(maxTableHeight);
  const { t, i18n } = useTranslation();
  const resolvedDirection = useMemo<"ltr" | "rtl">(() => {
    const i18nDir = typeof i18n?.dir === "function" ? i18n.dir() : null;
    if (i18nDir === "rtl") return "rtl";
    if (
      typeof document !== "undefined" &&
      document.documentElement.dir === "rtl"
    ) {
      return "rtl";
    }
    return "ltr";
  }, [i18n]);
  const isRTL = resolvedDirection === "rtl";

  const isServer = Boolean(serverMode);
  const clientPaginate = !isServer;

  useEffect(() => {
    if (!customColors || typeof document === "undefined") return;
    const root = document.documentElement;
    const vars: Record<string, string | undefined> = {
      "--rdk-primary": customColors.primaryColor,
      "--rdk-light-surface-bg": customColors.lightMode?.surfaceBg,
      "--rdk-light-popover-bg": customColors.lightMode?.popoverBg,
      "--rdk-light-popover-option-hover":
        customColors.lightMode?.popoverOptionHoverBg,
      "--rdk-light-surface-border": customColors.lightMode?.surfaceBorder,
      "--rdk-light-text-primary": customColors.lightMode?.textPrimary,
      "--rdk-light-row-hover": customColors.lightMode?.rowHoverBg,
      "--rdk-light-row-selected": customColors.lightMode?.rowSelectedBg,
      "--rdk-light-group-row": customColors.lightMode?.groupRowBg,
      "--rdk-dark-surface-bg": customColors.darkMode?.surfaceBg,
      "--rdk-dark-popover-bg": customColors.darkMode?.popoverBg,
      "--rdk-dark-popover-option-hover":
        customColors.darkMode?.popoverOptionHoverBg,
      "--rdk-dark-surface-border": customColors.darkMode?.surfaceBorder,
      "--rdk-dark-text-primary": customColors.darkMode?.textPrimary,
      "--rdk-dark-row-hover": customColors.darkMode?.rowHoverBg,
      "--rdk-dark-row-selected": customColors.darkMode?.rowSelectedBg,
      "--rdk-dark-group-row": customColors.darkMode?.groupRowBg,
    };

    const previous = new Map<string, string>();
    Object.entries(vars).forEach(([key, value]) => {
      if (!value) return;
      previous.set(key, root.style.getPropertyValue(key));
      root.style.setProperty(key, value);
    });

    return () => {
      previous.forEach((value, key) => {
        if (value) root.style.setProperty(key, value);
        else root.style.removeProperty(key);
      });
    };
  }, [customColors]);
  const columnHeaderText = (column: DataTableColumnInfo<T>) => column.label;

  const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>(() =>
    columnsInfo
      .filter((info) => info.defaultVisible !== false)
      .map((info) => info.id),
  );
  const [activeFilterIds, setActiveFilterIds] = useState<string[]>([]);
  const [openFilterId, setOpenFilterId] = useState<string | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<DataTableKey[]>([]);
  const [bookmarkedRowKeys, setBookmarkedRowKeys] = useState<DataTableKey[]>(
    [],
  );
  const controlledPagination = Boolean(paginationState);
  const [pageInternal, setPageInternal] = useState(1);
  const [pageSizeInternal, setPageSizeInternal] = useState(
    pagination.defaultPageSize,
  );
  const [searchInternal, setSearchInternal] = useState("");
  const [filterValuesInternal, setFilterValuesInternal] = useState<
    Record<string, unknown>
  >({});
  const controlledSort = sortState !== undefined;
  const [sortInternal, setSortInternal] = useState<DataTableSortState | null>(
    null,
  );
  const resolvedSortState = controlledSort ? (sortState ?? null) : sortInternal;
  const currentPage = paginationState?.page ?? pageInternal;
  const pageSize = paginationState?.pageSize ?? pageSizeInternal;
  const useInternalSearch = !isServer && !onSearch;
  const useInternalFilters = !isServer && !onFilterChange;
  const resolvedSearchValue = useInternalSearch
    ? searchInternal
    : (searchValue ?? "");
  const resolvedFilterValues = useInternalFilters
    ? filterValuesInternal
    : filterValues;

  const readByPath = useCallback(
    (row: T, path: DataTableColumnInfo<T>["dataIndex"]): unknown => {
      if (typeof path === "string" || typeof path === "number") {
        return row[path as keyof T];
      }
      if (Array.isArray(path)) {
        return path.reduce<unknown>((acc, key) => {
          if (acc && typeof acc === "object") {
            return (acc as Record<string, unknown>)[String(key)];
          }
          return undefined;
        }, row);
      }
      return undefined;
    },
    [],
  );

  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
    () => (columnResize ? loadColumnWidths(tableId) : {}),
  );

  useEffect(() => {
    if (!columnResize) return;
    saveColumnWidths(tableId, columnWidths);
  }, [tableId, columnResize, columnWidths]);

  useEffect(() => {
    const ids = new Set(columnsInfo.map((c) => c.id));
    setVisibleColumnIds((prev) => {
      const next = prev.filter((id) => ids.has(id));
      for (const col of columnsInfo) {
        if (col.defaultVisible !== false && !next.includes(col.id)) {
          next.push(col.id);
        }
      }
      return next;
    });
  }, [columnsInfo]);

  const handleFilterToggle = (id: string) => {
    const exists = activeFilterIds.includes(id);
    const next = exists
      ? activeFilterIds.filter((value) => value !== id)
      : [...activeFilterIds, id];
    setActiveFilterIds(next);
    onFiltersChange?.(next);
  };

  const isFilterActive = (filter: DataTableFilterConfig): boolean => {
    const v = resolvedFilterValues[filter.id];
    if (v == null) return false;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "object" && v !== null && "date_from" in v) return true;
    return Boolean(v);
  };

  const setFilterValue = useCallback(
    (filterId: string, value: unknown) => {
      if (useInternalFilters) {
        setFilterValuesInternal((prev) => ({ ...prev, [filterId]: value }));
      }
      onFilterChange?.(filterId, value);
    },
    [useInternalFilters, onFilterChange],
  );

  const renderFilterContent = (filter: DataTableFilterConfig) => {
    const type = filter.type ?? "multi";
    const value = resolvedFilterValues[filter.id];

    if (type === "date" && filter.dateOptions) {
      return (
        <DateFilterPopover
          options={filter.dateOptions}
          value={(value as IDateFilterValue) ?? null}
          onChange={(next) => {
            setFilterValue(filter.id, next);
            setOpenFilterId(null);
          }}
          onClose={() => setOpenFilterId(null)}
          isOpen={openFilterId === filter.id}
        />
      );
    }

    if (type === "multi" || type === "single") {
      const arr = Array.isArray(value)
        ? value
        : value != null
          ? [value as string | number]
          : [];
      if (filter.loadOptions) {
        return (
          <MultiFilterWithQuery
            loadOptions={filter.loadOptions}
            value={arr as (string | number)[]}
            onChange={(next) => setFilterValue(filter.id, next)}
            single={type === "single"}
            searchPlaceholder={filter.searchPlaceholder}
            renderFilterOption={filter.renderFilterOption}
          />
        );
      }
      if (filter.options) {
        return (
          <MultiFilterPopover
            options={filter.options}
            value={arr as (string | number)[]}
            onChange={(next) => setFilterValue(filter.id, next)}
            single={type === "single"}
            searchPlaceholder={filter.searchPlaceholder}
            renderFilterOption={filter.renderFilterOption}
          />
        );
      }
    }

    return null;
  };

  const handleColumnToggle = (id: string) => {
    const exists = visibleColumnIds.includes(id);
    const next = exists
      ? visibleColumnIds.filter((value) => value !== id)
      : [...visibleColumnIds, id];
    setVisibleColumnIds(next);
    onVisibleColumnsChange?.(next);
  };

  const handleSortChange = useCallback(
    (columnId: string) => {
      const next: DataTableSortState | null =
        resolvedSortState?.columnId !== columnId
          ? { columnId, order: "ascend" }
          : resolvedSortState.order === "ascend"
            ? { columnId, order: "descend" }
            : null;

      if (!controlledSort) {
        setSortInternal(next);
      }
      onSortChange?.(next);
    },
    [controlledSort, onSortChange, resolvedSortState],
  );

  const handleSelectionChange = useCallback(
    (keys: Key[], rows: InternalRow<T>[]) => {
      const castKeys = keys as DataTableKey[];
      setSelectedRowKeys(castKeys);
      onSelectionChange?.(
        castKeys,
        rows.map((row) => row as T),
      );
    },
    [onSelectionChange],
  );

  const handleRefresh = useCallback(() => {
    onRefresh?.();
  }, [onRefresh]);

  const visibleColumns = useDataTableColumns<T>({
    columnsInfo,
    visibleColumnIds,
    groupConfig,
    actions,
    columnResize,
    tableId,
    columnWidths,
    setColumnWidths,
    resolvedSortState,
    handleSortChange,
    columnHeaderText,
  });

  const filteredClientRows = useMemo(() => {
    if (isServer) return dataSource;

    let rows = dataSource;
    const needle = resolvedSearchValue.trim().toLowerCase();
    if (needle) {
      rows = rows.filter((row) =>
        columnsInfo.some((column) => {
          const raw = readByPath(row, column.dataIndex);
          return String(raw ?? "")
            .toLowerCase()
            .includes(needle);
        }),
      );
    }

    if (filters?.length) {
      for (const filter of filters) {
        const value = resolvedFilterValues[filter.id];
        if (value == null) continue;

        if (filter.type === "date") {
          const dateValue = value as IDateFilterValue | null;
          if (!dateValue?.date_from || !dateValue?.date_to) continue;
          const from = new Date(dateValue.date_from).getTime();
          const to = new Date(dateValue.date_to).getTime();
          rows = rows.filter((row) => {
            const raw = row[filter.id as keyof T];
            const ts = new Date(String(raw ?? "")).getTime();
            return Number.isFinite(ts) && ts >= from && ts <= to;
          });
          continue;
        }

        const selected = Array.isArray(value)
          ? value
          : value != null
            ? [value as string | number]
            : [];
        if (!selected.length) continue;
        rows = rows.filter((row) =>
          selected.includes(row[filter.id as keyof T] as string | number),
        );
      }
    }

    if (resolvedSortState) {
      const sortColumn = columnsInfo.find(
        (column) => column.id === resolvedSortState.columnId,
      );
      if (sortColumn) {
        const orderFactor = resolvedSortState.order === "ascend" ? 1 : -1;
        const sorter = sortColumn.sorter;

        rows = [...rows].sort((a, b) => {
          let base = 0;

          if (typeof sorter === "function") {
            base = sorter(
              a as InternalRow<T>,
              b as InternalRow<T>,
              resolvedSortState.order,
            );
          } else if (sorter && typeof sorter === "object" && sorter.compare) {
            base = sorter.compare(
              a as InternalRow<T>,
              b as InternalRow<T>,
              resolvedSortState.order,
            );
          } else {
            const av = readByPath(a, sortColumn.dataIndex);
            const bv = readByPath(b, sortColumn.dataIndex);

            if (typeof av === "number" && typeof bv === "number") {
              base = av - bv;
            } else {
              base = String(av ?? "").localeCompare(
                String(bv ?? ""),
                undefined,
                {
                  numeric: true,
                  sensitivity: "base",
                },
              );
            }
          }

          return orderFactor * (base || 0);
        });
      }
    }

    return rows;
  }, [
    isServer,
    dataSource,
    resolvedSearchValue,
    columnsInfo,
    filters,
    resolvedFilterValues,
    resolvedSortState,
    readByPath,
  ]);

  const internalData: InternalRow<T>[] = useMemo(() => {
    if (!groupConfig) {
      return filteredClientRows;
    }

    const result = buildGroupedData(
      filteredClientRows,
      groupConfig.getGroupLabel,
      groupConfig.order,
    );
    return result.groupedData;
  }, [filteredClientRows, groupConfig]);

  const displayData: InternalRow<T>[] = useMemo(() => {
    if (isServer) {
      return internalData;
    }
    if (!groupConfig) {
      const start = (currentPage - 1) * pageSize;
      return internalData.slice(start, start + pageSize);
    }
    return sliceGroupedDataForPage(internalData, currentPage, pageSize);
  }, [internalData, isServer, groupConfig, currentPage, pageSize]);

  const internalRowKey = useCallback(
    (record: InternalRow<T>) => {
      if (isGroupRow(record)) {
        return `${BASE_ROW_KEY}${record.__groupKey}`;
      }

      const resolved =
        typeof rowKey === "function"
          ? rowKey(record as T)
          : (record as T)[rowKey as keyof T];

      return resolved as DataTableKey;
    },
    [rowKey],
  );

  const scopeRowKeys = useMemo(() => {
    if (isServer) {
      return internalData
        .filter((row) => !isGroupRow(row))
        .map((row) => internalRowKey(row)) as DataTableKey[];
    }
    return displayData
      .filter((row) => !isGroupRow(row))
      .map((row) => internalRowKey(row)) as DataTableKey[];
  }, [isServer, internalData, displayData, internalRowKey]);

  const pageAllSelected =
    scopeRowKeys.length > 0 &&
    scopeRowKeys.every((key) => selectedRowKeys.includes(key));

  const scopeAllBookmarked =
    scopeRowKeys.length > 0 &&
    scopeRowKeys.every((key) => bookmarkedRowKeys.includes(key));

  const handleBookmarkAll = useCallback(() => {
    const allMarked = scopeRowKeys.every((key) =>
      bookmarkedRowKeys.includes(key),
    );

    if (allMarked) {
      const newBookmarked = bookmarkedRowKeys.filter(
        (key) => !scopeRowKeys.includes(key),
      );
      setBookmarkedRowKeys(newBookmarked);
      if (onBookmarkChange) {
        const bookmarkedRows = internalData
          .filter(
            (row) =>
              !isGroupRow(row) && newBookmarked.includes(internalRowKey(row)),
          )
          .map((row) => row as T);
        onBookmarkChange(newBookmarked, bookmarkedRows);
      }
    } else {
      const newBookmarked = [
        ...new Set([...bookmarkedRowKeys, ...scopeRowKeys]),
      ];
      setBookmarkedRowKeys(newBookmarked);
      if (onBookmarkChange) {
        const bookmarkedRows = internalData
          .filter((row) => !isGroupRow(row))
          .map((row) => row as T);
        onBookmarkChange(newBookmarked, bookmarkedRows);
      }
    }
  }, [
    scopeRowKeys,
    bookmarkedRowKeys,
    internalData,
    internalRowKey,
    onBookmarkChange,
  ]);

  const rowsMatchingKeys = useCallback(
    (keys: DataTableKey[]) =>
      internalData
        .filter((row) => !isGroupRow(row) && keys.includes(internalRowKey(row)))
        .map((row) => row as T),
    [internalData, internalRowKey],
  );

  const pageSomeSelected =
    scopeRowKeys.some((key) => selectedRowKeys.includes(key)) &&
    !pageAllSelected;
  const canBookmark = Boolean(onBookmarkChange);
  const canRefresh = Boolean(onRefresh);

  const handleBookmarkRow = useCallback(
    (rk: DataTableKey) => {
      const isBookmarked = bookmarkedRowKeys.includes(rk);
      const newBookmarked = isBookmarked
        ? bookmarkedRowKeys.filter((key) => key !== rk)
        : [...bookmarkedRowKeys, rk];

      setBookmarkedRowKeys(newBookmarked);
      if (onBookmarkChange) {
        const bookmarkedRows = internalData
          .filter(
            (row) =>
              !isGroupRow(row) && newBookmarked.includes(internalRowKey(row)),
          )
          .map((row) => row as T);
        onBookmarkChange(newBookmarked, bookmarkedRows);
      }
    },
    [bookmarkedRowKeys, internalData, internalRowKey, onBookmarkChange],
  );

  const rowSelection: TableRowSelection<InternalRow<T>> = useMemo(
    () => ({
      preserveSelectedRowKeys: true,
      selectedRowKeys,
      onChange: handleSelectionChange,
      getCheckboxProps: (record) =>
        isGroupRow(record)
          ? {
              disabled: true,
              className: "datatable-selection-checkbox-group",
            }
          : {},
      renderCell: (_, record, _rowIndex, node) => {
        if (isGroupRow(record)) {
          return null;
        }
        const rk = internalRowKey(record);
        const isBookmarked = bookmarkedRowKeys.includes(rk);

        return (
          <div className="datatable-selection-cell">
            {node}
            {canBookmark ? (
              <Button
                unstyled
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookmarkRow(rk);
                }}
                className={clsx(
                  "datatable-bookmark-button",
                  isBookmarked && "datatable-bookmark-button-active",
                )}
                aria-label={t("bookmark", {
                  defaultValue: RDK_I18N_DEFAULT_TEXT.bookmark,
                })}
              >
                <Icon
                  icon={
                    isBookmarked
                      ? datatableIconNames.StarFilled
                      : datatableIconNames.Star
                  }
                  width={20}
                  height={20}
                />
              </Button>
            ) : null}
          </div>
        );
      },
      columnTitle: (
        <div className="datatable-selection-header">
          <Checkbox
            checked={pageAllSelected}
            indeterminate={pageSomeSelected}
            onChange={(e) => {
              if (e.target.checked) {
                const newKeys = [
                  ...new Set([...selectedRowKeys, ...scopeRowKeys]),
                ];
                handleSelectionChange(newKeys, rowsMatchingKeys(newKeys));
              } else {
                const newKeys = selectedRowKeys.filter(
                  (k) => !scopeRowKeys.includes(k),
                );
                handleSelectionChange(newKeys, rowsMatchingKeys(newKeys));
              }
            }}
          />
          {canBookmark ? (
            <Button
              unstyled
              type="button"
              onClick={handleBookmarkAll}
              className={clsx(
                "datatable-bookmark-all-button",
                scopeAllBookmarked && "datatable-bookmark-all-button-active",
              )}
              aria-label={t("bookmarkAll", {
                defaultValue: RDK_I18N_DEFAULT_TEXT.bookmarkAll,
              })}
            >
              <Icon
                icon={
                  scopeAllBookmarked
                    ? datatableIconNames.StarFilled
                    : datatableIconNames.Star
                }
                width={20}
                height={20}
              />
            </Button>
          ) : null}
          {canRefresh ? (
            <Button
              unstyled
              type="button"
              onClick={handleRefresh}
              className="datatable-refresh-button"
              aria-label={t("refresh", {
                defaultValue: RDK_I18N_DEFAULT_TEXT.refresh,
              })}
            >
              <Icon
                icon={datatableIconNames.RefreshCw}
                width={20}
                height={20}
              />
            </Button>
          ) : null}
        </div>
      ),
    }),
    [
      selectedRowKeys,
      handleSelectionChange,
      scopeRowKeys,
      pageAllSelected,
      pageSomeSelected,
      canBookmark,
      canRefresh,
      scopeAllBookmarked,
      internalData,
      bookmarkedRowKeys,
      rowsMatchingKeys,
      handleBookmarkRow,
      handleBookmarkAll,
      handleRefresh,
      t,
    ],
  );

  const totalItemsForFooter = useMemo(() => {
    if (clientPaginate) {
      return internalData.filter((row) => !isGroupRow(row)).length;
    }
    return pagination.totalItems ?? 0;
  }, [clientPaginate, internalData, pagination.totalItems]);

  const totalPages = useMemo(() => {
    if (clientPaginate) {
      const n = internalData.filter((row) => !isGroupRow(row)).length;
      if (n === 0) return 1;
      return Math.max(1, Math.ceil(n / (pageSize || 1)));
    }
    const total = pagination.totalItems ?? 0;
    if (total === 0) return 1;
    return Math.max(1, Math.ceil(total / (pageSize || 1)));
  }, [clientPaginate, internalData, pagination.totalItems, pageSize]);

  useEffect(() => {
    if (!clientPaginate || controlledPagination) return;
    const n = internalData.filter((row) => !isGroupRow(row)).length;
    const tp = n === 0 ? 1 : Math.max(1, Math.ceil(n / (pageSize || 1)));
    if (currentPage > tp) {
      setPageInternal(tp);
      onPageChange?.(tp, pageSize);
    }
  }, [
    clientPaginate,
    controlledPagination,
    internalData,
    pageSize,
    currentPage,
    onPageChange,
  ]);

  const totalSelected =
    selectedRowKeys.length === 0
      ? t("datatableSelectedRowsNone", {
          defaultValue: RDK_I18N_DEFAULT_TEXT.datatableSelectedRowsNone,
          total: totalItemsForFooter,
        })
      : t("datatableSelectedRowsSome", {
          defaultValue: RDK_I18N_DEFAULT_TEXT.datatableSelectedRowsSome,
          selected: selectedRowKeys.length,
          total: totalItemsForFooter,
        });

  const handlePageSizeChange = (value: number) => {
    if (controlledPagination) {
      onPageChange?.(1, value);
    } else {
      setPageSizeInternal(value);
      setPageInternal(1);
      onPageChange?.(1, value);
    }
  };

  const goToPage = (page: number) => {
    const bounded = Math.min(Math.max(page, 1), totalPages);
    if (bounded === currentPage) return;
    if (controlledPagination) {
      onPageChange?.(bounded, pageSize);
    } else {
      setPageInternal(bounded);
      onPageChange?.(bounded, pageSize);
    }
  };

  return (
    <div
      className={clsx(
        className,
        "rdk-theme-scope",
        "datatable-root",
        shouldConstrainByHeight && "datatable-root--fill",
      )}
    >
      <DataTableToolbar<T>
        showSearch={Boolean(!isServer || onSearch || searchValue !== undefined)}
        resolvedSearchValue={resolvedSearchValue}
        useInternalSearch={useInternalSearch}
        setSearchInternal={setSearchInternal}
        onSearch={onSearch}
        inputPlaceholder={
          searchPlaceholder ??
          t("searchByName", {
            defaultValue: RDK_I18N_DEFAULT_TEXT.searchByName,
          })
        }
        renderToolbarLeft={renderToolbarLeft}
        filters={filters}
        renderFilterContent={renderFilterContent}
        handleFilterToggle={handleFilterToggle}
        isFilterActive={isFilterActive}
        activeFilterIds={activeFilterIds}
        openFilterId={openFilterId}
        setOpenFilterId={setOpenFilterId}
        renderToolbarRight={renderToolbarRight}
        hideColumnOptions={hideColumnOptions}
        columnsInfo={columnsInfo}
        visibleColumnIds={visibleColumnIds}
        handleColumnToggle={handleColumnToggle}
        toggleColumnsTitle={t("toggleColumns", {
          defaultValue: RDK_I18N_DEFAULT_TEXT.toggleColumns,
        })}
      />

      <div
        className={clsx(
          "datatable-table-wrapper",
          shouldConstrainByHeight && "datatable-table-wrapper--flex",
        )}
      >
        <DataTableTableSection<T>
          maxTableHeight={maxTableHeight}
          columns={visibleColumns}
          displayData={displayData}
          loading={loading}
          rowSelection={rowSelection}
          disableSelectionAndBookmark={disableSelectionAndBookmark}
          onRowClick={onRowClick}
          internalRowKey={internalRowKey}
        />

        <DataTableFooter
          showSelectionSummary={!disableSelectionAndBookmark}
          totalSelectedLabel={totalSelected}
          rowsPerPageLabel={t("rowsPerPage", {
            defaultValue: RDK_I18N_DEFAULT_TEXT.rowsPerPage,
          })}
          pageSize={pageSize}
          pageSizeOptions={pagination.pageSizeOptions}
          onPageSizeChange={handlePageSizeChange}
          pageInfoLabel={t("datatablePageOf", {
            defaultValue: RDK_I18N_DEFAULT_TEXT.datatablePageOf,
            page: currentPage,
            totalPages,
          })}
          isRTL={isRTL}
          onGoFirst={() => goToPage(1)}
          onGoPrev={() => goToPage(currentPage - 1)}
          onGoNext={() => goToPage(currentPage + 1)}
          onGoLast={() => goToPage(totalPages)}
          disablePrev={currentPage === 1}
          disableNext={currentPage === totalPages}
        />
      </div>
    </div>
  );
}
