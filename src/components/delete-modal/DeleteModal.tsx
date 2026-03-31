import "./delete-modal.scss";
import { Modal } from "antd";
import { Icon } from "@iconify/react";
import { datatableIconNames } from "../../constants/datatable-icons";
import { Button } from "../button";

export interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void | Promise<void>;

  cancelLabel?: string;
  isLoading?: boolean;
}

export function DeleteModal({
  open,
  onClose,
  title,
  description,
  confirmLabel,
  onConfirm,
  cancelLabel = "Cancel",
  isLoading = false,
}: DeleteModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Modal
      open={open}
      title={null}
      footer={null}
      width={400}
      closable
      centered
      destroyOnHidden
      className="ui-delete-modal"
      maskStyle={{ background: "transparent" }}
      onCancel={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClose();
      }}
    >
      <div className="ui-delete-modal__inner">
        <div className="ui-delete-modal__hero">
          <div className="ui-delete-modal__icon-wrap" aria-hidden>
            <Icon
              icon={datatableIconNames.Trash2}
              width={24}
              height={24}
              className="ui-delete-modal__icon"
            />
          </div>
          <div className="ui-delete-modal__text">
            <h3 className="ui-delete-modal__title">{title}</h3>
            <p className="ui-delete-modal__description">{description}</p>
          </div>
        </div>
        <div className="ui-delete-modal__actions">
          <Button
            size="md"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onClose();
            }}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="outlined"
            size="md"
            type="button"
            className="ui-delete-modal__confirm"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              void handleConfirm();
            }}
            disabled={isLoading}
            loading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
