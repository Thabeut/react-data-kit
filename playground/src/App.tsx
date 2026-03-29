import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ConfigProvider, Segmented, Select, theme as antdTheme } from "antd";
import { Icon } from "@iconify/react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { PLAYGROUND_LANG_KEY } from "./i18n";
import {
  PLAYGROUND_THEME_KEY,
  readStoredTheme,
  type PlaygroundColorMode,
} from "./theme-storage";
import { DocsLayout } from "./layout/DocsLayout";
import type { DocsNavGroup } from "./layout/DocsLayout";
import {
  DataTableBasicPage,
  DataTableFiltersPage,
  DataTableGroupsPage,
  DataTablePropsPage,
  DataTableUsersDemoPage,
  DataTableSelectionPage,
  DataTableServerPage,
  DataTableSortPage,
  DataTableColorsPage,
} from "./pages/datatable";
import "antd/dist/reset.css";

const LANGUAGE_OPTIONS: { value: string; label: string }[] = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "ar", label: "العربية" },
];

function readStoredLang(): string {
  if (typeof window === "undefined") return "en";
  return localStorage.getItem(PLAYGROUND_LANG_KEY) ?? "en";
}

function AppShell() {
  const { t, i18n: i18nInstance } = useTranslation();
  const [lang, setLang] = useState<string>(() => readStoredLang());
  const [colorMode, setColorMode] = useState<PlaygroundColorMode>(() =>
    readStoredTheme(),
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", colorMode);
    document.documentElement.classList.toggle("dark", colorMode === "dark");
    localStorage.setItem(PLAYGROUND_THEME_KEY, colorMode);
  }, [colorMode]);

  useEffect(() => {
    void i18nInstance.changeLanguage(lang);
  }, [lang, i18nInstance]);

  useEffect(() => {
    localStorage.setItem(PLAYGROUND_LANG_KEY, i18nInstance.language);
    document.documentElement.dir = i18nInstance.dir();
    document.documentElement.lang = i18nInstance.language;
  }, [i18nInstance.language]);

  const navGroups: DocsNavGroup[] = useMemo(
    () => [
      {
        id: "datatable",
        label: t("docsNavDataTable"),
        children: [
          { to: "/datatable/overview", label: t("dtNavOverview") },
          { to: "/datatable/basic", label: t("dtNavBasic") },
          { to: "/datatable/selection", label: t("dtNavSelection") },
          { to: "/datatable/groups", label: t("dtNavGroups") },
          { to: "/datatable/colors", label: t("dtNavColors") },
          { to: "/datatable/filters", label: t("dtNavFilters") },
          { to: "/datatable/sort", label: t("dtNavSort") },
          { to: "/datatable/server", label: t("dtNavServer") },
          { to: "/datatable/users-demo", label: t("dtNavUsersDemo") },
        ],
      },
    ],
    [t],
  );

  const toolbar = (
    <>
      <Segmented<PlaygroundColorMode>
        className="docs-theme-toggle"
        value={colorMode}
        onChange={setColorMode}
        options={[
          {
            value: "light",
            label: (
              <span title={t("themeLight")}>
                <Icon icon="lucide:sun" width={18} height={18} aria-hidden />
              </span>
            ),
          },
          {
            value: "dark",
            label: (
              <span title={t("themeDark")}>
                <Icon icon="lucide:moon" width={18} height={18} aria-hidden />
              </span>
            ),
          },
        ]}
      />
      <Select<string>
        className="docs-language-select"
        classNames={{ popup: { root: "docs-language-dropdown" } }}
        aria-label={t("languageLabel")}
        style={{ width: 180 }}
        value={lang}
        onChange={setLang}
        options={LANGUAGE_OPTIONS}
      />
    </>
  );

  const dir = i18nInstance.dir() === "rtl" ? "rtl" : "ltr";

  return (
    <ConfigProvider
      direction={dir}
      theme={{
        algorithm:
          colorMode === "dark"
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
      }}
    >
      <DocsLayout
        title={t("docsSiteTitle")}
        packageName="@thabeut/react-data-kit"
        navGroups={navGroups}
        toolbar={toolbar}
      >
        <Outlet />
      </DocsLayout>
    </ConfigProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route
            index
            element={<Navigate to="/datatable/overview" replace />}
          />
          <Route path="datatable/overview" element={<DataTablePropsPage />} />
          <Route path="datatable/basic" element={<DataTableBasicPage />} />
          <Route path="datatable/groups" element={<DataTableGroupsPage />} />
          <Route
            path="datatable/users-demo"
            element={<DataTableUsersDemoPage />}
          />
          <Route path="datatable/filters" element={<DataTableFiltersPage />} />
          <Route
            path="datatable/selection"
            element={<DataTableSelectionPage />}
          />
          <Route path="datatable/server" element={<DataTableServerPage />} />
          <Route path="datatable/sort" element={<DataTableSortPage />} />
          <Route path="datatable/colors" element={<DataTableColorsPage />} />
          <Route
            path="datatable/loading"
            element={<Navigate to="/datatable/overview" replace />}
          />
          <Route
            path="datatable/layout"
            element={<Navigate to="/datatable/overview" replace />}
          />
          <Route
            path="*"
            element={<Navigate to="/datatable/overview" replace />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
