import "./string-array-field.scss";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { Icon } from "@iconify/react";
import { Button } from "../button";
import { TextArea } from "../textarea";
import { iconNames } from "../../constants/icons";

export interface StringArrayFieldProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  className?: string;
  placeholder?: string;
  addLabel?: string;
  disabled?: boolean;
}

export function StringArrayField({
  value,
  onChange,
  className,
  placeholder = "Add a value",
  addLabel = "Add",
  disabled = false,
}: StringArrayFieldProps) {
  const values = useMemo(
    () =>
      Array.isArray(value)
        ? value.filter((item): item is string => typeof item === "string")
        : [],
    [value],
  );
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const addValue = () => {
    const next = draft.trim();
    if (!next) return;
    const deduped = values.includes(next) ? values : [...values, next];
    onChange?.(deduped);
    setDraft("");
    setComposerOpen(false);
  };

  const removeValue = (item: string) => {
    onChange?.(values.filter((v) => v !== item));
  };

  return (
    <div className={clsx("root-rdk", "ui-string-array-field", className)}>
      {composerOpen && (
        <div className="ui-string-array-field__composer">
          <TextArea
            unstyled
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeholder}
            autoSize={{ minRows: 2, maxRows: 4 }}
            className="ui-string-array-field__input"
            disabled={disabled}
          />
          <div className="ui-string-array-field__composer-actions">
            <Button
              variant="default"
              size="sm"
              type="button"
              disabled={disabled}
              onClick={() => {
                setDraft("");
                setComposerOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="button"
              onClick={addValue}
              disabled={disabled || !draft.trim()}
            >
              Save
            </Button>
          </div>
        </div>
      )}

      <div className="ui-string-array-field__pills">
        {values.map((item) => (
          <span key={item} className="ui-string-array-field__pill">
            <span className="ui-string-array-field__pill-text">{item}</span>
            <button
              type="button"
              className="ui-string-array-field__pill-remove"
              aria-label={`Remove ${item}`}
              onClick={() => removeValue(item)}
              disabled={disabled}
            >
              <Icon icon={iconNames.Close} width={14} height={14} />
            </button>
          </span>
        ))}

        {!composerOpen && (
          <button
            type="button"
            className="ui-string-array-field__add"
            onClick={() => setComposerOpen(true)}
            disabled={disabled}
          >
            <Icon icon={iconNames.Plus} width={14} height={14} />
            <span>{addLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
