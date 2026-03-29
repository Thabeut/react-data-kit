import "./button.scss";
import React from "react";
import { Button as AntButton } from "antd";
import type { ButtonProps as AntButtonProps } from "antd";
import clsx from "clsx";

export interface ButtonProps extends Omit<
  AntButtonProps,
  "size" | "type" | "variant"
> {
  variant?: "primary" | "default" | "outlined";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  unstyled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "md",
  icon,
  className,
  onClick,
  disabled = false,
  type = "button",
  unstyled = false,
  ...rest
}) => {
  const isIconOnly =
    children == null ||
    (typeof children === "string" && children.trim() === "");

  return unstyled ? (
    <button
      {...rest}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx("ui-btn-native", className)}
    >
      {icon}
      {children}
    </button>
  ) : (
    <AntButton
      htmlType={type}
      icon={icon}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "ui-btn",
        `ui-btn--${variant}`,
        `ui-btn--${size}`,
        (isIconOnly || (icon && !children)) && "ui-btn--icon-only",
        className,
      )}
      {...rest}
    >
      {children}
    </AntButton>
  );
};
