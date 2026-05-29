import "./About.css";

import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  return (
    <section className="about-page">

      <div className="about-container">

        <div className="about-header">
          <h1>{t("aboutTitle")}</h1>
        </div>

        <div className="about-section">

          <p>
            {t("aboutText1")}
          </p>

          <h2>{t("aboutWebsite")}</h2>

          <p>
            {t("aboutText2")}
          </p>

          <p>
            {t("aboutText3")}
          </p>

          <p>
            {t("aboutText4")}
          </p>

          <p>
            {t("aboutText5")}
          </p>

          <p>
            {t("aboutText6")}
          </p>

        </div>

      </div>

    </section>
  );
};

export default About;