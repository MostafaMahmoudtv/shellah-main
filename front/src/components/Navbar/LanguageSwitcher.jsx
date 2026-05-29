import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (e) => {
    const lang = e.target.value;

    i18n.changeLanguage(lang);

    document.documentElement.dir =
      lang === "ar" ? "rtl" : "ltr";

    document.documentElement.lang = lang;
  };

  return (
    <select
      onChange={changeLanguage}
      value={i18n.language}
    >
      <option value="ar">العربية</option>
      <option value="fr">Français</option>
    </select>
  );
};

export default LanguageSwitcher;