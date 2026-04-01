import "./upload-field.scss";
import { Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { iconNames } from "../../constants/icons";

export type UploadFieldValue = UploadFile[];

export type UploadFieldProps = Omit<UploadProps, "fileList" | "onChange"> & {
  value?: UploadFieldValue;
  onChange?: (next: UploadFieldValue) => void;
  className?: string;
  title?: string;
  description?: string;
  uploadOnSelect?: boolean;
};

const { Dragger } = Upload;

function formatAcceptTypes(accept: string | undefined): string {
  if (!accept) return "";
  const tokens = accept
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const labels = tokens.map((token) => {
    if (token.startsWith(".")) return token.slice(1).toUpperCase();
    if (token.includes("/")) {
      const [, subtype] = token.split("/");
      if (subtype === "*") return "images";
      return (subtype ?? token).toUpperCase();
    }
    return token.toUpperCase();
  });

  return Array.from(new Set(labels)).join(", ");
}

export function UploadField({
  value,
  onChange,
  className,
  title = "Upload",
  description,
  accept,
  uploadOnSelect = false,
  beforeUpload,
  ...rest
}: UploadFieldProps) {
  const typesLabel = formatAcceptTypes(accept);
  const resolvedDescription =
    description ??
    (typesLabel
      ? `Click or drag files to upload (${typesLabel}).`
      : "Click or drag files to upload.");

  return (
    <Dragger
      {...rest}
      accept={accept}
      fileList={value}
      beforeUpload={uploadOnSelect ? beforeUpload : () => false}
      onChange={(info) => {
        onChange?.(info.fileList);
      }}
      className={clsx("root-rdk", "ui-upload-field", className)}
    >
      <div className="ui-upload-field__inner">
        <Icon
          icon={iconNames.Upload}
          width={24}
          height={24}
          className="ui-upload-field__icon"
          aria-hidden
        />
        <div className="ui-upload-field__text">
          <div className="ui-upload-field__title">{title}</div>
          <div className="ui-upload-field__description">
            {resolvedDescription}
          </div>
        </div>
      </div>
    </Dragger>
  );
}
