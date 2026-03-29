import "./popover-empty.scss";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { datatableIconNames } from "../../constants/datatable-icons";

export type PopoverEmptyProps = {
  variant?: "default" | "search";
};

export function PopoverEmpty({ variant = "default" }: PopoverEmptyProps) {
  const { t } = useTranslation();
  const messageKey =
    variant === "search" ? "noSearchResults" : "noOptionsAvailable";

  return (
    <div className="ui-popover-empty" role="status">
      <Icon
        icon={datatableIconNames.Inbox}
        width={28}
        height={28}
        className="ui-popover-empty__icon"
        aria-hidden
      />
      <span className="ui-popover-empty__text">{t(messageKey)}</span>
    </div>
  );
}
