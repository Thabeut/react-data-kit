import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Button,
  Card,
  Divider,
  Input,
  InputNumber,
  Space,
  Switch,
  Tag,
  Typography,
  message,
} from "antd";
import { DataTable, type DataTableColumnInfo } from "@thabeut/react-data-kit";
import { DemoPageShell } from "../../components/DemoPageShell";
import { buildLargeRows } from "../../data";
import "./datatable-playground-page.css";

const { Text, Paragraph } = Typography;

const SAMPLE_ROWS_JSON = `[
  { "id": 1, "name": "Ada Lovelace", "email": "ada@example.com", "role": "Engineer", "status": "Active" },
  { "id": 2, "name": "Alan Turing", "email": "alan@example.com", "role": "Researcher", "status": "Active" },
  { "id": 3, "name": "Grace Hopper", "email": "grace@example.com", "role": "Engineer", "status": "Away" },
  { "id": 4, "name": "Margaret Hamilton", "email": "margaret@example.com", "role": "Lead", "status": "Active" },
  { "id": 5, "name": "Barbara Liskov", "email": "barbara@example.com", "role": "Researcher", "status": "Active" },
  { "id": 6, "name": "Edsger Dijkstra", "email": "edsger@example.com", "role": "Researcher", "status": "Inactive" },
  { "id": 7, "name": "Donald Knuth", "email": "don@example.com", "role": "Author", "status": "Active" },
  { "id": 8, "name": "Ken Thompson", "email": "ken@example.com", "role": "Engineer", "status": "Away" }
]`;

const SAMPLE_COLUMNS_JSON = `[
  { "id": "name", "label": "Name", "dataIndex": "name" },
  { "id": "email", "label": "Email", "dataIndex": "email" },
  { "id": "role", "label": "Role", "dataIndex": "role" },
  { "id": "status", "label": "Status", "dataIndex": "status" }
]`;

function humanizeKey(key: string): string {
  const spaced = key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function parseRowsJson(
  text: string,
): { ok: true; rows: Record<string, unknown>[] } | { ok: false; error: string } {
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: false, error: "empty" };
  }
  try {
    const v = JSON.parse(trimmed) as unknown;
    if (!Array.isArray(v)) {
      return { ok: false, error: "notArray" };
    }
    for (let i = 0; i < v.length; i++) {
      const row = v[i];
      if (row === null || typeof row !== "object" || Array.isArray(row)) {
        return { ok: false, error: "rowNotObject" };
      }
    }
    return { ok: true, rows: v as Record<string, unknown>[] };
  } catch {
    return { ok: false, error: "json" };
  }
}

function parseColumnsJson(
  text: string,
):
  | { ok: true; cols: DataTableColumnInfo<Record<string, unknown>>[] }
  | { ok: false; error: string } {
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: true, cols: [] };
  }
  try {
    const v = JSON.parse(trimmed) as unknown;
    if (!Array.isArray(v)) {
      return { ok: false, error: "notArray" };
    }
    for (const item of v) {
      if (
        !item ||
        typeof item !== "object" ||
        !("id" in item) ||
        !("label" in item) ||
        !("dataIndex" in item)
      ) {
        return { ok: false, error: "columnShape" };
      }
    }
    return {
      ok: true,
      cols: v as DataTableColumnInfo<Record<string, unknown>>[],
    };
  } catch {
    return { ok: false, error: "json" };
  }
}

function inferColumns(
  rows: Record<string, unknown>[],
): DataTableColumnInfo<Record<string, unknown>>[] {
  if (rows.length === 0) return [];
  const keys = Object.keys(rows[0]);
  return keys.map((k) => ({
    id: k,
    label: humanizeKey(k),
    dataIndex: k,
  }));
}

function parsePageSizeOptions(raw: string): number[] {
  const nums = raw
    .split(/[\s,]+/)
    .map((x) => parseInt(x.trim(), 10))
    .filter((n) => !Number.isNaN(n) && n > 0);
  const uniq = [...new Set(nums)].sort((a, b) => a - b);
  return uniq.length ? uniq : [10, 20, 50];
}

