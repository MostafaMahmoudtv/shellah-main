import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import styles from "./LanguageSwitcher.module.css";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  // تحميل اللغة المحفوظة
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");

    if (savedLang) {
      i18n.changeLanguage(savedLang);

      document.documentElement.dir =
        savedLang === "ar" ? "rtl" : "ltr";

      document.documentElement.lang =
        savedLang;
    }
  }, [i18n]);

  // إغلاق الدروب داون عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (
      event
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);

    localStorage.setItem("lang", lang);

    document.documentElement.dir =
      lang === "ar" ? "rtl" : "ltr";

    document.documentElement.lang = lang;

    setOpen(false);
  };

  return (
    <div className={styles.wrapper}>
      {/* زرار الوضع الليلي */}
      <button
        className={styles.themeButton}
        onClick={toggleTheme}
      >
        {theme === "light"
          ? "🌙"
          : "☀️"}
      </button>

      {/* اللغة */}
      <div
        ref={dropdownRef}
        className={styles.languageBox}
      >
        <button
          className={styles.button}
          onClick={() =>
            setOpen(!open)
          }
        >
          🌐{" "}
          {i18n.language === "ar"
            ? "العربية"
            : "Français"}
        </button>

        {open && (
          <div
            className={styles.dropdown}
          >
            <div
              className={`${
                styles.item
              } ${
                i18n.language === "ar"
                  ? styles.active
                  : ""
              }`}
              onClick={() =>
                changeLanguage("ar")
              }
            >
              🇸🇦 العربية
            </div>

            <div
              className={`${
                styles.item
              } ${
                i18n.language === "fr"
                  ? styles.active
                  : ""
              }`}
              onClick={() =>
                changeLanguage("fr")
              }
            >
              🇫🇷 Français
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSwitcher;