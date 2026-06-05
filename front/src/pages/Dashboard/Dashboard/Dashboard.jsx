import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Layout from "../../../components/Dashboard/Layout";
import { useTranslation } from "react-i18next";

import { FaWhatsapp, FaTelegramPlane, FaPhone, FaSearch } from "react-icons/fa";

import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { t } = useTranslation();

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const donorsPerPage = 6;

  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name || "";
  const userRole = user?.role || "";

  const isSuperAdmin = userRole === "super_admin";

  const API = "https://api.echeile.com/api/admin";

  // =========================
  // Fetch Donors
  // =========================
  const fetchDonors = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/donors`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDonors(res.data.donors || []);
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: t("error"),
        text: t("fetchError"),
        confirmButtonText: t("ok"),
      });

      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDonors();
  }, [token]);

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: t("confirmDelete"),
      text: t("deleteWarning"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("yesDelete"),
      cancelButtonText: t("cancel"),
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API}/donors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDonors((prev) => prev.filter((d) => d._id !== id));

      Swal.fire({
        icon: "success",
        title: t("deleted"),
        text: t("deleteSuccess"),
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: t("error"),
        text: err?.response?.data?.message || t("deleteFail"),
        confirmButtonText: t("ok"),
      });
    }
  };

  // =========================
  // SEARCH
  // =========================
  const filteredDonors = useMemo(() => {
    if (!search.trim()) return donors;

    const text = search.toLowerCase();

    return donors.filter((donor) => {
      return (
        donor.name?.toLowerCase().includes(text) ||
        donor.phone?.toLowerCase().includes(text) ||
        donor.bloodType?.toLowerCase().includes(text) ||
        donor.wilaya?.toLowerCase().includes(text) ||
        donor.moughataa?.toLowerCase().includes(text)
      );
    });
  }, [search, donors]);

  // =========================
  // PAGINATION
  // =========================
  const totalPages = Math.ceil(filteredDonors.length / donorsPerPage);

  const startIndex = (currentPage - 1) * donorsPerPage;

  const currentDonors = filteredDonors.slice(
    startIndex,
    startIndex + donorsPerPage,
  );

  // =========================
  // CONTACT
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

  const handleTelegram = (phone) => {
    if (!phone) return;
    window.open(`https://t.me/${phone}`, "_blank");
  };

  // =========================
  // HEADER (UPDATED)
  // =========================
  const greeting = isSuperAdmin ? t("helloProjectManager") : t("helloAdmin");

  const roleText = isSuperAdmin ? t("projectManager") : t("admin");

  return (
    <Layout>
      {/* Header */}
      <div className={styles.header}>
        <h2>
          👋 {greeting} {userName}
        </h2>

        <p>{roleText}</p>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.card}>
          <h3>{t("totalDonors")}</h3>
          <h2>{filteredDonors.length}</h2>
        </div>
      </div>

      {/* Search */}
      <div className={styles.searchBox}>
        <FaSearch className={styles.searchIcon} />

        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* List */}
      <div className={styles.list}>
        <h3>{t("allDonors")}</h3>

        {loading ? (
          <p>{t("loading")}</p>
        ) : filteredDonors.length === 0 ? (
          <p>{t("noDonors")}</p>
        ) : (
          <>
            {currentDonors.map((donor) => (
              <div key={donor._id} className={styles.donorCard}>
                <div className={styles.info}>
                  <p>
                    <b>{donor.name}</b>
                  </p>
                  <p>{donor.phone}</p>
                  <p>{donor.bloodType}</p>
                  <p>
                    {donor.wilaya} - {donor.moughataa}
                  </p>
                </div>

                <div className={styles.actions}>
                  <FaWhatsapp onClick={() => handleWhatsApp(donor.phone)} />
                  <FaTelegramPlane
                    onClick={() => handleTelegram(donor.phone)}
                  />
                  <FaPhone onClick={() => handleCall(donor.phone)} />

                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(donor._id)}
                  >
                    {t("delete")}
                  </button>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  {t("prev")}
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={
                      currentPage === index + 1 ? styles.activePage : ""
                    }
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  {t("next")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
