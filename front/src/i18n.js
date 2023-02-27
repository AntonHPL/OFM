import i18n from "i18next";
import Backend from "i18next-http-backend";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(Backend)
  .use(initReactI18next)
  .use(I18nextBrowserLanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "gb",
    whitelist: ["gb", "ru", "ua", "de"],
    debug: false,
    detection: {
      order: ["cookie"],
      cache: ["cookie"]
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;