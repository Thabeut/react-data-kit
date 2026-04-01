import React from "react";
import { Select as AntSelect } from "antd";
import type { SelectProps as AntSelectProps } from "antd";
import clsx from "clsx";
import "./select.scss";

export type SelectProps<T = unknown> = AntSelectProps<T> & {
  className?: string;
};

function SelectInner<T>(props: SelectProps<T>) {
  const { className, popupClassName, ...rest } = props;
  return (
    <AntSelect<T>
      {...rest}
      className={clsx("root-rdk", "ui-select", className)}
      popupClassName={clsx("rdk-theme-scope ui-select-dropdown", popupClassName)}
    />
  );
}

export const Select = SelectInner as <T = unknown>(
  props: SelectProps<T>,
) => React.ReactElement;
