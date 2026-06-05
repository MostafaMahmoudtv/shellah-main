import  styles from "./SupportUs.module.css";

import { useTranslation } from "react-i18next";

const SupportUs = () => {
  const { t } = useTranslation();

  return (
    <section className={styles["support-page"]}>

      <div className={styles["support-container"]}>

        <div className={styles["support-header"]}>
          <h1>{t("supportUsTitle")}</h1>
        </div>

        <div className={styles["support-content"]}>

          <ul>

            <li>{t("support1")}</li>

            <li>{t("support2")}</li>

            <li>{t("support3")}</li>

            <li>{t("support4")}</li>

          </ul>

        </div>

      </div>

    </section>
  );
};

export default SupportUs;