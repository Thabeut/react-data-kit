import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import { Table } from "antd";
import clsx from "clsx";
import type { InternalRow } from "../../../../types/data-table";
import { isGroupRow } from "../../../../utils/data-table";

export interface DataTableTableSectionProps<T extends object> {
  maxTableHeight?: string;
  columns: ColumnsType<InternalRow<T>>;
  displayData: InternalRow<T>[];
  loading?: boolean;
  rowSelection: TableRowSelection<InternalRow<T>> | undefined;
  disableSelectionAndBookmark?: boolean;
  onRowClick?: (row: T) => void;
  internalRowKey: (record: InternalRow<T>) => string | number;
}

export function DataTableTableSection<T extends object>(
  props: DataTableTableSectionProps<T>,
) {
  const {
    maxTableHeight,
    columns,
    displayData,
    loading,
    rowSelection,
    disableSelectionAndBookmark,
    onRowClick,
    internalRowKey,
  } = props;

  return (
    <div
      className={clsx(
        "datatable-table-scroll",
        maxTableHeight && "datatable-table-scroll--max",
      )}
      style={
        maxTableHeight
          ? { maxHeight: maxTableHeight, overflow: "auto" }
          : undefined
      }
    >
      <Table<InternalRow<T>>
        rowKey={internalRowKey}
        columns={columns}
        dataSource={displayData}
        loading={loading}
        pagination={false}
        scroll={{ x: "max-content" }}
        rowSelection={disableSelectionAndBookmark ? undefined : rowSelection}
        rowClassName={(record) =>
          clsx({
            "datatable-group-row": isGroupRow(record),
            "datatable-row-clickable": Boolean(onRowClick),
          })
        }
        className="datatable-table"
        onRow={(record) => ({
          onClick: (e) => {
            e.stopPropagation();
            if (!isGroupRow(record)) {
              onRowClick?.(record as T);
            }
          },
        })}
      />
    </div>
  );
}
