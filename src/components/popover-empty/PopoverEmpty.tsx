import "./popover-empty.scss";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { datatableIconNames } from "../../constants/datatable-icons";
import { RDK_I18N_DEFAULT_TEXT } from "../../constants/rdk-i18n-keys";

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
      <span className="ui-popover-empty__text">
        {t(messageKey, {
          defaultValue:
            messageKey === "noSearchResults"
              ? RDK_I18N_DEFAULT_TEXT.noSearchResults
              : RDK_I18N_DEFAULT_TEXT.noOptionsAvailable,
        })}
      </span>
    </div>
  );
}
