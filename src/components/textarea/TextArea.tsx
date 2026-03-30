import "./textarea.scss";
import React from "react";
import { Input as AntInput } from "antd";
import type { TextAreaProps as AntTextAreaProps } from "antd/es/input";
import clsx from "clsx";

export type TextAreaProps = Omit<AntTextAreaProps, "size"> & {
  className?: string;
  unstyled?: boolean;
};

const { TextArea: AntTextArea } = AntInput;

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, unstyled = false, autoSize, ...rest }, ref) => {
    return (
      <AntTextArea
        ref={ref}
        autoSize={autoSize ?? { minRows: 3, maxRows: 6 }}
        className={clsx(
          unstyled ? "ui-textarea--bare" : "ui-textarea",
          className,
        )}
        {...rest}
      />
    );
  },
);

TextArea.displayName = "TextArea";
