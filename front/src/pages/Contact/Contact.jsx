import styles from "./Contact.module.css";

import { useTranslation } from "react-i18next";

import { FaUser } from "react-icons/fa";

import { MdEmail } from "react-icons/md";

const Contact = () => {
  const { t } = useTranslation();

  return (
    <section className={styles["contact-page"]}>
      <div className={styles["contact-container"]}>
        <div className={styles["contact-header"]}>
          <h1>{t("contactTitle")}</h1>

          <p>{t("contactDesc")}</p>
        </div>
        <form
          className={styles["contact-form"]}
          action="https://formcarry.com/s/f7aYpvEbr9m"
          method="post"
        >
          {/* NAME */}
          <div className={styles["input-group"]}>
            <label>{t("name")}</label>

            <div className={styles["input-wrapper"]}>
              <input
                type="text"
                name="name"
                placeholder={t("namePlaceholder")}
                required
                autoComplete="name"
              />
              <FaUser className={styles["input-icon"]} />
            </div>
          </div>

          {/* EMAIL */}
          <div className={styles["input-group"]}>
            <label>{t("email")}</label>

            <div className={styles["input-wrapper"]}>
              <input
                type="email"
                name="email"
                placeholder={t("emailPlaceholder")}
                required
                autoComplete="email"
              />
              <MdEmail className={styles["input-icon"]} />
            </div>
          </div>

          {/* MESSAGE */}
          <div className={styles["input-group"]}>
            <label>{t("message")}</label>

            <textarea
              name="message"
              rows="6"
              placeholder={t("messagePlaceholder")}
              required
            />
          </div>

          <button type="submit">{t("send")}</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
