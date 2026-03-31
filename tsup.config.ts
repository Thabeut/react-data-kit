import { defineConfig } from "tsup";
import { sassPlugin } from "esbuild-sass-plugin";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  // Source maps add ~700KB to the published tarball; set SOURCEMAP=true when you need them locally.
  sourcemap: process.env.SOURCEMAP === "true",
  minify: true,
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
