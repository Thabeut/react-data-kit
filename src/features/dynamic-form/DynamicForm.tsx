import "./dynamic-form.scss";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useRef } from "react";
import { Drawer, Modal } from "antd";
import {
  Controller,
  useForm,
  useWatch,
  type DefaultValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import clsx from "clsx";

import { Input } from "../../components/input";
import type { InputProps } from "../../components/input/Input";
import { Select } from "../../components/select";
import type { SelectProps } from "../../components/select/Select";
import { TextArea } from "../../components/textarea";
import type { TextAreaProps } from "../../components/textarea/TextArea";
import { AsyncSelect } from "../../components/async-select";
import type { AsyncSelectProps } from "../../components/async-select/AsyncSelect";
import { UploadField } from "../../components/upload-field";
import type {
  UploadFieldProps,
  UploadFieldValue,
} from "../../components/upload-field/UploadField";
import { AvatarUpload } from "../../components/avatar-upload";
import type {
  AvatarUploadProps,
  AvatarUploadValue,
} from "../../components/avatar-upload/AvatarUpload";
import { ColorPicker } from "../../components/color-picker";
import type { ColorPickerProps } from "../../components/color-picker/ColorPicker";
import { StringArrayField } from "../../components/string-array-field";
import type { StringArrayFieldProps } from "../../components/string-array-field/StringArrayField";
import { SwitchField } from "../../components/switch-field";
import type { SwitchFieldProps } from "../../components/switch-field/SwitchField";
import { Button } from "../../components/button";
import { ErrorText } from "../../components/error-text";

export const DynamicFieldTypeEnum = {
  Input: "input",
  Select: "select",
  TextArea: "textarea",
  AsyncSelect: "asyncSelect",
  Upload: "upload",
  Avatar: "avatar",
  Color: "color",
  StringArray: "stringArray",
  Switch: "switch",
  Custom: "custom",
} as const;

export type DynamicFieldType =
  (typeof DynamicFieldTypeEnum)[keyof typeof DynamicFieldTypeEnum];

interface DynamicFormModeColors {
  surfaceBg?: string;
  popoverBg?: string;
  popoverOptionHoverBg?: string;
  surfaceBorder?: string;
  textPrimary?: string;
  textSecondary?: string;
}

export interface DynamicFormCustomColors {
  primaryColor?: string;
  lightMode?: DynamicFormModeColors;
  darkMode?: DynamicFormModeColors;
}

type BaseDynamicFormField = {
  name: string;
  label: ReactNode;
  placeholder?: string;
  required?: boolean;
  className?: string;
  fieldSchema?: yup.Schema<any>;
  dependsOn?: DynamicFormDependencyRule | DynamicFormDependencyRule[];
};

export interface DynamicFormDependencyRule {
  field: string | string[];
  effect?: "show" | "disable";
  when?: (values: Record<string, unknown>) => boolean;
  resetOnHide?: boolean;
}

export interface DynamicFormQueryDependency {
  fields: string | string[];
  buildParams: (args: {
    values: Record<string, unknown>;
    state: { page: number; search: string };
    baseParams: unknown;
  }) => unknown;
  resetOnChange?: boolean;
}

type InputFieldProps = Omit<InputProps, "value" | "onChange">;
type SelectFieldProps = Omit<SelectProps<string>, "value" | "onChange">;
type TextAreaFieldProps = Omit<TextAreaProps, "value" | "onChange">;
type AsyncSelectFieldProps = Omit<
  AsyncSelectProps<unknown, unknown>,
  "value" | "onChange"
>;
type UploadFieldOnlyProps = Omit<UploadFieldProps, "value" | "onChange">;
type AvatarUploadOnlyProps = Omit<AvatarUploadProps, "value" | "onChange">;
type ColorPickerOnlyProps = Omit<ColorPickerProps, "value" | "onChange">;
type StringArrayOnlyProps = Omit<StringArrayFieldProps, "value" | "onChange">;
type SwitchFieldOnlyProps = Omit<SwitchFieldProps, "value" | "onChange">;

export type DynamicFormField =
  | (BaseDynamicFormField & {
      type: "input";
      fieldProps?: InputFieldProps;
    })
  | (BaseDynamicFormField & {
      type: "select";
      fieldProps?: SelectFieldProps;
    })
  | (BaseDynamicFormField & {
      type: "textarea";
      fieldProps?: TextAreaFieldProps;
    })
  | (BaseDynamicFormField & {
      type: "asyncSelect";
      fieldProps: AsyncSelectFieldProps;
      queryDependsOn?: DynamicFormQueryDependency;
    })
  | (BaseDynamicFormField & {
      type: "upload";
      fieldProps?: UploadFieldOnlyProps;
    })
  | (BaseDynamicFormField & {
      type: "avatar";
      fieldProps?: AvatarUploadOnlyProps;
    })
  | (BaseDynamicFormField & {
      type: "color";
      fieldProps?: ColorPickerOnlyProps;
    })
  | (BaseDynamicFormField & {
      type: "stringArray";
      fieldProps?: StringArrayOnlyProps;
    })
  | (BaseDynamicFormField & {
      type: "switch";
      fieldProps?: SwitchFieldOnlyProps;
    })
  | (BaseDynamicFormField & {
      type: "custom";
      render: (form: UseFormReturn<Record<string, unknown>>) => ReactNode;
    });

export type DynamicAsyncSelectField<TItem, TData, TArgs = unknown> = Omit<
  Extract<DynamicFormField, { type: "asyncSelect" }>,
  "fieldProps"
> & {
  fieldProps: Omit<
    AsyncSelectFieldProps,
    | "useQuery"
    | "buildParams"
    | "formatData"
    | "getOptionValue"
    | "getOptionLabel"
  > & {
    useQuery: (args: TArgs) => {
      data?: TData;
      isLoading: boolean;
      isFetching?: boolean;
    };
    buildParams: (state: { page: number; search: string }) => TArgs;
    formatData: (data: TData | undefined) => { items: TItem[]; hasMore: boolean };
    getOptionValue: (item: TItem) => string;
    getOptionLabel: (item: TItem) => string;
  };
};

export function defineAsyncSelectField<TItem, TData, TArgs = unknown>(
  field: DynamicAsyncSelectField<TItem, TData, TArgs>,
): DynamicFormField {
  return field as DynamicFormField;
}

export interface DynamicFormProps<TValues extends Record<string, unknown>> {
  variant?: "default" | "modal" | "drawer";

  open?: boolean;
  onClose?: () => void;

  title?: ReactNode;
  description?: ReactNode;

  fields: DynamicFormField[];
  defaultValues?: TValues;

  submitLabel: ReactNode;
  cancelLabel?: ReactNode;
  onSubmit: (values: TValues) => Promise<void> | void;
  submitLoading?: boolean;

  customColors?: DynamicFormCustomColors;

  className?: string;
  modalWidth?: number;
  drawerWidth?: number;
  maxHeight?: string;
}

export function DynamicForm<TValues extends Record<string, unknown>>(
  props: DynamicFormProps<TValues>,
) {
  const {
    variant = "default",
    open,
    onClose,
    title,
    description,
    fields,
    defaultValues,
    submitLabel,
    cancelLabel = "Cancel",
    onSubmit,
    submitLoading = false,
    customColors,
    className,
    modalWidth = 600,
    drawerWidth = 460,
    maxHeight,
  } = props;

  useEffect(() => {
    if (!customColors || typeof document === "undefined") return;
    const root = document.documentElement;
    const vars: Record<string, string | undefined> = {
      "--rdk-primary": customColors.primaryColor,
      "--rdk-light-surface-bg": customColors.lightMode?.surfaceBg,
      "--rdk-light-popover-bg": customColors.lightMode?.popoverBg,
      "--rdk-light-popover-option-hover":
        customColors.lightMode?.popoverOptionHoverBg,
      "--rdk-light-surface-border": customColors.lightMode?.surfaceBorder,
      "--rdk-light-text-primary": customColors.lightMode?.textPrimary,
      "--rdk-light-text-secondary": customColors.lightMode?.textSecondary,
      "--rdk-dark-surface-bg": customColors.darkMode?.surfaceBg,
      "--rdk-dark-popover-bg": customColors.darkMode?.popoverBg,
      "--rdk-dark-popover-option-hover":
        customColors.darkMode?.popoverOptionHoverBg,
      "--rdk-dark-surface-border": customColors.darkMode?.surfaceBorder,
      "--rdk-dark-text-primary": customColors.darkMode?.textPrimary,
      "--rdk-dark-text-secondary": customColors.darkMode?.textSecondary,
    };

    const previous = new Map<string, string>();
    Object.entries(vars).forEach(([key, value]) => {
      if (!value) return;
      previous.set(key, root.style.getPropertyValue(key));
      root.style.setProperty(key, value);
    });

    return () => {
      previous.forEach((value, key) => {
        if (value) root.style.setProperty(key, value);
        else root.style.removeProperty(key);
      });
    };
  }, [customColors]);

  const resolvedFieldsMaxHeight = useMemo<string | undefined>(() => {
    if (maxHeight) return maxHeight;
    if (variant === "drawer") return "calc(100vh - 240px)";
    if (variant === "modal") return "min(60vh, 520px)";
    return undefined;
  }, [maxHeight, variant]);

  const fieldsContainerStyle = useMemo<CSSProperties | undefined>(() => {
    if (!resolvedFieldsMaxHeight) return undefined;
    return {
      maxHeight: resolvedFieldsMaxHeight,
      overflowY: "auto",
      paddingRight: "4px",
    };
  }, [resolvedFieldsMaxHeight]);

  const resolvedDefaults = useMemo<DefaultValues<TValues> | undefined>(
    () => defaultValues as DefaultValues<TValues> | undefined,
    [defaultValues],
  );

  const schema = useMemo<yup.ObjectSchema<any>>(() => {
    const shape: Record<string, yup.Schema<any>> = {};
    for (const field of fields) {
      if (field.fieldSchema) {
        shape[field.name] = field.fieldSchema;
      }
    }
    return yup.object(shape);
  }, [fields]);

  const form = useForm<TValues>({
    resolver: yupResolver(schema as any) as never,
    mode: "onChange",
    defaultValues: resolvedDefaults,
  });

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = form;
  const watchedValues = useWatch({ control }) as Record<string, unknown>;
  const asyncDependencySignatureRef = useRef<Record<string, string>>({});
  const hiddenFieldStateRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (variant === "default") return;
    if (!open) return;
    reset(resolvedDefaults);
  }, [open, reset, resolvedDefaults, variant]);

  const schemaDescription = schema.describe() as {
    fields?: Record<
      string,
      { tests?: Array<{ name?: string | null | undefined }> }
    >;
  };

  const isFieldRequired = (field: DynamicFormField): boolean => {
    if (typeof field.required === "boolean") return field.required;
    const info = schemaDescription.fields?.[field.name];
    if (!info?.tests) return false;
    return info.tests.some((t) => t.name === "required");
  };

  const handleClose = () => {
    reset(resolvedDefaults);
    onClose?.();
  };

  const onValidSubmit = async (values: TValues) => {
    await onSubmit(values);
    reset(resolvedDefaults);
    onClose?.();
  };

  const dependencyStateByField = useMemo(() => {
    const values = watchedValues ?? {};
    const state: Record<
      string,
      { hidden: boolean; disabled: boolean; resetOnHide: boolean }
    > = {};

    const evaluateRule = (rule: DynamicFormDependencyRule): boolean => {
      if (rule.when) return Boolean(rule.when(values));
      const depFields = Array.isArray(rule.field) ? rule.field : [rule.field];
      return depFields.every((fieldName) => {
        const fieldValue = values[fieldName];
        if (Array.isArray(fieldValue)) return fieldValue.length > 0;
        return Boolean(fieldValue);
      });
    };

    for (const field of fields) {
      const rules = field.dependsOn
        ? Array.isArray(field.dependsOn)
          ? field.dependsOn
          : [field.dependsOn]
        : [];
      let hidden = false;
      let disabled = false;
      let resetOnHide = false;

      for (const rule of rules) {
        const passes = evaluateRule(rule);
        const effect = rule.effect ?? "show";
        if (effect === "show" && !passes) {
          hidden = true;
          resetOnHide = resetOnHide || Boolean(rule.resetOnHide);
        }
        if (effect === "disable" && !passes) {
          disabled = true;
        }
      }

      state[field.name] = { hidden, disabled, resetOnHide };
    }

    return state;
  }, [fields, watchedValues]);

  useEffect(() => {
    for (const field of fields) {
      if (field.type !== "asyncSelect" || !field.queryDependsOn) continue;
      const depFields = Array.isArray(field.queryDependsOn.fields)
        ? field.queryDependsOn.fields
        : [field.queryDependsOn.fields];
      const signature = JSON.stringify(
        depFields.map((name) => watchedValues?.[name]),
      );
      const previousSignature = asyncDependencySignatureRef.current[field.name];
      if (
        previousSignature !== undefined &&
        previousSignature !== signature &&
        field.queryDependsOn.resetOnChange !== false
      ) {
        setValue(field.name as Path<TValues>, undefined as never, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
      asyncDependencySignatureRef.current[field.name] = signature;
    }
  }, [fields, setValue, watchedValues]);

  useEffect(() => {
    for (const field of fields) {
      const dependencyState = dependencyStateByField[field.name];
      const isHidden = Boolean(dependencyState?.hidden);
      const wasHidden = Boolean(hiddenFieldStateRef.current[field.name]);
      if (isHidden && !wasHidden && dependencyState?.resetOnHide) {
        setValue(field.name as Path<TValues>, undefined as never, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
      hiddenFieldStateRef.current[field.name] = isHidden;
    }
  }, [dependencyStateByField, fields, setValue]);

  const fieldNodes = fields.map((fieldConfig) => {
    const dependencyState = dependencyStateByField[fieldConfig.name];
    if (dependencyState?.hidden) return null;
    const isDependencyDisabled = Boolean(dependencyState?.disabled);
    const fieldError = errors[fieldConfig.name as keyof typeof errors];
    const errorMessage =
      typeof (fieldError as any)?.message === "string"
        ? ((fieldError as any).message as string)
        : undefined;

    const required = isFieldRequired(fieldConfig);

    if (fieldConfig.type === "custom") {
      return (
        <div key={fieldConfig.name} className={fieldConfig.className}>
          {fieldConfig.render(form as UseFormReturn<Record<string, unknown>>)}
          {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
        </div>
      );
    }

    return (
      <div
        key={fieldConfig.name}
        className={clsx("dynamic-form__field", fieldConfig.className)}
      >
        <div className="dynamic-form__label">
          <span className="dynamic-form__label-text">{fieldConfig.label}</span>
          {required && <span className="dynamic-form__required">*</span>}
        </div>

        <Controller
          control={control}
          name={fieldConfig.name as Path<TValues>}
          render={({ field }) => {
            if (fieldConfig.type === "select") {
              const selectProps = fieldConfig.fieldProps as
                | SelectFieldProps
                | undefined;
              return (
                <Select<string>
                  {...selectProps}
                  className={clsx("w-full", selectProps?.className)}
                  disabled={
                    Boolean(selectProps?.disabled) || isDependencyDisabled
                  }
                  value={field.value as string | undefined}
                  onChange={field.onChange}
                  placeholder={
                    selectProps?.placeholder ?? fieldConfig.placeholder
                  }
                />
              );
            }

            if (fieldConfig.type === "textarea") {
              const textAreaProps = fieldConfig.fieldProps as
                | TextAreaFieldProps
                | undefined;
              return (
                <TextArea
                  {...textAreaProps}
                  className={clsx(textAreaProps?.className)}
                  disabled={
                    Boolean(textAreaProps?.disabled) || isDependencyDisabled
                  }
                  value={(field.value as string | undefined) ?? ""}
                  onChange={field.onChange as never}
                  placeholder={
                    textAreaProps?.placeholder ?? fieldConfig.placeholder
                  }
                />
              );
            }

            if (fieldConfig.type === "asyncSelect") {
              const asyncProps = fieldConfig.fieldProps;
              return (
                <AsyncSelect<unknown, unknown>
                  {...asyncProps}
                  placeholder={
                    asyncProps?.placeholder ?? fieldConfig.placeholder
                  }
                  disabled={
                    Boolean((asyncProps as { disabled?: boolean })?.disabled) ||
                    isDependencyDisabled
                  }
                  buildParams={(state) => {
                    const baseParams = asyncProps.buildParams(state);
                    if (!fieldConfig.queryDependsOn) return baseParams;
                    return fieldConfig.queryDependsOn.buildParams({
                      values: watchedValues ?? {},
                      state,
                      baseParams,
                    });
                  }}
                  value={field.value as string | undefined}
                  onChange={field.onChange}
                />
              );
            }

            if (fieldConfig.type === "upload") {
              const uploadProps = fieldConfig.fieldProps as
                | UploadFieldOnlyProps
                | undefined;
              return (
                <UploadField
                  {...uploadProps}
                  disabled={
                    Boolean(uploadProps?.disabled) || isDependencyDisabled
                  }
                  value={(field.value as UploadFieldValue | undefined) ?? []}
                  onChange={field.onChange as never}
                />
              );
            }

            if (fieldConfig.type === "avatar") {
              const avatarProps = fieldConfig.fieldProps as
                | AvatarUploadOnlyProps
                | undefined;
              return (
                <AvatarUpload
                  {...avatarProps}
                  disabled={
                    Boolean(avatarProps?.disabled) || isDependencyDisabled
                  }
                  value={(field.value as AvatarUploadValue | undefined) ?? []}
                  onChange={field.onChange as never}
                />
              );
            }

            if (fieldConfig.type === "color") {
              const colorProps = fieldConfig.fieldProps as
                | ColorPickerOnlyProps
                | undefined;
              return (
                <ColorPicker
                  {...colorProps}
                  disabled={
                    Boolean(colorProps?.disabled) || isDependencyDisabled
                  }
                  value={(field.value as string | undefined) ?? ""}
                  onChange={field.onChange}
                />
              );
            }

            if (fieldConfig.type === "stringArray") {
              const stringArrayProps = fieldConfig.fieldProps as
                | StringArrayOnlyProps
                | undefined;
              return (
                <StringArrayField
                  {...stringArrayProps}
                  disabled={
                    Boolean(stringArrayProps?.disabled) || isDependencyDisabled
                  }
                  value={(field.value as string[] | undefined) ?? []}
                  onChange={field.onChange}
                  placeholder={
                    stringArrayProps?.placeholder ?? fieldConfig.placeholder
                  }
                />
              );
            }

            if (fieldConfig.type === "switch") {
              const switchFieldProps = fieldConfig.fieldProps as
                | SwitchFieldOnlyProps
                | undefined;
              return (
                <SwitchField
                  {...switchFieldProps}
                  disabled={
                    Boolean(switchFieldProps?.disabled) || isDependencyDisabled
                  }
                  value={Boolean(field.value)}
                  onChange={field.onChange}
                />
              );
            }

            const inputProps = fieldConfig.fieldProps as
              | InputFieldProps
              | undefined;
            return (
              <Input
                {...inputProps}
                className={clsx(inputProps?.className)}
                disabled={Boolean(inputProps?.disabled) || isDependencyDisabled}
                value={(field.value as string | undefined) ?? ""}
                onChange={field.onChange}
                placeholder={inputProps?.placeholder ?? fieldConfig.placeholder}
              />
            );
          }}
        />

        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      </div>
    );
  });

  const header =
    title || description ? (
      <div className="dynamic-form__header">
        {title && <div className="dynamic-form__title">{title}</div>}
        {description && (
          <div className="dynamic-form__description">{description}</div>
        )}
      </div>
    ) : null;

  const actions = (
    <div className="dynamic-form__actions">
      <Button variant="default" size="md" type="button" onClick={handleClose}>
        {cancelLabel}
      </Button>
      <Button
        variant="primary"
        size="md"
        loading={isSubmitting || submitLoading}
        type="submit"
      >
        {submitLabel}
      </Button>
    </div>
  );

  const defaultContent = (
    <form
      className={clsx("rdk-theme-scope dynamic-form", className)}
      onSubmit={handleSubmit(onValidSubmit)}
    >
      <div>
        {header}
        <div className="dynamic-form__fields" style={fieldsContainerStyle}>
          {fieldNodes}
        </div>
        {actions}
      </div>
    </form>
  );

  const modalContent = (
    <form
      className={clsx("rdk-theme-scope dynamic-form", className)}
      onSubmit={handleSubmit(onValidSubmit)}
    >
      <div>
        {header}
        <div className="dynamic-form__fields" style={fieldsContainerStyle}>
          {fieldNodes}
        </div>
        {actions}
      </div>
    </form>
  );

  if (variant === "default") {
    return defaultContent;
  }

  if (variant === "drawer") {
    const submitFromFooter = () => void handleSubmit(onValidSubmit)();
    return (
      <Drawer
        open={Boolean(open)}
        onClose={handleClose}
        width={drawerWidth}
        destroyOnClose={false}
        maskClosable
        closable={false}
        rootClassName="dynamic-form-drawer"
      >
        <div className={clsx("dynamic-form-drawer__inner", className)}>
          <div className="dynamic-form-drawer__content">
            {header}
            <form
              className="dynamic-form-drawer__form"
              style={fieldsContainerStyle}
              onSubmit={(e) => {
                e.preventDefault();
                submitFromFooter();
              }}
            >
              {fieldNodes}
            </form>
          </div>

          <div className="dynamic-form-drawer__footer">
            <Button
              variant="primary"
              size="md"
              loading={isSubmitting || submitLoading}
              type="button"
              onClick={submitFromFooter}
            >
              {submitLabel}
            </Button>
            <Button
              variant="default"
              size="md"
              type="button"
              onClick={handleClose}
            >
              {cancelLabel}
            </Button>
          </div>
        </div>
      </Drawer>
    );
  }

  return (
    <Modal
      open={Boolean(open)}
      onCancel={handleClose}
      footer={null}
      closable
      centered
      width={modalWidth}
      title={null}
      rootClassName="dynamic-form-modal"
    >
      {modalContent}
    </Modal>
  );
}
