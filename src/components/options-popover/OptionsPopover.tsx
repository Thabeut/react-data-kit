import "./options-popover.scss";
import type { CSSProperties, ReactNode } from "react";
import { Popover } from "antd";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { datatableIconNames } from "../../constants/datatable-icons";
import { Button } from "../button";
import { PopoverEmpty } from "../popover-empty";

export interface OptionsPopoverOption {
  key: string;
  label: string;
}

export interface OptionsPopoverProps {
  options: OptionsPopoverOption[];
  value: string | string[];
  onChange: (key: string) => void;
  trigger: ReactNode;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  multi?: boolean;
  placement?:
    | "top"
    | "topLeft"
    | "topRight"
    | "bottom"
    | "bottomLeft"
    | "bottomRight"
    | "left"
    | "leftTop"
    | "leftBottom"
    | "right"
    | "rightTop"
    | "rightBottom";
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
  footer?: ReactNode;
}

export function OptionsPopover({
  options,
  value,
  onChange,
  trigger,
  open,
  onOpenChange,
  title,
  multi = false,
  placement = "bottomLeft",
  overlayClassName,
  overlayStyle,
  footer,
}: OptionsPopoverProps) {
  const isSelected = (key: string) =>
    multi ? (value as string[]).includes(key) : (value as string) === key;

  const content = (
    <div className="ui-options-popover">
      {title ? (
        <div className="ui-options-popover__title">{title}</div>
      ) : null}
      {options.length === 0 ? (
        <PopoverEmpty />
      ) : (
        options.map(({ key, label }) => (
          <Button
            unstyled
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className="ui-options-popover__item"
          >
            <Icon
              icon={datatableIconNames.Check}
              width={16}
              height={16}
              className={clsx(
                "ui-options-popover__check",
                isSelected(key) && "ui-options-popover__check--visible",
              )}
            />
            <span>{label}</span>
          </Button>
        ))
      )}
      {footer ? (
        <div className="ui-options-popover__footer">{footer}</div>
      ) : null}
    </div>
  );

  return (
    <Popover
      trigger="click"
      placement={placement}
      rootClassName={clsx(
        "rdk-theme-scope",
        "datatable-columns-popover",
        overlayClassName,
      )}
      overlayStyle={overlayStyle}
      content={content}
      open={open}
      onOpenChange={onOpenChange}
    >
      {trigger}
    </Popover>
  );
}

export default OptionsPopover;
