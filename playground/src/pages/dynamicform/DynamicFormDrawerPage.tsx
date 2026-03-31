import { useState } from "react";
import { Button, Space } from "antd";
import { useTranslation } from "react-i18next";
import { DynamicForm } from "@thabeut/react-data-kit";
import { DemoPageShell } from "../../components/DemoPageShell";
import { ExamplePreviewCodeFlip } from "../../components/ExamplePreviewCodeFlip";
import { useDynamicFormFields, type FormValues } from "./shared";

export function DynamicFormDrawerPage() {
  const { t } = useTranslation();
  const fields = useDynamicFormFields();
  const [open, setOpen] = useState(false);

  const code = String.raw`import { useState } from "react";
import * as yup from "yup";
import {
  DynamicForm,
  DynamicFieldTypeEnum,
  type DynamicFormField,
} from "@thabeut/react-data-kit";

type FormValues = { bio: string | undefined; color: string | undefined };

const fields: DynamicFormField[] = [
  {
    type: DynamicFieldTypeEnum.TextArea,
    name: "bio",
    label: "Bio",
    placeholder: "Tell us something...",
    fieldSchema: yup.string().min(10, "Bio must be at least 10 chars").required(),
  },
  {
    type: DynamicFieldTypeEnum.Color,
    name: "color",
    label: "Color",
    fieldSchema: yup.string().required("Color is required"),
  },
];

export function Page() {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleSubmit = async (values: FormValues) => {
    console.log(values);
    setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>Open drawer</button>
      <DynamicForm<FormValues>
        variant="drawer"
        open={open}
        onClose={handleClose}
        title="Create item (Drawer)"
        fields={fields}
        submitLabel="Save"
        cancelLabel="Cancel"
        onSubmit={handleSubmit}
      />
    </>
  );
}`;

  return (
    <DemoPageShell
      title={t("dfDrawerViewTitle")}
      description={t("dfDrawerViewDescription")}
      setup={t("dfDrawerViewSetup")}
    >
      <ExamplePreviewCodeFlip
        view={
          <>
            <Space wrap>
              <Button onClick={() => setOpen(true)}>{t("dfOpenDrawer")}</Button>
            </Space>
            <DynamicForm<FormValues>
              variant="drawer"
              open={open}
              onClose={() => setOpen(false)}
              title={t("dfCreateProjectTitle")}
              description={t("dfDrawerFormDesc")}
              fields={fields}
              submitLabel={t("dfSubmit")}
              cancelLabel={t("cancel")}
              onSubmit={async (values) => {
                // eslint-disable-next-line no-alert
                alert(JSON.stringify(values, null, 2));
              }}
            />
          </>
        }
        code={code}
      />
    </DemoPageShell>
  );
}

