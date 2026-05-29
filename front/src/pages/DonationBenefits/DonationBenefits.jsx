import "./DonationBenefits.css";

import { useTranslation } from "react-i18next";

const DonationBenefits = () => {
  const { t } = useTranslation();

  return (
    <section className="benefits-page">

      <div className="benefits-container">

        <div className="benefits-header">
          <h1>{t("donationBenefitsTitle")}</h1>
        </div>

        {/* الإنسانية */}

        <div className="benefits-section">

          <h2>{t("humanBenefits")}</h2>

          <p>
            {t("humanBenefitsDesc")}
          </p>

        </div>

        {/* الصحية */}

        <div className="benefits-section">

          <h2>{t("healthBenefits")}</h2>

          <ul>

            <li>{t("health1")}</li>

            <li>{t("health2")}</li>

            <li>{t("health3")}</li>

            <li>{t("health4")}</li>

            <li>{t("health5")}</li>

          </ul>

        </div>

        {/* جبال حسنات */}

        <div className="benefits-section">

          <h2>{t("goodDeeds")}</h2>

          <ul>

            <li>{t("deed1")}</li>

            <li>{t("deed2")}</li>

            <li>{t("deed3")}</li>

          </ul>

        </div>

        {/* لماذا اتبرع */}

        <div className="benefits-section">

          <h2>{t("whyDonate")}</h2>

          <ul>

            <li>{t("why1")}</li>

            <li>{t("why2")}</li>

            <li>{t("why3")}</li>

            <li>{t("why4")}</li>

            <li>{t("why5")}</li>

          </ul>

        </div>

      </div>

    </section>
  );
};

export default DonationBenefits;