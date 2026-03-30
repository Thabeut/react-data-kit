import "./switch-field.scss";
import clsx from "clsx";
import { Switch } from "antd";

export interface SwitchFieldProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
  className?: string;
  checkedLabel?: string;
  uncheckedLabel?: string;
  disabled?: boolean;
}

export function SwitchField({
  value = false,
  onChange,
  className,
  checkedLabel = "On",
  uncheckedLabel = "Off",
  disabled = false,
}: SwitchFieldProps) {
  const checked = value === true;

  return (
    <div
      className={clsx(
        "ui-switch-field",
        checked ? "ui-switch-field--checked" : "ui-switch-field--unchecked",
        className,
      )}
    >
      <Switch
        size="small"
        checked={checked}
        onChange={(next) => onChange?.(next)}
        disabled={disabled}
      />
      <span className="ui-switch-field__label">
        {checked ? checkedLabel : uncheckedLabel}
      </span>
    </div>
  );
}
