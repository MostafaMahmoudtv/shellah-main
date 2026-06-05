import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiLock, FiSave } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import styles from "./Password.module.css";

const API_URL = "https://api.echeile.com";

const Password = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: t("passwordPopupWarningTitle"),
        text: t("fillAllFields"),
        confirmButtonText: t("passwordPopupConfirm"),
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: t("passwordPopupErrorTitle"),
        text: t("passwordsNotMatch"),
        confirmButtonText: t("passwordPopupConfirm"),
      });
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_URL}/api/donors/change-password`,
        {
          currentPassword,
          newPassword,
          confirmNewPassword: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await Swal.fire({
        icon: "success",
        title: t("passwordPopupSuccessTitle"),
        text: response.data?.message || t("passwordChangedSuccess"),
        confirmButtonText: t("passwordPopupConfirm"),
      });

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error:", error);

      Swal.fire({
        icon: "error",
        title: t("passwordPopupErrorTitle"),
        text: error.response?.data?.message || t("passwordChangedError"),
        confirmButtonText: t("passwordPopupConfirm"),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles["security-page"]}>
      <div className={styles["security-card"]}>
        <div className={styles["security-header"]}>
          <h2>{t("passwordSecuritySettings")}</h2>
          <p>{t("changePasswordSecurely")}</p>
        </div>

        <form className={styles["security-form"]} onSubmit={handleSubmit}>
          <div className={styles["form-group"]}>
            <label>
              {t("currentPassword")} <span>*</span>
            </label>

            <div className={styles["input-wrapper"]}>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder={t("enterCurrentPassword")}
              />
              <FiLock className={styles["icon"]} />
            </div>
          </div>

          <div className={styles["form-group"]}>
            <label>
              {t("newPassword")} <span>*</span>
            </label>

            <div className={styles["input-wrapper"]}>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder={t("enterNewPassword")}
              />
              <FiLock className={styles["icon"]} />
            </div>
          </div>

          <div className={styles["form-group"]}>
            <label>
              {t("confirmPassword")} <span>*</span>
            </label>

            <div className={styles["input-wrapper"]}>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={t("confirmNewPassword")}
              />
              <FiLock className={styles["icon"]} />
            </div>
          </div>

          <button
            type="submit"
            className={styles["save-btn"]}
            disabled={saving}
          >
            <FiSave />
            {saving ? t("saving") : t("save")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Password;
