import "./Statistics.css";

import { useTranslation } from "react-i18next";

const Statistics = () => {
  const { t } = useTranslation();

  return (
    <section className="statistics-page">

      <div className="statistics-container">

        <div className="statistics-header">
          <h1>{t("statistics")}</h1>
          <p>{t("bloodStats")}</p>
        </div>

        <div className="stats-table">

          <div className="table-row table-head">

            <div>{t("totalDonors")}</div>

            <div>+O</div>
            <div>-O</div>

            <div>+B</div>
            <div>-B</div>

            <div>+A</div>
            <div>-A</div>

            <div>+AB</div>
            <div>-AB</div>

          </div>

          <div className="table-row">

            <div>7385</div>

            <div>2559</div>
            <div>774</div>

            <div>1084</div>
            <div>243</div>

            <div>1821</div>
            <div>410</div>

            <div>403</div>
            <div>91</div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Statistics;