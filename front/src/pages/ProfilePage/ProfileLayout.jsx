import { Outlet, NavLink } from "react-router-dom";
import { FiUser, FiLock, FiSettings } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import styles from "./ProfilePage.module.css";

const ProfileLayout = () => {
  const { t } = useTranslation();

  return (
    <div className={styles["main-profile-page"]}>
      <div className={styles["settings-layout"]}>

        <div className={styles["profile-content"]}>
          <Outlet />
        </div>

        <aside className={styles["settings-sidebar"]}>
          
          <NavLink
            to="/profile"
            end
            className={styles["sidebar-item"]}
          >
            <FiUser />
            <span>{t("profile.personalInfo")}</span>
          </NavLink>

          <NavLink
            to="/profile/security"
            className={styles["sidebar-item"]}
          >
            <FiLock />
            <span>{t("profile.security")}</span>
          </NavLink>

          <NavLink
            to="/profile/settings"
            className={styles["sidebar-item"]}
          >
            <FiSettings />
            <span>{t("profile.accountSettings")}</span>
          </NavLink>

        </aside>

      </div>
    </div>
  );
};

export default ProfileLayout;