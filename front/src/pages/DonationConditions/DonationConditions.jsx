import "./DonationConditions.css";

import { useTranslation } from "react-i18next";

const DonationConditions = () => {
  const { t } = useTranslation();

  return (
    <section className="conditions-page">

      <div className="conditions-container">

        <div className="conditions-header">
          <h1>{t("donationConditionsTitle")}</h1>
        </div>

        {/* قبل التبرع */}

        <div className="conditions-section">

          <h2>{t("beforeDonation")}</h2>

          <ul>
            <li>{t("before1")}</li>
            <li>{t("before2")}</li>
            <li>{t("before3")}</li>
          </ul>

        </div>

        {/* الأشخاص اللائقون */}

        <div className="conditions-section">

          <h2>{t("eligiblePeople")}</h2>

          <ul>
            <li>{t("eligible1")}</li>
            <li>{t("eligible2")}</li>
            <li>{t("eligible3")}</li>
            <li>{t("eligible4")}</li>
          </ul>

        </div>

        {/* موانع التبرع */}

        <div className="conditions-section">

          <h2>{t("donationRestrictions")}</h2>

          <ul>
            <li>{t("restriction1")}</li>
            <li>{t("restriction2")}</li>
            <li>{t("restriction3")}</li>
          </ul>

        </div>

        {/* المرأة */}

        <div className="conditions-section">

          <h2>{t("womenRestrictions")}</h2>

          <p>{t("womenText")}</p>

        </div>

        {/* مدة التبرع */}

        <div className="conditions-section">

          <h2>{t("donationDuration")}</h2>

          <p>{t("durationText")}</p>

          <p>{t("durationText2")}</p>

        </div>

        {/* التوصيات */}

        <div className="conditions-section">

          <h2>{t("afterDonation")}</h2>

          <ul>
            <li>{t("after1")}</li>
            <li>{t("after2")}</li>
            <li>{t("after3")}</li>
          </ul>

        </div>

      </div>

    </section>
  );
};

export default DonationConditions;