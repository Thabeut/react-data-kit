import "./date-filter-popover.scss";
import { useEffect, useState } from "react";
import { DatePicker } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { datatableIconNames } from "../../constants/datatable-icons";
import { RDK_I18N_DEFAULT_TEXT } from "../../constants/rdk-i18n-keys";
import type { IDateFilterOption } from "../../types/data-table";
import { Button } from "../button";
import { PopoverEmpty } from "../popover-empty";

export interface IDateFilterValue {
  date_from: string;
  date_to: string;
}

export interface DateFilterPopoverProps {
  options: IDateFilterOption[];
  value?: IDateFilterValue | null;
  onChange: (value: IDateFilterValue | null) => void;
  onClose?: () => void;
  isOpen?: boolean;
}

function getPresetRange(preset: string): { from: Dayjs; to: Dayjs } {
  const now = dayjs();
  const startOfToday = now.startOf("day");
  switch (preset) {
    case "today":
      return { from: startOfToday, to: now };
    case "yesterday": {
      const y = now.subtract(1, "day");
      return { from: y.startOf("day"), to: y.endOf("day") };
    }
    case "last_7_days":
      return {
        from: now.subtract(6, "day").startOf("day"),
        to: now,
      };
    case "last_30_days":
      return {
        from: now.subtract(29, "day").startOf("day"),
        to: now,
      };
    case "last_3_months":
      return {
        from: now.subtract(2, "month").startOf("month"),
        to: now,
      };
    case "last_12_months":
      return {
        from: now.subtract(11, "month").startOf("month"),
        to: now,
      };
    default:
      return { from: startOfToday, to: now };
  }
}

export function DateFilterPopover({
  options,
  value,
  onChange,
  onClose,
  isOpen,
}: DateFilterPopoverProps) {
  const { t } = useTranslation();
  const [showCustom, setShowCustom] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowCustom(!!value);
    }
  }, [isOpen, value]);

  const handlePresetClick = (presetValue: string) => {
    if (presetValue === "custom") {
      setShowCustom(true);
      return;
    }
    const { from, to } = getPresetRange(presetValue);
    onChange({
      date_from: from.toISOString(),
      date_to: to.toISOString(),
    });
    onClose?.();
  };

  const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (!dates || !dates[0] || !dates[1]) {
      onChange(null);
      return;
    }
    onChange({
      date_from: dates[0].startOf("day").toISOString(),
      date_to: dates[1].endOf("day").toISOString(),
    });
    onClose?.();
  };

  if (showCustom) {
    return (
      <div className="datatable-date-filter-custom">
        <Button
          unstyled
          type="button"
          onClick={() => setShowCustom(false)}
          className="datatable-date-filter-back"
        >
          <Icon
            icon={datatableIconNames.ChevronLeft}
            width={16}
            height={16}
            style={{ flexShrink: 0 }}
          />
          {t("back", { defaultValue: RDK_I18N_DEFAULT_TEXT.back })}
        </Button>
        <DatePicker.RangePicker
          className="ui-date-picker-range"
          classNames={{ popup: { root: "datatable-date-picker-dropdown" } }}
          style={{ width: "100%" }}
          value={value ? [dayjs(value.date_from), dayjs(value.date_to)] : null}
          onChange={handleRangeChange}
          format="MMM D, YYYY"
        />
      </div>
    );
  }

  if (options.length === 0) {
    return <PopoverEmpty />;
  }

  return (
    <div className="datatable-date-filter-presets">
      {options.map((opt) => (
        <Button
          unstyled
          key={opt.value}
          type="button"
          onClick={() => handlePresetClick(opt.value)}
          className="datatable-date-filter-preset-btn"
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}
