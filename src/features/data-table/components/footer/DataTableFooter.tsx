import type { ReactNode } from "react";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { datatableIconNames } from "../../../../constants/datatable-icons";
import { Button } from "../../../../components/button";
import { Select } from "../../../../components/select";

export interface DataTableFooterProps {
  showSelectionSummary: boolean;
  totalSelectedLabel: ReactNode;
  rowsPerPageLabel: string;
  pageSize: number;
  pageSizeOptions: number[];
  onPageSizeChange: (value: number) => void;
  pageInfoLabel: string;
  isRTL: boolean;
  onGoFirst: () => void;
  onGoPrev: () => void;
  onGoNext: () => void;
  onGoLast: () => void;
  disablePrev: boolean;
  disableNext: boolean;
  themeClassName?: string;
}

export function DataTableFooter(props: DataTableFooterProps) {
  const {
    showSelectionSummary,
    totalSelectedLabel,
    rowsPerPageLabel,
    pageSize,
    pageSizeOptions,
    onPageSizeChange,
    pageInfoLabel,
    isRTL,
    onGoFirst,
    onGoPrev,
    onGoNext,
    onGoLast,
    disablePrev,
    disableNext,
    themeClassName,
  } = props;

  return (
    <div className="datatable-footer">
      <div className="datatable-footer-left">
        {showSelectionSummary ? totalSelectedLabel : null}
      </div>
      <div className="datatable-footer-right">
        <div className="datatable-footer-rows-per-page">
          <span className="datatable-footer-rows-per-page-label">
            {rowsPerPageLabel}
          </span>
          <Select<number>
            className="datatable-page-size-select"
            popupClassName={themeClassName}
            value={pageSize}
            onChange={(v) => onPageSizeChange(Number(v))}
            options={pageSizeOptions.map((value) => ({
              label: String(value),
              value,
            }))}
          />
        </div>
        <div className="datatable-footer-page-info">{pageInfoLabel}</div>
        <div className="datatable-footer-nav">
          <Button type="button" disabled={disablePrev} onClick={onGoFirst}>
            <Icon
              icon={datatableIconNames.ChevronsLeft}
              width={16}
              height={16}
              className={clsx({
                "datatable-icon-rtl": isRTL,
              })}
            />
          </Button>
          <Button type="button" disabled={disablePrev} onClick={onGoPrev}>
            <Icon
              icon={datatableIconNames.ChevronLeft}
              width={16}
              height={16}
              className={clsx({
                "datatable-icon-rtl": isRTL,
              })}
            />
          </Button>
          <Button type="button" disabled={disableNext} onClick={onGoNext}>
            <Icon
              icon={datatableIconNames.ChevronRight}
              width={16}
              height={16}
              className={clsx({
                "datatable-icon-rtl": isRTL,
              })}
            />
          </Button>
          <Button type="button" disabled={disableNext} onClick={onGoLast}>
            <Icon
              icon={datatableIconNames.ChevronsRight}
              width={16}
              height={16}
              className={clsx({
                "datatable-icon-rtl": isRTL,
              })}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
