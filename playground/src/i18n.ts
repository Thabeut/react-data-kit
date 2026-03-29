import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "./locales/ar.json";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

const PLAYGROUND_LANG_KEY = "react-data-kit-playground-lang";

const stored =
  typeof window !== "undefined" ? localStorage.getItem(PLAYGROUND_LANG_KEY) : null;
const initialLng = stored && stored.length > 0 ? stored : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar },
  },
  lng: initialLng,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export { PLAYGROUND_LANG_KEY };
export default i18n;
