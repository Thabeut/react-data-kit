import { useMemo, useState } from "react";
import { Button, Input, Space, Typography } from "antd";
import {
  DynamicForm,
  type DynamicFormCustomColors,
} from "@thabeut/react-data-kit";
import { DemoPageShell } from "../../components/DemoPageShell";
import { ExamplePreviewCodeFlip } from "../../components/ExamplePreviewCodeFlip";
import { useDynamicFormFields, type FormValues } from "./shared";

const { Text } = Typography;

const defaults: DynamicFormCustomColors = {
  primaryColor: "#0ea5e9",
  lightMode: {
    surfaceBg: "#f0f9ff",
    popoverBg: "#ecfeff",
    popoverOptionHoverBg: "#eff6ff",
    surfaceBorder: "#7dd3fc",
    textPrimary: "#0f172a",
    textSecondary: "#64748b",
  },
  darkMode: {
    surfaceBg: "#0b2537",
    popoverBg: "#0f3348",
    popoverOptionHoverBg: "#1a4158",
    surfaceBorder: "#0284c7",
    textPrimary: "#e0f2fe",
    textSecondary: "#94a3b8",
  },
};

export function DynamicFormColorsPage() {
  const fields = useDynamicFormFields();
  const [colors, setColors] = useState<DynamicFormCustomColors>(defaults);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const customColors: DynamicFormCustomColors = useMemo(() => colors, [colors]);

  const code = String.raw`import { useState } from "react";
import * as yup from "yup";
import {
  DynamicForm,
  DynamicFieldTypeEnum,
  type DynamicFormCustomColors,
  type DynamicFormField,
} from "@thabeut/react-data-kit";

type FormValues = {
  name: string | undefined;
  status: string | undefined;
};

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

const customColors: DynamicFormCustomColors = {
  primaryColor: "#0ea5e9",
  lightMode: {
    surfaceBg: "#f0f9ff",
    popoverBg: "#ecfeff",
    popoverOptionHoverBg: "#eff6ff",
    surfaceBorder: "#7dd3fc",
    textPrimary: "#0f172a",
    textSecondary: "#64748b",
  },
  darkMode: {
    surfaceBg: "#0b2537",
    popoverBg: "#0f3348",
    popoverOptionHoverBg: "#1a4158",
    surfaceBorder: "#0284c7",
    textPrimary: "#e0f2fe",
    textSecondary: "#94a3b8",
  },
};

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
        title="Custom colors form"
        fields={fields}
        submitLabel="Save"
        cancelLabel="Cancel"
        customColors={customColors}
        onSubmit={handleSubmit}
      />
    </>
  );
}`;

  return (
    <DemoPageShell
      title="Theming and Colors"
      description="Customize DynamicForm color tokens for light and dark mode via `customColors`, including popovers and interactive controls."
      setup="Adjust the token inputs below and preview the same palette across inline, modal, and drawer variants to validate consistency."
    >
      <ExamplePreviewCodeFlip
        view={
          <>
            <Space
              wrap
              size={12}
              style={{ marginBottom: 16, alignItems: "end" }}
            >
              <label>
                <Text>Primary</Text>
                <Input
                  type="color"
                  value={colors.primaryColor}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      primaryColor: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <Text>Light surface</Text>
                <Input
                  type="color"
                  value={colors.lightMode?.surfaceBg}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      lightMode: {
                        ...prev.lightMode,
                        surfaceBg: e.target.value,
                      },
                    }))
                  }
                />
              </label>
              <label>
                <Text>Light popover</Text>
                <Input
                  type="color"
                  value={colors.lightMode?.popoverBg}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      lightMode: {
                        ...prev.lightMode,
                        popoverBg: e.target.value,
                      },
                    }))
                  }
                />
              </label>
              <label>
                <Text>Light popover hover</Text>
                <Input
                  type="color"
                  value={colors.lightMode?.popoverOptionHoverBg}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      lightMode: {
                        ...prev.lightMode,
                        popoverOptionHoverBg: e.target.value,
                      },
                    }))
                  }
                />
              </label>
              <label>
                <Text>Light border</Text>
                <Input
                  type="color"
                  value={colors.lightMode?.surfaceBorder}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      lightMode: {
                        ...prev.lightMode,
                        surfaceBorder: e.target.value,
                      },
                    }))
                  }
                />
              </label>
              <label>
                <Text>Light text</Text>
                <Input
                  type="color"
                  value={colors.lightMode?.textPrimary}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      lightMode: {
                        ...prev.lightMode,
                        textPrimary: e.target.value,
                      },
                    }))
                  }
                />
              </label>
              <label>
                <Text>Light muted</Text>
                <Input
                  type="color"
                  value={colors.lightMode?.textSecondary}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      lightMode: {
                        ...prev.lightMode,
                        textSecondary: e.target.value,
                      },
                    }))
                  }
                />
              </label>
              <label>
                <Text>Dark surface</Text>
                <Input
                  type="color"
                  value={colors.darkMode?.surfaceBg}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      darkMode: { ...prev.darkMode, surfaceBg: e.target.value },
                    }))
                  }
                />
              </label>
              <label>
                <Text>Dark popover</Text>
                <Input
                  type="color"
                  value={colors.darkMode?.popoverBg}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      darkMode: { ...prev.darkMode, popoverBg: e.target.value },
                    }))
                  }
                />
              </label>
              <label>
                <Text>Dark popover hover</Text>
                <Input
                  type="color"
                  value={colors.darkMode?.popoverOptionHoverBg}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      darkMode: {
                        ...prev.darkMode,
                        popoverOptionHoverBg: e.target.value,
                      },
                    }))
                  }
                />
              </label>
              <label>
                <Text>Dark border</Text>
                <Input
                  type="color"
                  value={colors.darkMode?.surfaceBorder}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      darkMode: {
                        ...prev.darkMode,
                        surfaceBorder: e.target.value,
                      },
                    }))
                  }
                />
              </label>
              <label>
                <Text>Dark text</Text>
                <Input
                  type="color"
                  value={colors.darkMode?.textPrimary}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      darkMode: {
                        ...prev.darkMode,
                        textPrimary: e.target.value,
                      },
                    }))
                  }
                />
              </label>
              <label>
                <Text>Dark muted</Text>
                <Input
                  type="color"
                  value={colors.darkMode?.textSecondary}
                  onChange={(e) =>
                    setColors((prev) => ({
                      ...prev,
                      darkMode: {
                        ...prev.darkMode,
                        textSecondary: e.target.value,
                      },
                    }))
                  }
                />
              </label>
              <Button onClick={() => setColors(defaults)}>Reset</Button>
              <Button onClick={() => setOpenModal(true)}>Open modal</Button>
              <Button onClick={() => setOpenDrawer(true)}>Open drawer</Button>
            </Space>

            <DynamicForm<FormValues>
              variant="default"
              title="Create profile"
              description="Inline variant with live color token overrides."
              fields={fields}
              submitLabel="Submit"
              cancelLabel="Cancel"
              customColors={customColors}
              onSubmit={async (values) => {
                // eslint-disable-next-line no-alert
                alert(JSON.stringify(values, null, 2));
              }}
            />

            <DynamicForm<FormValues>
              variant="modal"
              open={openModal}
              onClose={() => setOpenModal(false)}
              title="Create profile (Modal)"
              description="Modal variant using the same custom color tokens."
              fields={fields}
              submitLabel="Submit"
              cancelLabel="Cancel"
              customColors={customColors}
              onSubmit={async (values) => {
                // eslint-disable-next-line no-alert
                alert(JSON.stringify(values, null, 2));
              }}
            />

            <DynamicForm<FormValues>
              variant="drawer"
              open={openDrawer}
              onClose={() => setOpenDrawer(false)}
              title="Create profile (Drawer)"
              description="Drawer variant using the same custom color tokens."
              fields={fields}
              submitLabel="Submit"
              cancelLabel="Cancel"
              customColors={customColors}
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
