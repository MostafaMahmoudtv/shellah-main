import styles from "./Privacy.module.css";

import { useTranslation } from "react-i18next";

const Privacy = () => {
  const { t } = useTranslation();

  return (
    <section className={styles["privacy-page"]}>

      <div className={styles["privacy-container"]}>

        <div className={styles["privacy-header"]}>
          <h1>{t("privacyTitle")}</h1>
        </div>

        <div className={styles["privacy-section"]}>

          <h2>{t("howSiteWorks")}</h2>

          <p>
            {t("privacyText1")}
          </p>

          <p>
            {t("privacyText2")}
          </p>

          <p>
            {t("privacyText3")}
          </p>

          <p>
            {t("privacyText4")}
          </p>

        </div>

      </div>

    </section>
  );
};

export default Privacy;