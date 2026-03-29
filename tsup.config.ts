import { defineConfig } from "tsup";
import { sassPlugin } from "esbuild-sass-plugin";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  esbuildPlugins: [sassPlugin()],
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "antd",
    "react-hook-form",
    "@hookform/resolvers",
    "yup",
    "@iconify/react",
    "clsx",
    "dayjs",
    "i18next",
    "react-i18next",
  ],
});
