import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  FaTachometerAlt,
  FaUsersCog,
  FaBell,
  FaShieldAlt,
} from "react-icons/fa";

import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  // تغيير اللغة
  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "fr" : "ar";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <aside className={styles.sidebar}>
      {/* Header */}
      <div className={styles.sidebarHeader}>
        <FaShieldAlt className={styles.logoIcon} />
        <h2>{t("adminPanel")}</h2>
      </div>

      {/* Links */}
      <nav className={styles.nav}>
        <Link
          to="/dashboard"
          className={`${styles.sidebarLink} ${
            location.pathname === "/dashboard" ? styles.active : ""
          }`}
        >
          <FaTachometerAlt />
          <span>{t("dashboard")}</span>
        </Link>

        <Link
          to="/dashboard/admins"
          className={`${styles.sidebarLink} ${
            location.pathname === "/dashboard/admins" ? styles.active : ""
          }`}
        >
          <FaUsersCog />
          <span>{t("admins")}</span>
        </Link>

        <Link
          to="/dashboard/notifications"
          className={`${styles.sidebarLink} ${
            location.pathname === "/dashboard/notifications"
              ? styles.active
              : ""
          }`}
        >
          <FaBell />
          <span>{t("sendNotification")}</span>
        </Link>
      </nav>

      {/* Language Switch */}
      <div className={styles.langSwitcher}>
        <button onClick={toggleLanguage} className={styles.langButton}>
          {i18n.language === "ar" ? "FR" : "AR"}
        </button>
      </div>
    </aside>
  );
}