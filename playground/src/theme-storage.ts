export const PLAYGROUND_THEME_KEY = "react-data-kit-playground-theme";

export type PlaygroundColorMode = "light" | "dark";

export function readStoredTheme(): PlaygroundColorMode {
  if (typeof window === "undefined") return "light";
  const v = localStorage.getItem(PLAYGROUND_THEME_KEY);
  return v === "dark" ? "dark" : "light";
}
