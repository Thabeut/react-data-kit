import "./dynamic-form.scss";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useRef } from "react";
import { Drawer, Modal } from "antd";
import {
  Controller,
  useForm,
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
};

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
    customColors,
    className,
    modalWidth = 600,
    drawerWidth = 460,
    maxHeight,
  } = props;

  const popupContainerRef = useRef<HTMLDivElement | null>(null);
  const getPopupContainer = useMemo(
    () => (triggerNode: HTMLElement) =>
      popupContainerRef.current ?? triggerNode.parentElement ?? document.body,
    [],
  );

  const customColorVars = useMemo(() => {
    if (!customColors) return undefined;
    const style: CSSProperties = {};
    const setVar = (name: string, value?: string) => {
      if (!value) return;
      (style as Record<string, string>)[name] = value;
    };
    const applyMode = (
      prefix: "--dt-light" | "--dt-dark",
      mode: DynamicFormProps<TValues>["customColors"] extends infer X
        ? X extends { lightMode?: infer L; darkMode?: infer D }
          ? L | D
          : never
        : never,
    ) => {
      if (!mode || typeof mode !== "object") return;
      const m = mode as any;
      setVar(`${prefix}-surface-bg`, m.surfaceBg);
      setVar(`${prefix}-popover-bg`, m.popoverBg);
      setVar(`${prefix}-popover-option-hover`, m.popoverOptionHoverBg);
      setVar(`${prefix}-surface-border`, m.surfaceBorder);
      setVar(`${prefix}-text-primary`, m.textPrimary);
      setVar(`${prefix}-text-secondary`, m.textSecondary);
    };
    setVar("--dt-primary", customColors.primaryColor);
    applyMode("--dt-light", customColors.lightMode as any);
    applyMode("--dt-dark", customColors.darkMode as any);
    return style;
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
  } = form;

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

  const fieldNodes = fields.map((fieldConfig) => {
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
                  value={field.value as string | undefined}
                  onChange={field.onChange}
                  getPopupContainer={
                    selectProps?.getPopupContainer ?? getPopupContainer
                  }
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
                  value={field.value as string | undefined}
                  onChange={field.onChange}
                  getPopupContainer={
                    (asyncProps as any)?.getPopupContainer ?? getPopupContainer
                  }
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
      <Button variant="primary" size="md" loading={isSubmitting} type="submit">
        {submitLabel}
      </Button>
    </div>
  );

  const defaultContent = (
    <form
      className={clsx("rdk-theme-scope dynamic-form", className)}
      style={customColorVars}
      onSubmit={handleSubmit(onValidSubmit)}
    >
      <div ref={popupContainerRef}>
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
      style={customColorVars}
      onSubmit={handleSubmit(onValidSubmit)}
    >
      <div ref={popupContainerRef}>
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
        rootStyle={customColorVars}
      >
        <div
          ref={popupContainerRef}
          className={clsx("dynamic-form-drawer__inner", className)}
        >
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
              loading={isSubmitting}
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
      style={customColorVars}
    >
      {modalContent}
    </Modal>
  );
}
