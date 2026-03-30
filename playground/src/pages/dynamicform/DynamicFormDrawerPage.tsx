import { useState } from "react";
import { Button, Space } from "antd";
import { DynamicForm } from "@thabeut/react-data-kit";
import { DemoPageShell } from "../../components/DemoPageShell";
import { ExamplePreviewCodeFlip } from "../../components/ExamplePreviewCodeFlip";
import { useDynamicFormFields, type FormValues } from "./shared";

export function DynamicFormDrawerPage() {
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
      title="Drawer View"
      description="Use the drawer variant for side-panel workflows where users need page context while filling the form."
      setup="Drawer works well for multi-field create/edit tasks and keeps actions visible while fields can scroll within viewport-safe height."
    >
      <ExamplePreviewCodeFlip
        view={
          <>
            <Space wrap>
              <Button onClick={() => setOpen(true)}>Open drawer</Button>
            </Space>
            <DynamicForm<FormValues>
              variant="drawer"
              open={open}
              onClose={() => setOpen(false)}
              title="Create project"
              description="Side-panel form with textarea and color selection."
              fields={fields}
              submitLabel="Submit"
              cancelLabel="Cancel"
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

