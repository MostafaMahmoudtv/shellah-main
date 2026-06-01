import "./Hero.css";

import blood from "../../assets/images/blood.png";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getWilayas, getMoughataas } from "../../services/locationService";

const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    bloodType: "",
    wilaya: "",
    moughataa: "",
  });

  const [wilayas, setWilayas] = useState([]);
  const [moughataas, setMoughataas] = useState([]);

  // =========================
  // Load Wilayas
  // =========================
  useEffect(() => {
    const loadWilayas = async () => {
      try {
        const data = await getWilayas();
        setWilayas(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadWilayas();
  }, []);

  // =========================
  // Load Moughataas
  // =========================
  useEffect(() => {
    if (!filters.wilaya) {
      setMoughataas([]);
      return;
    }

    const load = async () => {
      try {
        const data = await getMoughataas(filters.wilaya);
        setMoughataas(data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [filters.wilaya]);

  // =========================
  // Search → navigate with query params
  // =========================
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (filters.bloodType)
      params.append("bloodType", filters.bloodType);

    if (filters.wilaya)
      params.append("wilaya", filters.wilaya);

    if (filters.moughataa)
      params.append("moughataa", filters.moughataa);

    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="hero">
      <div className="hero-right">

        <h1>{t("title")}</h1>
        <p>{t("heroDesc")}</p>

        <div className="search-box">
          <h3>{t("search")}</h3>

          <div className="filters">

            {/* Blood Type */}
            <select
              value={filters.bloodType}
              onChange={(e) =>
                setFilters({ ...filters, bloodType: e.target.value })
              }
            >
              <option value="">{t("bloodType")}</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>

            {/* Wilaya */}
            <select
              value={filters.wilaya}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  wilaya: e.target.value,
                  moughataa: "",
                })
              }
            >
              <option value="">{t("state")}</option>

              {wilayas.map((w, i) => (
                <option key={i} value={w}>
                  {w}
                </option>
              ))}
            </select>

            {/* Moughataa */}
            <select
              value={filters.moughataa}
              onChange={(e) =>
                setFilters({ ...filters, moughataa: e.target.value })
              }
              disabled={!filters.wilaya}
            >
              <option value="">
                {filters.wilaya ? t("province") : "اختر الولاية أولاً"}
              </option>

              {moughataas.map((m, i) => (
                <option key={i} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* Search Button */}
            <button onClick={handleSearch}>
              {t("searchBtn")}
            </button>

          </div>
        </div>
      </div>

      <div className="hero-left">
        <img src={blood} alt="blood donation" />
      </div>
    </section>
  );
};

export default Hero;