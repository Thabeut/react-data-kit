import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ConfigProvider, Segmented, Select, theme as antdTheme } from "antd";
import { Icon } from "@iconify/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
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
  DataTableIntroPage,
  DataTableUsersDemoPage,
  DataTableSelectionPage,
  DataTableServerPage,
  DataTableSortPage,
  DataTableColorsPage,
} from "./pages/datatable";
import {
  InfiniteScrollIntroPage,
  InfiniteScrollProductsRtkPage,
  InfiniteScrollProductsReactQueryPage,
} from "./pages/infinite-scroll";
import {
  QueryTablePage,
  QueryTableRtkQueryPage,
  QueryTableReactQueryPage,
} from "./pages/querytable";
import {
  DynamicFormIntroPage,
  DynamicFormDefaultPage,
  DynamicFormModalPage,
  DynamicFormDrawerPage,
  DynamicFormColorsPage,
} from "./pages/dynamicform";
import {
  CrudManagerIntroPage,
  CrudManagerBasicPage,
  CrudManagerModalPage,
} from "./pages/crudmanager";
import { HomePage } from "./pages/home";
import { ContributingGuidePage } from "./pages/contributing/ContributingGuidePage";
import { makeProductsRtkStore } from "./pages/querytable/adapters/useProductsRtkQuery";
import { ICONS } from "./constants/icons";
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
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
            staleTime: 30_000,
            gcTime: 5 * 60_000,
          },
        },
      }),
    [],
  );
  const productsStore = useMemo(() => makeProductsRtkStore(), []);

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
        id: "contributing",
        label: t("docsNavContributing"),
        children: [{ to: "/contributing", label: t("docsNavContributing") }],
      },
      {
        id: "datatable",
        label: t("docsNavDataTable"),
        children: [
          { to: "/datatable/overview", label: t("docsNavIntroduction") },
          { to: "/datatable/basic", label: t("dtNavBasic") },
          { to: "/datatable/selection", label: t("dtNavSelection") },
          { to: "/datatable/groups", label: t("dtNavGroups") },
          { to: "/datatable/colors", label: t("dtNavColors") },
          { to: "/datatable/filters", label: t("dtNavFilters") },
          { to: "/datatable/sort", label: t("dtNavSort") },
          { to: "/datatable/users-demo", label: t("dtNavUsersDemo") },
          { to: "/datatable/server", label: t("dtNavServer") },
        ],
      },
      {
        id: "querytable",
        label: t("docsNavQueryTable"),
        children: [
          { to: "/querytable/overview", label: t("docsNavIntroduction") },
          { to: "/querytable/rtk-query", label: t("docsNavRtkQuery") },
          { to: "/querytable/react-query", label: t("docsNavReactQuery") },
        ],
      },
      {
        id: "dynamicform",
        label: t("docsNavDynamicForm"),
        children: [
          { to: "/dynamicform/overview", label: t("docsNavIntroduction") },
          { to: "/dynamicform/default", label: t("docsNavDefault") },
          { to: "/dynamicform/modal", label: t("docsNavModal") },
          { to: "/dynamicform/drawer", label: t("docsNavDrawer") },
          { to: "/dynamicform/colors", label: t("docsNavColors") },
        ],
      },
      {
        id: "crudmanager",
        label: t("docsNavCrudManager"),
        children: [
          { to: "/crudmanager/overview", label: t("docsNavIntroduction") },
          { to: "/crudmanager/basic", label: t("docsNavDrawerDefault") },
          { to: "/crudmanager/modal", label: t("docsNavModal") },
        ],
      },
      {
        id: "infinitescroll",
        label: t("docsNavInfiniteScroll"),
        children: [
          { to: "/infinite-scroll/overview", label: t("docsNavIntroduction") },
          {
            to: "/infinite-scroll/rtk-query",
            label: t("docsNavRtkQuery"),
          },
          {
            to: "/infinite-scroll/react-query",
            label: t("docsNavReactQuery"),
          },
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
                <Icon icon={ICONS.sun} width={18} height={18} aria-hidden />
              </span>
            ),
          },
          {
            value: "dark",
            label: (
              <span title={t("themeDark")}>
                <Icon icon={ICONS.moon} width={18} height={18} aria-hidden />
              </span>
            ),
          },
        ]}
      />
      <Select<string>
        className="docs-language-select"
        popupClassName="docs-language-dropdown"
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
      <Provider store={productsStore}>
        <QueryClientProvider client={queryClient}>
          <DocsLayout
            title={t("docsSiteTitle")}
            packageName="@thabeut/react-data-kit"
            navGroups={navGroups}
            toolbar={toolbar}
          >
            <Outlet />
          </DocsLayout>
        </QueryClientProvider>
      </Provider>
    </ConfigProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="contributing" element={<ContributingGuidePage />} />
          <Route path="datatable/overview" element={<DataTableIntroPage />} />
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
            path="infinite-scroll/overview"
            element={<InfiniteScrollIntroPage />}
          />
          <Route
            path="infinite-scroll/rtk-query"
            element={<InfiniteScrollProductsRtkPage />}
          />
          <Route
            path="infinite-scroll/react-query"
            element={<InfiniteScrollProductsReactQueryPage />}
          />
          <Route path="querytable/overview" element={<QueryTablePage />} />
          <Route
            path="querytable/rtk-query"
            element={<QueryTableRtkQueryPage />}
          />
          <Route
            path="querytable/react-query"
            element={<QueryTableReactQueryPage />}
          />
          <Route
            path="dynamicform/overview"
            element={<DynamicFormIntroPage />}
          />
          <Route
            path="dynamicform/default"
            element={<DynamicFormDefaultPage />}
          />
          <Route path="dynamicform/modal" element={<DynamicFormModalPage />} />
          <Route
            path="dynamicform/drawer"
            element={<DynamicFormDrawerPage />}
          />
          <Route
            path="dynamicform/colors"
            element={<DynamicFormColorsPage />}
          />
          <Route
            path="crudmanager/overview"
            element={<CrudManagerIntroPage />}
          />
          <Route path="crudmanager/basic" element={<CrudManagerBasicPage />} />
          <Route path="crudmanager/modal" element={<CrudManagerModalPage />} />
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
