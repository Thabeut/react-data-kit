import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useMemo } from "react";
import type { ColumnsType } from "antd/es/table";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { datatableIconNames } from "../../../../constants/datatable-icons";
import { ActionsPopover } from "../../../../components/actions-popover";
import { ColumnResizeHandle } from "../../../../components/column-resize-handle";
import type {
  DataTableActionsConfig,
  DataTableColumnInfo,
  DataTableGroupConfig,
  DataTableSortState,
  InternalRow,
} from "../../../../types/data-table";
import { isGroupRow } from "../../../../utils/data-table";
import { saveColumnWidths } from "../../../../utils/data-table-column-widths";

interface UseDataTableColumnsParams<T extends { [key: string]: unknown }> {
  columnsInfo: DataTableColumnInfo<T>[];
  visibleColumnIds: string[];
  groupConfig: DataTableGroupConfig<T> | undefined;
  actions: DataTableActionsConfig<T> | undefined;
  columnResize: boolean;
  tableId: string;
  columnWidths: Record<string, number>;
  setColumnWidths: Dispatch<SetStateAction<Record<string, number>>>;
  resolvedSortState: DataTableSortState | null;
  handleSortChange: (columnId: string) => void;
  columnHeaderText: (column: DataTableColumnInfo<T>) => string;
}

export function useDataTableColumns<T extends { [key: string]: unknown }>(
  params: UseDataTableColumnsParams<T>,
): ColumnsType<InternalRow<T>> {
  const {
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
  } = params;

  return useMemo<ColumnsType<InternalRow<T>>>(() => {
    const baseColumns: DataTableColumnInfo<T>[] = columnsInfo.filter((column) =>
      visibleColumnIds.includes(column.id),
    );

    const groupAnchorColumnId =
      groupConfig && baseColumns.length > 0 ? baseColumns[0].id : null;

    const hasActions =
      !!actions &&
      (Boolean(actions.onPreview) ||
        Boolean(actions.onEdit) ||
        Boolean(actions.onDelete) ||
        Boolean(actions.customActions));

    const numericWidth = (column: DataTableColumnInfo<T>): number => {
      const w = columnWidths[column.id];
      if (w !== undefined) return w;
      const cw = column.width;
      if (typeof cw === "number") return cw;
      if (typeof cw === "string" && cw.endsWith("px")) {
        const n = Number.parseInt(cw, 10);
        if (Number.isFinite(n)) return n;
      }
      return 120;
    };

    const renderTh = (column: DataTableColumnInfo<T>) => {
      const showResize = columnResize;
      const isSortable = Boolean(column.sortable || column.sorter);
      const isSorted = resolvedSortState?.columnId === column.id;
      const sortOrder = isSorted ? resolvedSortState.order : null;
      const sortIcon =
        sortOrder === "ascend"
          ? datatableIconNames.ArrowUp
          : sortOrder === "descend"
            ? datatableIconNames.ArrowDown
            : datatableIconNames.ArrowUpDown;
      return (
        <div className="datatable-th-wrap">
          <span className="datatable-th">{columnHeaderText(column)}</span>
          {isSortable ? (
            <button
              type="button"
              className={clsx(
                "datatable-sort-trigger",
                isSorted && "datatable-sort-trigger--active",
              )}
              onClick={(e) => {
                e.stopPropagation();
                handleSortChange(column.id);
              }}
              aria-label={`Sort ${column.label}`}
            >
              <Icon icon={sortIcon} width={14} height={14} />
            </button>
          ) : null}
          {showResize ? (
            <ColumnResizeHandle
              onResize={(dx) => {
                setColumnWidths((prev) => {
                  const cur = prev[column.id] ?? numericWidth(column);
                  const next = Math.min(800, Math.max(80, cur + dx));
                  return { ...prev, [column.id]: next };
                });
              }}
              onResizeEnd={() => {
                setColumnWidths((prev) => {
                  saveColumnWidths(tableId, prev);
                  return prev;
                });
              }}
            />
          ) : null}
        </div>
      );
    };

    const mappedColumns = baseColumns.map((column) => {
      const typedColumn = column as DataTableColumnInfo<InternalRow<T>>;
      const mergedWidth = columnResize
        ? numericWidth(column)
        : typedColumn.width;

      if (column.id === groupAnchorColumnId) {
        return {
          ...typedColumn,
          width: mergedWidth,
          title: renderTh(column),
          onCell: (record: InternalRow<T>, index?: number) => {
            if (isGroupRow(record)) {
              return {
                className: "datatable-group-cell",
                colSpan: baseColumns.length + (hasActions ? 1 : 0),
              };
            }

            if (typedColumn.onCell) {
              return typedColumn.onCell(record, index);
            }

            return {
              className: clsx(
                "datatable-cell",
                column.minWidthClassName,
                column.maxWidthClassName,
              ),
            };
          },
          render: (value: unknown, record: InternalRow<T>, index?: number) => {
            if (isGroupRow(record)) {
              return (
                <div className="datatable-group-label">
                  {groupConfig?.groupIcon && (
                    <Icon
                      icon={groupConfig.groupIcon as string}
                      width={16}
                      height={16}
                      className="datatable-group-label-icon"
                    />
                  )}
                  <span className="datatable-group-label-text">
                    {record.__groupKey}
                  </span>
                </div>
              );
            }

            if (column.render) {
              return column.render(
                value as never,
                record as never,
                index ?? 0,
              ) as ReactNode;
            }

            return value;
          },
        };
      }

      return {
        ...typedColumn,
        width: mergedWidth,
        title: renderTh(column),
        onCell: (record: InternalRow<T>, index?: number) => {
          if (isGroupRow(record)) {
            return {
              colSpan: 0,
            };
          }

          if (typedColumn.onCell) {
            return typedColumn.onCell(record, index);
          }

          return {
            className: clsx(
              "datatable-cell",
              column.minWidthClassName,
              column.maxWidthClassName,
            ),
          };
        },
      };
    });

    if (hasActions && actions) {
      mappedColumns.push({
        id: "__actions",
        label: "",
        title: <></>,
        key: "__actions",
        width: 80,
        onCell: (record: InternalRow<T>) => {
          if (isGroupRow(record)) {
            return {
              colSpan: 0,
            };
          }
          return {
            className: "datatable-cell datatable-actions-cell",
          };
        },
        render: (_value: unknown, record: InternalRow<T>): ReactNode => {
          if (isGroupRow(record)) {
            return null;
          }
          if (actions.canShowActions && !actions.canShowActions(record as T)) {
            return null;
          }
          const customActions =
            typeof actions.customActions === "function"
              ? actions.customActions(record as T)
              : actions.customActions;

          return (
            <ActionsPopover
              record={record as T}
              onPreview={
                actions.canPreview && !actions.canPreview(record as T)
                  ? undefined
                  : actions.onPreview
              }
              onEdit={
                actions.canEdit && !actions.canEdit(record as T)
                  ? undefined
                  : actions.onEdit
              }
              onDelete={
                actions.canDelete && !actions.canDelete(record as T)
                  ? undefined
                  : actions.onDelete
              }
              deleteModalConfig={actions.deleteModalConfig}
              customActions={customActions}
            />
          );
        },
      });
    }

    return mappedColumns as unknown as ColumnsType<InternalRow<T>>;
  }, [
    columnsInfo,
    actions,
    visibleColumnIds,
    groupConfig,
    columnResize,
    tableId,
    columnWidths,
    resolvedSortState,
    handleSortChange,
    columnHeaderText,
    setColumnWidths,
  ]);
}
