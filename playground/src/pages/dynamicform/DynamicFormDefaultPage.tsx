import { DynamicForm } from "@thabeut/react-data-kit";
import { DemoPageShell } from "../../components/DemoPageShell";
import { ExamplePreviewCodeFlip } from "../../components/ExamplePreviewCodeFlip";
import { useDynamicFormFields, type FormValues } from "./shared";

export function DynamicFormDefaultPage() {
  const fields = useDynamicFormFields();

  const code = String.raw`import * as yup from "yup";
import type { UploadFile } from "antd";
import {
  DynamicForm,
  DynamicFieldTypeEnum,
  type DynamicFormField,
} from "@thabeut/react-data-kit";

type FormValues = {
  name: string | undefined;
  avatar: UploadFile[];
  tags: string[];
  featured: boolean;
};

const fields: DynamicFormField[] = [
  {
    type: DynamicFieldTypeEnum.Avatar,
    name: "avatar",
    label: "Avatar",
    fieldSchema: yup.array().max(1, "Avatar allows one image only"),
    fieldProps: { size: 88, accept: "image/*" },
  },
  {
    type: DynamicFieldTypeEnum.Input,
    name: "name",
    label: "Name",
    placeholder: "Enter a name",
    fieldSchema: yup.string().required("Name is required"),
  },
  {
    type: DynamicFieldTypeEnum.StringArray,
    name: "tags",
    label: "Tags",
    fieldSchema: yup.array().of(yup.string().required()).min(1, "Add at least one tag"),
    fieldProps: { addLabel: "Add tag", placeholder: "Write a tag" },
  },
  {
    type: DynamicFieldTypeEnum.Switch,
    name: "featured",
    label: "Featured",
    fieldSchema: yup.boolean().required(),
    fieldProps: { checkedLabel: "Yes", uncheckedLabel: "No" },
  },
];

const handleSubmit = async (values: FormValues) => {
  console.log(values);
};

export function Page() {
  return (
    <DynamicForm<FormValues>
      variant="default"
      title="Create item"
      description="Typed field config with enum usage."
      fields={fields}
      submitLabel="Save"
      cancelLabel="Cancel"
      onSubmit={handleSubmit}
    />
  );
}`;

  return (
    <DemoPageShell
      title="Inline View"
      description="Use the default variant when the form should live directly inside the page layout, without overlays."
      setup="This example demonstrates a create-style inline form using field-level validation (`fieldSchema`) and enum-based field types."
    >
      <ExamplePreviewCodeFlip
        view={
          <DynamicForm<FormValues>
            variant="default"
            title="Create profile"
            description="Inline form with avatar, tags, and status switch."
            fields={fields}
            submitLabel="Submit"
            cancelLabel="Cancel"
            onSubmit={async (values) => {
              // eslint-disable-next-line no-alert
              alert(JSON.stringify(values, null, 2));
            }}
          />
        }
        code={code}
      />
    </DemoPageShell>
  );
}
