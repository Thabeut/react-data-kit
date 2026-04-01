import "./error-text.scss";
import type { ReactNode } from "react";
import clsx from "clsx";

export interface ErrorTextProps {
  children: ReactNode;
  className?: string;
}

export function ErrorText({ children, className }: ErrorTextProps) {
  return (
    <div className={clsx("root-rdk", "ui-error-text", className)}>{children}</div>
  );
}

