import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ar from "../locales/ar/translation.json";
import fr from "../locales/fr/translation.json";

// 👇 نجيب اللغة المحفوظة
const savedLang = localStorage.getItem("lang");

i18n.use(initReactI18next).init({
  resources: {
    ar: {
      translation: ar,
    },
    fr: {
      translation: fr,
    },
  },

  // 👇 هنا أهم تعديل
  lng: savedLang || "ar",

  fallbackLng: "ar",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;