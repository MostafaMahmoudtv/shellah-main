import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Layout from "../../../components/Dashboard/Layout";
import { useTranslation } from "react-i18next";
import styles from "./SendNotification.module.css";

function SendNotification() {
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // ================= TOKEN CHECK =================
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: t("alert_warning"),
        text: t("alert_login_required"),
        confirmButtonText: t("btn_ok"),
      });
      return;
    }

    // ================= VALIDATION =================
    if (!title.trim()) {
      Swal.fire({
        icon: "warning",
        title: t("alert_warning"),
        text: t("notif_enter_title"),
        confirmButtonText: t("btn_ok"),
      });
      return;
    }

    if (!message.trim()) {
      Swal.fire({
        icon: "warning",
        title: t("alert_warning"),
        text: t("notif_enter_message"),
        confirmButtonText: t("btn_ok"),
      });
      return;
    }

    // ================= REQUEST =================
    try {
      setLoading(true);

      const res = await axios.post(
        "https://api.echeile.com/api/admin/send-notification",
        {
          title: title.trim(),
          message: message.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      Swal.fire({
        icon: "success",
        title: t("alert_success"),
        text: res.data.message || t("notif_success"),
        confirmButtonText: t("btn_ok"),
        confirmButtonColor: "#198754",
      });

      setTitle("");
      setMessage("");
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: t("alert_failed"),
        text:
          error?.response?.data?.message || error?.message || t("notif_error"),
        confirmButtonText: t("btn_ok"),
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className={styles.notificationPage}>
        <div className={styles.notificationContainer}>
          <div className={styles.notificationCard}>
            <div className={styles.notificationCardBody}>
              <h2 className={styles.notificationTitle}>
                {t("notif_send_to_all")}
              </h2>

              <form onSubmit={handleSubmit} className={styles.notificationForm}>
                {/* TITLE */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>{t("notif_title")}</label>

                  <input
                    type="text"
                    className={styles.inputField}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t("notif_title_placeholder")}
                  />
                </div>

                {/* MESSAGE */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    {t("notif_message")}
                  </label>

                  <textarea
                    rows="6"
                    className={styles.textareaField}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t("notif_message_placeholder")}
                  />
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  className={`${styles.submitButton} ${styles.fullWidth}`}
                  disabled={loading}
                >
                  {loading ? t("notif_sending") : t("notif_send")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default SendNotification;
