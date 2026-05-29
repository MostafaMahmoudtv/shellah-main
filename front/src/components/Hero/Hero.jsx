import "./Hero.css";

import blood from "../../assets/images/blood.png";

import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="hero">
      <div className="hero-right">
        <h1>{t("title")}</h1>

        <p>{t("heroDesc")}</p>

        <div className="search-box">
          <h3>{t("search")}</h3>

          <div className="filters">
            <select>
              <option>{t("bloodType")}</option>
            </select>

            <select>
              <option>{t("state")}</option>
            </select>

            <select>
              <option>{t("city")}</option>
            </select>

            <button>{t("searchBtn")}</button>
          </div>
        </div>
      </div>
      <div className="hero-left">
        <img src={blood} alt="" />
      </div>
    </section>
  );
};

export default Hero;
