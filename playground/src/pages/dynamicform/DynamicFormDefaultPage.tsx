import { DynamicForm } from "@thabeut/react-data-kit";
import { useTranslation } from "react-i18next";
import { DemoPageShell } from "../../components/DemoPageShell";
import { ExamplePreviewCodeFlip } from "../../components/ExamplePreviewCodeFlip";
import { useDynamicFormFields, type FormValues } from "./shared";

export function DynamicFormDefaultPage() {
  const { t } = useTranslation();
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
    type: DynamicFieldTypeEnum.Select,
    name: "country",
    label: "Country",
    fieldProps: {
      options: [
        { value: "us", label: "United States" },
        { value: "fr", label: "France" },
      ],
    },
    fieldSchema: yup.string().required("Country is required"),
  },
  {
    type: DynamicFieldTypeEnum.AsyncSelect,
    name: "cityId",
    label: "City",
    dependsOn: { field: "country", effect: "show", resetOnHide: true },
    queryDependsOn: {
      fields: "country",
      buildParams: ({ values, params }) => ({
        ...params,
        country: values.country,
      }),
    },
    fieldSchema: yup.string().required("City is required"),
    fieldProps: {
      loadOptions: loadCityOptions,
      getOptionLabel: (item) => item.label,
      getOptionValue: (item) => item.id,
    },
  },
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
  {
    type: DynamicFieldTypeEnum.Custom,
    name: "customPreview",
    label: "Custom preview",
    dependsOn: {
      field: ["country", "name"],
      effect: "disable",
      when: (values) => Boolean(values.country),
    },
    render: (_form, { disabled, values }) => (
      <div style={{ opacity: disabled ? 0.55 : 1 }}>
        <div>Country: {String(values.country ?? "-")}</div>
        <div>Name: {String(values.name ?? "-")}</div>
      </div>
    ),
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
      title={t("dfDefaultViewTitle")}
      description={`${t("dfDefaultViewDescription")} Includes dependency examples: show/hide, disable, and async query params sourced from other fields.`}
      setup={t("dfDefaultViewSetup")}
    >
      <ExamplePreviewCodeFlip
        view={
          <DynamicForm<FormValues>
            variant="default"
            title={t("dfCreateProfileTitle")}
            description={t("dfInlineFormDesc")}
            fields={fields}
            submitLabel={t("dfSubmit")}
            cancelLabel={t("cancel")}
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
