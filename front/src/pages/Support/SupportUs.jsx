import "./SupportUs.css";

import { useTranslation } from "react-i18next";

const SupportUs = () => {
  const { t } = useTranslation();

  return (
    <section className="support-page">

      <div className="support-container">

        <div className="support-header">
          <h1>{t("supportUsTitle")}</h1>
        </div>

        <div className="support-content">

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