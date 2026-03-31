import { useState } from "react";
import { Button, Space } from "antd";
import { useTranslation } from "react-i18next";
import { DynamicForm } from "@thabeut/react-data-kit";
import { DemoPageShell } from "../../components/DemoPageShell";
import { ExamplePreviewCodeFlip } from "../../components/ExamplePreviewCodeFlip";
import { useDynamicFormFields, type FormValues } from "./shared";

export function DynamicFormModalPage() {
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

type FormValues = { name: string | undefined; status: string | undefined };

const fields: DynamicFormField[] = [
  {
    type: DynamicFieldTypeEnum.Input,
    name: "name",
    label: "Name",
    placeholder: "Enter a name",
    fieldSchema: yup.string().required("Name is required"),
  },
  {
    type: DynamicFieldTypeEnum.Select,
    name: "status",
    label: "Status",
    placeholder: "Pick status",
    fieldSchema: yup.string().required("Status is required"),
    fieldProps: {
      options: [
        { value: "active", label: "Active" },
        { value: "paused", label: "Paused" },
      ],
    },
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
      <button onClick={() => setOpen(true)}>Open modal</button>
      <DynamicForm<FormValues>
        variant="modal"
        open={open}
        onClose={handleClose}
        title="Create item (Modal)"
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
      title={t("dfModalViewTitle")}
      description={t("dfModalViewDescription")}
      setup={t("dfModalViewSetup")}
    >
      <ExamplePreviewCodeFlip
        view={
          <>
            <Space wrap>
              <Button onClick={() => setOpen(true)}>{t("dfOpenModal")}</Button>
            </Space>
            <DynamicForm<FormValues>
              variant="modal"
              open={open}
              onClose={() => setOpen(false)}
              title={t("dfCreateTeamMemberTitle")}
              description={t("dfModalFormDesc")}
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