export function DataTablePlaygroundPage() {
  const { t } = useTranslation();
  const [rowsText, setRowsText] = useState(SAMPLE_ROWS_JSON);
  const [columnsText, setColumnsText] = useState("");
  const [rowKeyField, setRowKeyField] = useState("id");
  const [tableId, setTableId] = useState("playground-live");

  const [loading, setLoading] = useState(false);
  const [columnResize, setColumnResize] = useState(true);
  const [disableSelectionAndBookmark, setDisableSelectionAndBookmark] =
    useState(false);
  const [hideColumnOptions, setHideColumnOptions] = useState(false);
  const [limitHeight, setLimitHeight] = useState(true);
  const [maxTableHeight, setMaxTableHeight] = useState("min(380px, 52vh)");
  const [searchEnabled, setSearchEnabled] = useState(true);
  const [searchPlaceholder, setSearchPlaceholder] = useState("");
  const [showToolbarSlots, setShowToolbarSlots] = useState(true);
  const [showActions, setShowActions] = useState(true);
  const [showRefresh, setShowRefresh] = useState(true);

  const [pageSizeOptionsRaw, setPageSizeOptionsRaw] = useState("10, 20, 50");
  const [defaultPageSize, setDefaultPageSize] = useState(10);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([]);
  const [bookmarkedKeys, setBookmarkedKeys] = useState<(string | number)[]>(
    [],
  );
  const [lastClicked, setLastClicked] = useState<Record<
    string,
    unknown
  > | null>(null);

  const rowsParse = useMemo(() => parseRowsJson(rowsText), [rowsText]);
  const columnsParse = useMemo(() => parseColumnsJson(columnsText), [columnsText]);

  const columnsInfo = useMemo((): DataTableColumnInfo<
    Record<string, unknown>
  >[] => {
    if (!rowsParse.ok || !columnsParse.ok) {
      return [{ id: "_", label: "—", dataIndex: "_" }];
    }
    if (columnsParse.cols.length > 0) {
      return columnsParse.cols;
    }
    if (rowsParse.rows.length > 0) {
      return inferColumns(rowsParse.rows);
    }
    return [{ id: "_empty", label: "—", dataIndex: "_empty" }];
  }, [rowsParse, columnsParse]);

  const filteredRows = useMemo(() => {
    if (!rowsParse.ok) return [];
    const needle = searchQuery.trim().toLowerCase();
    if (!searchEnabled || !needle) return rowsParse.rows;
    return rowsParse.rows.filter((row) =>
      Object.values(row).some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(needle),
      ),
    );
  }, [rowsParse, searchEnabled, searchQuery]);

  const rowKeyMissing = useMemo(() => {
    if (!rowsParse.ok) return false;
    const k = rowKeyField.trim();
    if (!k) return true;
    return rowsParse.rows.some((r) => r[k] === undefined);
  }, [rowsParse, rowKeyField]);

  const pageSizeOptions = useMemo(
    () => parsePageSizeOptions(pageSizeOptionsRaw),
    [pageSizeOptionsRaw],
  );

  const paginationDefault = useMemo(() => {
    const opts = pageSizeOptions;
    const d = opts.includes(defaultPageSize)
      ? defaultPageSize
      : opts[0] ?? 10;
    return d;
  }, [pageSizeOptions, defaultPageSize]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, rowsText, columnsText]);

  useEffect(() => {
    if (!pageSizeOptions.includes(pageSize)) {
      setPageSize(paginationDefault);
    }
  }, [pageSizeOptions, paginationDefault, pageSize]);

  const maxPage = Math.max(
    1,
    Math.ceil(filteredRows.length / Math.max(1, pageSize)),
  );

  useEffect(() => {
    if (page > maxPage) setPage(maxPage);
  }, [page, maxPage]);

  const canRenderTable = rowsParse.ok && columnsParse.ok;

  const formatRowsJson = useCallback(() => {
    const p = parseRowsJson(rowsText);
    if (!p.ok) {
      message.error(t(`dtPlaygroundErr_${p.error}`));
      return;
    }
    setRowsText(JSON.stringify(p.rows, null, 2));
    message.success(t("dtPlaygroundFormatOk"));
  }, [rowsText, t]);

  const formatColumnsJson = useCallback(() => {
    const trimmed = columnsText.trim();
    if (!trimmed) {
      message.info(t("dtPlaygroundColumnsEmpty"));
      return;
    }
    const p = parseColumnsJson(columnsText);
    if (!p.ok) {
      message.error(t(`dtPlaygroundColErr_${p.error}`));
      return;
    }
    setColumnsText(JSON.stringify(p.cols, null, 2));
    message.success(t("dtPlaygroundFormatOk"));
  }, [columnsText, t]);

  const loadSample = useCallback(() => {
    setRowsText(SAMPLE_ROWS_JSON);
    setColumnsText("");
    setRowKeyField("id");
    message.success(t("dtPlaygroundSampleLoaded"));
  }, [t]);

  const loadSampleColumns = useCallback(() => {
    setColumnsText(SAMPLE_COLUMNS_JSON);
    message.success(t("dtPlaygroundColumnsSampleLoaded"));
  }, [t]);

  const loadLargeSample = useCallback(() => {
    const rows = buildLargeRows(24);
    setRowsText(JSON.stringify(rows, null, 2));
    setColumnsText("");
    setRowKeyField("id");
    message.success(t("dtPlaygroundLargeLoaded"));
  }, [t]);

  const applyValidate = useCallback(() => {
    const r = parseRowsJson(rowsText);
    const c = parseColumnsJson(columnsText);
    if (!r.ok) {
      message.error(t(`dtPlaygroundErr_${r.error}`));
      return;
    }
    if (!c.ok) {
      message.error(t(`dtPlaygroundColErr_${c.error}`));
      return;
    }
    if (rowKeyField.trim() && r.rows.some((row) => row[rowKeyField] === undefined)) {
      message.warning(t("dtPlaygroundWarnRowKey"));
    } else {
      message.success(t("dtPlaygroundValidateOk"));
    }
  }, [rowsText, columnsText, rowKeyField, t]);

  const rowsErrorKey = rowsParse.ok
    ? null
    : (`dtPlaygroundErr_${rowsParse.error}` as const);

  const colErrorKey = columnsParse.ok
    ? null
    : (`dtPlaygroundColErr_${columnsParse.error}` as const);

  return (
    <DemoPageShell
      title={t("dtPagePlaygroundTitle")}
      description={t("dtPagePlaygroundDesc")}
      setup={t("dtPagePlaygroundSetup")}
    >
      <div className="dt-playground">
        <div className="dt-playground__grid">
          <div className="dt-playground__panel">
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Card size="small" title={t("dtPlaygroundCardData")}>
                <Paragraph type="secondary" style={{ marginBottom: 12 }}>
                  {t("dtPlaygroundRowsHelp")}
                </Paragraph>
                <Input.TextArea
                  className="dt-playground__textarea"
                  value={rowsText}
                  onChange={(e) => setRowsText(e.target.value)}
                  rows={14}
                  spellCheck={false}
                />
                <div
                  className="dt-playground__toolbar-btns"
                  style={{ marginTop: 12 }}
                >
                  <Button type="primary" onClick={applyValidate}>
                    {t("dtPlaygroundValidateBtn")}
                  </Button>
                  <Button onClick={formatRowsJson}>
                    {t("dtPlaygroundFormatRows")}
                  </Button>
                  <Button onClick={loadSample}>{t("dtPlaygroundLoadSample")}</Button>
                  <Button onClick={loadLargeSample}>
                    {t("dtPlaygroundLoadLarge")}
                  </Button>
                </div>
                {rowsErrorKey ? (
                  <Alert
                    type="error"
                    showIcon
                    message={t(rowsErrorKey)}
                    style={{ marginTop: 12 }}
                  />
                ) : rowsParse.ok ? (
                  <Alert
                    type="success"
                    showIcon
                    message={t("dtPlaygroundRowsOk", {
                      count: rowsParse.rows.length,
                    })}
                    style={{ marginTop: 12 }}
                  />
                ) : null}
              </Card>

              <Card size="small" title={t("dtPlaygroundCardColumns")}>
                <Paragraph type="secondary" style={{ marginBottom: 12 }}>
                  {t("dtPlaygroundColumnsHelp")}
                </Paragraph>
                <Input.TextArea
                  className="dt-playground__textarea"
                  value={columnsText}
                  onChange={(e) => setColumnsText(e.target.value)}
                  placeholder={t("dtPlaygroundColumnsPlaceholder")}
                  rows={8}
                  spellCheck={false}
                />
                <div
                  className="dt-playground__toolbar-btns"
                  style={{ marginTop: 12 }}
                >
                  <Button onClick={formatColumnsJson}>
                    {t("dtPlaygroundFormatColumns")}
                  </Button>
                  <Button onClick={loadSampleColumns}>
                    {t("dtPlaygroundLoadColumnsSample")}
                  </Button>
                </div>
                {colErrorKey ? (
                  <Alert
                    type="error"
                    showIcon
                    message={t(colErrorKey)}
                    style={{ marginTop: 12 }}
                  />
                ) : null}
              </Card>

              <Card size="small" title={t("dtPlaygroundCardKeys")}>
                <Space direction="vertical" style={{ width: "100%" }} size="small">
                  <div>
                    <Text type="secondary">{t("dtPlaygroundRowKey")}</Text>
                    <Input
                      value={rowKeyField}
                      onChange={(e) => setRowKeyField(e.target.value)}
                      placeholder="id"
                      style={{ marginTop: 6 }}
                    />
                  </div>
                  <div>
                    <Text type="secondary">{t("dtPlaygroundTableId")}</Text>
                    <Input
                      value={tableId}
                      onChange={(e) => setTableId(e.target.value)}
                      style={{ marginTop: 6 }}
                    />
                  </div>
                </Space>
              </Card>

              <Card size="small" title={t("dtPlaygroundCardToggles")}>
                <p className="dt-playground__panel-head">
                  {t("dtPlaygroundSectionDisplay")}
                </p>
                <div className="dt-playground__switch-grid">
                  <label className="dt-playground__switch-item">
                    <span>{t("dtPlaygroundTLoading")}</span>
                    <Switch checked={loading} onChange={setLoading} />
                  </label>
                  <label className="dt-playground__switch-item">
                    <span>{t("dtPlaygroundTResize")}</span>
                    <Switch checked={columnResize} onChange={setColumnResize} />
                  </label>
                  <label className="dt-playground__switch-item">
                    <span>{t("dtPlaygroundTNoSel")}</span>
                    <Switch
                      checked={disableSelectionAndBookmark}
                      onChange={setDisableSelectionAndBookmark}
                    />
                  </label>
                  <label className="dt-playground__switch-item">
                    <span>{t("dtPlaygroundTHideCol")}</span>
                    <Switch
                      checked={hideColumnOptions}
                      onChange={setHideColumnOptions}
                    />
                  </label>
                  <label className="dt-playground__switch-item">
                    <span>{t("dtPlaygroundTMaxH")}</span>
                    <Switch checked={limitHeight} onChange={setLimitHeight} />
                  </label>
                  <label className="dt-playground__switch-item">
                    <span>{t("dtPlaygroundTSearch")}</span>
                    <Switch checked={searchEnabled} onChange={setSearchEnabled} />
                  </label>
                  <label className="dt-playground__switch-item">
                    <span>{t("dtPlaygroundTToolbar")}</span>
                    <Switch
                      checked={showToolbarSlots}
                      onChange={setShowToolbarSlots}
                    />
                  </label>
                  <label className="dt-playground__switch-item">
                    <span>{t("dtPlaygroundTActions")}</span>
                    <Switch checked={showActions} onChange={setShowActions} />
                  </label>
                  <label className="dt-playground__switch-item">
                    <span>{t("dtPlaygroundTRefresh")}</span>
                    <Switch checked={showRefresh} onChange={setShowRefresh} />
                  </label>
                </div>

                {limitHeight ? (
                  <>
                    <Divider style={{ margin: "16px 0" }} />
                    <Text type="secondary">{t("dtPlaygroundMaxHeight")}</Text>
                    <Input
                      value={maxTableHeight}
                      onChange={(e) => setMaxTableHeight(e.target.value)}
                      style={{ marginTop: 6 }}
                      placeholder="min(380px, 52vh)"
                    />
                  </>
                ) : null}

                <Divider style={{ margin: "16px 0" }} />
                <p className="dt-playground__panel-head">
                  {t("dtPlaygroundSectionPagination")}
                </p>
                <Space direction="vertical" style={{ width: "100%" }} size="small">
                  <div>
                    <Text type="secondary">{t("dtPlaygroundPageSizes")}</Text>
                    <Input
                      value={pageSizeOptionsRaw}
                      onChange={(e) => setPageSizeOptionsRaw(e.target.value)}
                      style={{ marginTop: 6 }}
                    />
                  </div>
                  <div>
                    <Text type="secondary">{t("dtPlaygroundDefaultPageSize")}</Text>
                    <InputNumber
                      min={1}
                      value={defaultPageSize}
                      onChange={(v) => setDefaultPageSize(v ?? 10)}
                      style={{ marginTop: 6, width: "100%" }}
                    />
                  </div>
                </Space>

                <Divider style={{ margin: "16px 0" }} />
                <p className="dt-playground__panel-head">
                  {t("dtPlaygroundSectionSearch")}
                </p>
                <div>
                  <Text type="secondary">{t("dtPlaygroundSearchPh")}</Text>
                  <Input
                    value={searchPlaceholder}
                    onChange={(e) => setSearchPlaceholder(e.target.value)}
                    style={{ marginTop: 6 }}
                    disabled={!searchEnabled}
                  />
                </div>
              </Card>
            </Space>
          </div>

          <div className="dt-playground__preview">
            <Card size="small" title={t("dtPlaygroundPreviewTitle")}>
              {rowKeyMissing ? (
                <Alert
                  type="warning"
                  showIcon
                  message={t("dtPlaygroundWarnRowKey")}
                  style={{ marginBottom: 16 }}
                />
              ) : null}

              {!canRenderTable ? (
                <Paragraph type="secondary">
                  {t("dtPlaygroundFixJsonHint")}
                </Paragraph>
              ) : (
                <>
                  {!disableSelectionAndBookmark ? (
                    <div className="dt-playground__echo">
                      <span>
                        <Text type="secondary">{t("dtSelectionState")}: </Text>
                        <code>
                          {selectedKeys.length
                            ? selectedKeys.join(", ")
                            : "—"}
                        </code>
                      </span>
                      <span>
                        <Text type="secondary">{t("dtBookmarkState")}: </Text>
                        <code>
                          {bookmarkedKeys.length
                            ? bookmarkedKeys.join(", ")
                            : "—"}
                        </code>
                      </span>
                    </div>
                  ) : null}

                  <div className="dt-playground__echo">
                    <span>
                      <Text type="secondary">{t("dtPlaygroundLastClick")}: </Text>
                      {lastClicked ? (
                        <Text strong>
                          {(rowKeyField.trim() || "id") +
                            ": " +
                            String(
                              lastClicked[rowKeyField.trim() || "id"] ?? "—",
                            )}
                        </Text>
                      ) : (
                        <Text type="secondary">
                          {t("dtPlaygroundLastClickEmpty")}
                        </Text>
                      )}
                    </span>
                  </div>

                  <div className="dt-playground__preview-inner">
                    <DataTable<Record<string, unknown>>
                      className="dt-playground-table"
                      tableId={tableId.trim() || "playground-live"}
                      rowKey={rowKeyField.trim() || "id"}
                      columnResize={columnResize}
                      loading={loading}
                      disableSelectionAndBookmark={disableSelectionAndBookmark}
                      hideColumnOptions={hideColumnOptions}
                      maxTableHeight={limitHeight ? maxTableHeight : undefined}
                      dataSource={filteredRows}
                      columnsInfo={columnsInfo}
                      paginationState={{ page, pageSize }}
                      onPageChange={(p, ps) => {
                        setPage(p);
                        setPageSize(ps);
                      }}
                      pagination={{
                        pageSizeOptions,
                        defaultPageSize: paginationDefault,
                      }}
                      searchValue={searchEnabled ? searchQuery : undefined}
                      onSearch={searchEnabled ? setSearchQuery : undefined}
                      searchPlaceholder={
                        searchPlaceholder.trim() || t("searchByName")
                      }
                      onSelectionChange={(keys) => setSelectedKeys(keys)}
                      onBookmarkChange={(keys) => setBookmarkedKeys(keys)}
                      onRowClick={(row) => setLastClicked(row)}
                      onRefresh={
                        showRefresh
                          ? () => {
                              message.info(t("dtPlaygroundRefreshToast"));
                            }
                          : undefined
                      }
                      renderToolbarLeft={
                        showToolbarSlots ? (
                          <Tag color="processing">
                            {t("dtLayoutToolbarLeftSlot")}
                          </Tag>
                        ) : undefined
                      }
                      renderToolbarRight={
                        showToolbarSlots ? (
                          <Tag>{t("dtLayoutToolbarRightSlot")}</Tag>
                        ) : undefined
                      }
                      actions={
                        showActions
                          ? {
                              onEdit: (row) => {
                                message.info(
                                  `${t("actionEdit")}: ${String(row[rowKeyField.trim()] ?? "")}`,
                                );
                              },
                              onDelete: async (row) => {
                                message.warning(
                                  `${t("actionDelete")}: ${String(row[rowKeyField.trim()] ?? "")}`,
                                );
                              },
                              deleteModalConfig: {
                                title: t("deleteConfirmTitle"),
                                description: t("deleteConfirmDescription"),
                                confirmLabel: t("actionDelete"),
                                cancelLabel: t("cancel"),
                              },
                            }
                          : undefined
                      }
                    />
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DemoPageShell>
  );
}
