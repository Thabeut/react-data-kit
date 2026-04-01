import "./actions-popover.scss";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Popover } from "antd";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { datatableIconNames } from "../../constants/datatable-icons";
import { RDK_I18N_DEFAULT_TEXT } from "../../constants/rdk-i18n-keys";
import { Button } from "../button";
import { DeleteModal } from "../delete-modal";
import type { ActionItem, DeleteModalConfig } from "../../types/data-table";

export interface ActionsPopoverProps<T = unknown> {
  record: T;

  onPreview?: (record: T) => void;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void | Promise<void>;
  deleteModalConfig?: DeleteModalConfig;
  customActions?: ActionItem<T>[] | ((record: T) => ActionItem<T>[]);
  themeClassName?: string;
}

export function ActionsPopover<T extends object>({
  record,
  onPreview,
  onEdit,
  onDelete,
  deleteModalConfig,
  customActions,
  themeClassName,
}: ActionsPopoverProps<T>) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<T | null>(null);

  const resolvedCustom =
    typeof customActions === "function" ? customActions(record) : customActions;

  const handleDeleteClick = (row: T) => {
    if (onDelete && deleteModalConfig) {
      setRecordToDelete(row);
      setOpen(false);
    } else if (onDelete) {
      void onDelete(row);
      setOpen(false);
    }
  };

  const actions: ActionItem<T>[] = [];

  if (onPreview) {
    actions.push({
      key: "preview",
      label: t("actionPreview", {
        defaultValue: RDK_I18N_DEFAULT_TEXT.actionPreview,
      }),
      icon: datatableIconNames.Eye,
      onClick: (r) => onPreview!(r),
    });
  }

  if (onEdit) {
    actions.push({
      key: "edit",
      label: t("actionEdit", {
        defaultValue: RDK_I18N_DEFAULT_TEXT.actionEdit,
      }),
      icon: datatableIconNames.Edit,
      onClick: (r) => onEdit!(r),
    });
  }

  if (onDelete) {
    actions.push({
      key: "delete",
      label: t("actionDelete", {
        defaultValue: RDK_I18N_DEFAULT_TEXT.actionDelete,
      }),
      icon: datatableIconNames.Trash2,
      onClick: handleDeleteClick,
      danger: true,
    });
  }

  if (resolvedCustom && resolvedCustom.length > 0) {
    actions.push(...resolvedCustom);
  }

  if (actions.length === 0) {
    return null;
  }

  const content = (
    <div className="ui-actions-popover__list">
      {actions.map((action) => (
        <Button
          unstyled
          key={action.key}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            action.onClick(record);
            setOpen(false);
          }}
          className={
            action.danger
              ? "ui-actions-popover__item ui-actions-popover__item--danger"
              : "ui-actions-popover__item"
          }
        >
          {action.icon ? (
            <Icon icon={action.icon} width={18} height={18} />
          ) : null}
          {action.label}
        </Button>
      ))}
    </div>
  );

  return (
    <>
      <Popover
        open={open}
        onOpenChange={setOpen}
        content={content}
        trigger="click"
        placement="bottomRight"
        arrow={false}
        rootClassName={clsx(
          "rdk-theme-scope ui-actions-popover",
          themeClassName,
        )}
      >
        <Button
          unstyled
          type="button"
          className="ui-actions-popover__trigger"
          aria-label={t("actions", {
            defaultValue: RDK_I18N_DEFAULT_TEXT.actions,
          })}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Icon icon={datatableIconNames.MoreVertical} width={16} height={16} />
        </Button>
      </Popover>
      {onDelete && deleteModalConfig ? (
        <DeleteModal
          open={Boolean(recordToDelete)}
          onClose={() => setRecordToDelete(null)}
          title={deleteModalConfig.title}
          description={deleteModalConfig.description}
          confirmLabel={deleteModalConfig.confirmLabel}
          cancelLabel={deleteModalConfig.cancelLabel}
          onConfirm={async () => {
            if (recordToDelete) {
              await onDelete(recordToDelete);
              setRecordToDelete(null);
            }
          }}
          isLoading={deleteModalConfig.isLoading}
          rootClassName={themeClassName}
        />
      ) : null}
    </>
  );
}

export default ActionsPopover;
