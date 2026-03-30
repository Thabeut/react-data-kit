import "./avatar-upload.scss";
import { useMemo } from "react";
import { Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { iconNames } from "../../constants/icons";

export type AvatarUploadValue = UploadFile[];

export type AvatarUploadProps = Omit<UploadProps, "fileList" | "onChange"> & {
  value?: AvatarUploadValue;
  onChange?: (next: AvatarUploadValue) => void;
  className?: string;
  size?: number;
  uploadOnSelect?: boolean;
};

function getPreview(file?: UploadFile): string | undefined {
  if (!file) return undefined;
  if (typeof file.thumbUrl === "string") return file.thumbUrl;
  if (typeof file.url === "string") return file.url;
  const origin = file.originFileObj;
  if (origin instanceof File) return URL.createObjectURL(origin);
  return undefined;
}

export function AvatarUpload({
  value,
  onChange,
  className,
  size = 96,
  accept = "image/*",
  uploadOnSelect = false,
  beforeUpload,
  disabled = false,
  ...rest
}: AvatarUploadProps) {
  const single = useMemo(() => (value ?? []).slice(-1), [value]);
  const previewUrl = useMemo(() => getPreview(single[0]), [single]);

  return (
    <Upload
      {...rest}
      accept={accept}
      listType="picture-card"
      fileList={single}
      maxCount={1}
      disabled={disabled}
      beforeUpload={uploadOnSelect ? beforeUpload : () => false}
      onChange={(info) => onChange?.(info.fileList.slice(-1))}
      showUploadList={false}
      className={clsx("ui-avatar-upload", className)}
    >
      <div
        className="ui-avatar-upload__trigger"
        style={{ width: size, height: size }}
      >
        <div className="ui-avatar-upload__media">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Avatar preview"
              className="ui-avatar-upload__image"
            />
          ) : (
            <div className="ui-avatar-upload__placeholder">
              <Icon icon={iconNames.User} width={22} height={22} aria-hidden />
              <span>Upload</span>
            </div>
          )}
        </div>
        {!disabled && (
          <div className="ui-avatar-upload__edit">
            <Icon icon={iconNames.Camera} width={14} height={14} aria-hidden />
          </div>
        )}
      </div>
    </Upload>
  );
}
