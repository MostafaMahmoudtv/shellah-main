import { FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import styles from "./SettingsPage.module.css";

const API_URL = "https://api.echeile.com";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(t("settings.deleteConfirm"));

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(`${API_URL}/api/donors/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);

      alert(t("settings.deleteSuccess"));

      localStorage.removeItem("token");

      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || t("settings.deleteError"));
    }
  };

  return (
    <div className={styles["account-card"]}>
      <div className={styles["account-header"]}>
        <h2>{t("settings.title")}</h2>
        <p>{t("settings.subtitle")}</p>
      </div>

      <div className={styles["account-actions"]}>
        <button className={styles["delete-btn"]} onClick={handleDeleteAccount}>
          <FiTrash2 />
          <span>{t("settings.deleteAccount")}</span>
        </button>
      </div>
    </div>
  );
}
