import "./input.scss";
import React from "react";
import { Input as AntInput } from "antd";
import type { InputProps as AntInputProps, InputRef } from "antd";
import clsx from "clsx";

export type InputProps = Omit<AntInputProps, "size"> & {
  className?: string;
  unstyled?: boolean;
};

export const Input = React.forwardRef<InputRef, InputProps>(
  ({ className, unstyled = false, ...rest }, ref) => {
    return (
      <AntInput
        ref={ref}
        className={clsx(unstyled ? "ui-input--bare" : "ui-input", className)}
        {...rest}
      />
    );
  },
);

Input.displayName = "Input";
