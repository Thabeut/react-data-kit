import "./color-picker.scss";
import { ColorPicker as AntColorPicker } from "antd";
import type { Color } from "antd/es/color-picker";
import clsx from "clsx";

export interface ColorPickerProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  autoOpen?: boolean;
}

export function ColorPicker({
  value,
  onChange,
  className,
  disabled = false,
  autoOpen = false,
}: ColorPickerProps) {
  const handleChangeComplete = (color: Color) => {
    onChange?.(color.toHexString());
  };

  return (
    <div
      className={clsx(
        "root-rdk",
        "ui-color-picker",
        disabled && "ui-color-picker--disabled",
        className,
      )}
    >
      <AntColorPicker
        value={value || undefined}
        onChangeComplete={handleChangeComplete}
        disabled={disabled}
        open={autoOpen ? true : undefined}
      />
    </div>
  );
}

