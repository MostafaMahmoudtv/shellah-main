import  styles from "./About.module.css";

import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  return (
    <section className={styles["about-page"]}>

      <div className={styles["about-container"]}>

        <div className={styles["about-header"]}>
          <h1>{t("aboutTitle")}</h1>
        </div>

        <div className={styles["about-section"]}>

          <p>
            {t("aboutText1")}
          </p>
 

        </div>

      </div>

    </section>
  );
};

export default About;