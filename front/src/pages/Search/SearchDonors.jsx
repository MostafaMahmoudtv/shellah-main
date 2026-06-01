import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  FaWhatsapp,
  FaTelegramPlane,
  FaPhone,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import { getWilayas, getMoughataas } from "../../services/locationService";
import "./SearchDonors.css";

const API_URL = "http://localhost:5000";

export default function SearchDonors() {
  const location = useLocation();

  const [filters, setFilters] = useState({
    bloodType: "",
    wilaya: "",
    moughataa: "",
  });

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(1);

  const [wilayas, setWilayas] = useState([]);
  const [moughataas, setMoughataas] = useState([]);

  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedMoughataa, setSelectedMoughataa] = useState("");

  // =========================
  // Read query params
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
  // Load wilayas
  // =========================
  useEffect(() => {
    const load = async () => {
      const data = await getWilayas();
      setWilayas(data);
    };
    load();
  }, []);

  // =========================
  // Load moughataas
  // =========================
  useEffect(() => {
    if (!selectedWilaya) {
      setMoughataas([]);
      return;
    }

    const load = async () => {
      const data = await getMoughataas(selectedWilaya);
      setMoughataas(data);
    };

    load();
  }, [selectedWilaya]);

  // =========================
  // Fetch donors
  // =========================
  const fetchDonors = async (customFilters = filters, currentPage = page) => {
    try {
      setLoading(true);

      const query = new URLSearchParams();

      if (customFilters.bloodType)
        query.append("bloodType", customFilters.bloodType);

      if (customFilters.wilaya) query.append("wilaya", customFilters.wilaya);

      if (customFilters.moughataa)
        query.append("moughataa", customFilters.moughataa);

      query.append("page", currentPage);
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
    fetchDonors(filters, page);
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchDonors(filters, 1);
  };

  // =========================
  // Contact
  // =========================
  const formatPhone = (phone) => phone?.replace(/\D/g, "");

  const handleWhatsApp = (phone) => {
    const num = formatPhone(phone);
    if (!num) return;
    window.open(`https://wa.me/${num}`, "_blank");
  };

  const handleTelegram = (phone) => {
    if (!phone) return;
    window.open(`https://t.me/${phone}`, "_blank");
  };

  const handleCall = (phone) => {
    if (!phone) return;
    window.open(`tel:${phone}`);
  };

  return (
    <div className="search-page">
      {/* Filters */}
      <div className="filters">
        <select
          value={filters.bloodType}
          onChange={(e) =>
            setFilters({ ...filters, bloodType: e.target.value })
          }
        >
          <option value="">فصيلة الدم</option>
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
          <option value="">الولاية</option>
          {wilayas.map((w, i) => (
            <option key={i} value={w}>
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
            {selectedWilaya ? "المقاطعة" : "اختر الولاية أولاً"}
          </option>

          {moughataas.map((m, i) => (
            <option key={i} value={m}>
              {m}
            </option>
          ))}
        </select>

        <button onClick={handleSearch}>بحث</button>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>الاسم</th>
              <th>فصيلة الدم</th>
              <th>الولاية</th>
              <th>المقاطعة</th>
              <th>وسيلة الاتصال</th>
              <th>وقت الاتصال</th>
              <th>اتصال</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">جارٍ البحث...</td>
              </tr>
            ) : donors.length === 0 ? (
              <tr>
                <td colSpan="7">لا يوجد متبرعين</td>
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
                    <div className="actions">
                      <button onClick={() => handleWhatsApp(donor.phone)}>
                        WhatsApp
                      </button>
                      <button onClick={() => handleTelegram(donor.phone)}>
                        Telegram
                      </button>
                      <button onClick={() => handleCall(donor.phone)}>
                        Call
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination (arrows) */}
        <div className="table-footer">
          <p>{donors.length} متبرع</p>
          <div className="pagination">
            <button
              className="page-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
                            <FaChevronRight />

            </button>

            <div className="page-number">{page}</div>

            <button
              className="page-btn"
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
