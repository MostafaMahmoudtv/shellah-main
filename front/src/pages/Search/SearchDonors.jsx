import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  FaWhatsapp,
  FaPhone,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import { getWilayas, getMoughataas } from "../../services/locationService";
import styles from "./SearchDonors.module.css";

const API_URL = "https://api.echeile.com";

export default function SearchDonors() {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const [filters, setFilters] = useState({
    bloodType: "",
    wilaya: "",
    moughataa: "",
  });

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(1);

  const [wilayas, setWilayas] = useState([]);
  const [moughataas, setMoughataas] = useState([]);

  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedMoughataa, setSelectedMoughataa] = useState("");

  // =========================
  // Sync URL params
  // =========================
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const bloodType = params.get("bloodType") || "";
    const wilaya = params.get("wilaya") || "";
    const moughataa = params.get("moughataa") || "";

    setFilters({ bloodType, wilaya, moughataa });

    setSelectedWilaya(wilaya);
    setSelectedMoughataa(moughataa);

    setPage(1);
  }, [location.search]);

  // =========================
  // Load Wilayas (language-aware)
  // =========================
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getWilayas();
        setWilayas(data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [i18n.language]);

  // =========================
  // Load Moughataas (language-aware)
  // =========================
  useEffect(() => {
    const load = async () => {
      try {
        if (!selectedWilaya) {
          setMoughataas([]);
          return;
        }

        const data = await getMoughataas(selectedWilaya);
        setMoughataas(data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [selectedWilaya, i18n.language]);

  // =========================
  // Fetch donors
  // =========================
  const fetchDonors = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams();

      if (filters.bloodType) query.append("bloodType", filters.bloodType);
      if (filters.wilaya) query.append("wilaya", filters.wilaya);
      if (filters.moughataa) query.append("moughataa", filters.moughataa);

      query.append("page", page);
      query.append("limit", limit);

      const { data } = await axios.get(
        `${API_URL}/api/donors/search?${query.toString()}`,
      );

      setDonors(data.donors || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, [filters, page]);

  const handleSearch = () => {
    setPage(1);
  };

  // =========================
  // Contact actions
  // =========================
  const formatPhone = (phone) => phone?.replace(/\D/g, "");

  const handleWhatsApp = (phone) => {
    const num = formatPhone(phone);
    if (!num) return;
    window.open(`https://wa.me/${num}`, "_blank");
  };

  const handleCall = (phone) => {
    if (!phone) return;
    window.open(`tel:${phone}`);
  };

  return (
    <div className={styles["search-page"]}>
      {/* Filters */}
      <div className={styles["filters"]}>
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

        <select
          value={selectedWilaya}
          onChange={(e) => {
            const value = e.target.value;

            setSelectedWilaya(value);
            setSelectedMoughataa("");

            setFilters((prev) => ({
              ...prev,
              wilaya: value,
              moughataa: "",
            }));
          }}
        >
          <option value="">{t("state")}</option>

          {wilayas.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>

        <select
          value={selectedMoughataa}
          onChange={(e) => {
            const value = e.target.value;

            setSelectedMoughataa(value);

            setFilters((prev) => ({
              ...prev,
              moughataa: value,
            }));
          }}
          disabled={!selectedWilaya}
        >
          <option value="">
            {selectedWilaya ? t("province") : t("chooseStateFirst")}
          </option>

          {moughataas.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <button onClick={handleSearch}>{t("searchBtn")}</button>
      </div>

      {/* Table */}
      <div className={styles["table-wrapper"]}>
        <table>
          <thead>
            <tr>
              <th>{t("name")}</th>
              <th>{t("bloodType")}</th>
              <th>{t("state")}</th>
              <th>{t("province")}</th>
              <th>{t("contactMethod")}</th>
              <th>{t("contactTime")}</th>
              <th>{t("contact")}</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">{t("loading")}</td>
              </tr>
            ) : donors.length === 0 ? (
              <tr>
                <td colSpan="7">{t("noDonors")}</td>
              </tr>
            ) : (
              donors.map((donor) => (
                <tr key={donor._id}>
                  <td>{donor.name}</td>
                  <td>{donor.bloodType}</td>
                  <td>{donor.wilaya}</td>
                  <td>{donor.moughataa}</td>
                  <td>{donor.contactMethod}</td>
                  <td>{donor.preferredContactTime}</td>
                  <td>
                    <div className={styles.actions}>
                      {String(donor.contactMethod || "")
                        .toLowerCase()
                        .includes("whats") ||
                      donor.contactMethod === "واتساب" ? (
                        <FaWhatsapp
                          className={styles.whatsapp}
                          onClick={() => handleWhatsApp(donor.phone)}
                        />
                      ) : (
                        <FaPhone
                          className={styles.phone}
                          onClick={() => handleCall(donor.phone)}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className={styles["table-footer"]}>
          <p>
            {donors.length} {t("donors")}
          </p>

          <div className={styles.pagination}>
            <button
              className={styles["page-btn"]}
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <FaChevronRight />
            </button>

            <div className="page-number">{page}</div>

            <button
              className={styles["page-btn"]}
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <FaChevronLeft />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
