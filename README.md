# React Data Kit

![React Data Kit logo](https://res.cloudinary.com/df4jaqtep/image/upload/v1774968119/qd0ab0ey07jylsktzka6.png)

[![npm version](https://img.shields.io/npm/v/@thabeut/react-data-kit)](https://www.npmjs.com/package/@thabeut/react-data-kit)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![npm downloads](https://img.shields.io/npm/dm/@thabeut/react-data-kit)](https://www.npmjs.com/package/@thabeut/react-data-kit)
[![GitHub stars](https://img.shields.io/github/stars/Thabeut/react-data-kit?style=social)](https://github.com/Thabeut/react-data-kit)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Thabeut/react-data-kit/blob/main/LICENSE)

TypeScript-first React components for data-heavy UIs: DataTable, QueryTable, DynamicForm, CrudManager, and Infinite Scroll adapters for RTK Query and React Query.

## Install

```bash
npm install @thabeut/react-data-kit
```

## Peer Dependencies

Make sure your app provides the required peers:

- `react` and `react-dom` (18+)
- `antd`
- `react-hook-form`
- `@hookform/resolvers`
- `yup`
- `@iconify/react`
- `clsx`
- `dayjs`
- `i18next`
- `react-i18next`

## Theme Setup (Required)

This package uses `data-theme` on the root HTML element as the single source of truth for dark/light mode styling.

You must keep `document.documentElement` in sync with your app theme state:

```ts
const root = document.documentElement;
root.setAttribute("data-theme", theme); // "light" | "dark"
```

If your app toggles only `html.dark` (class-based theme), package components can appear with mixed styles. Always set `data-theme` to `"light"` or `"dark"`.

## CSS Isolation

Package components scope their styles under a dedicated wrapper class (`root-rdk`) so importing package CSS should not restyle unrelated host app UI.

For app-owned custom overlays (for example a `Modal` you open from DataTable `customActions`), use the package `--rdk-*` CSS variables in your own styling. See `docs/datatable.md` for the variable list and example.

## Documentation

- [DataTable guide](./docs/datatable.md)
- [QueryTable guide](./docs/querytable.md)
- [DynamicForm guide](./docs/dynamic-form.md)
- [CrudManager guide](./docs/crud-manager.md)
- [Infinite Scroll guide](./docs/infinite-scroll.md)

## Playground / Docs Site

- Local playground: run `npm run playground:dev`
- Deployed playground/docs: [https://react-data-kit.vercel.app/](https://react-data-kit.vercel.app/)

## Links

- GitHub repository: [https://github.com/Thabeut/react-data-kit](https://github.com/Thabeut/react-data-kit)
- NPM package: [https://www.npmjs.com/package/@thabeut/react-data-kit](https://www.npmjs.com/package/@thabeut/react-data-kit)
- Hosted docs/playground: [https://react-data-kit.vercel.app/](https://react-data-kit.vercel.app/)

## License

MIT
