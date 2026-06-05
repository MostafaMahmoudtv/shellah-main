import "./Statistics.css";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://api.echeile.com";

const Statistics = () => {
  const { t } = useTranslation();

  const [stats, setStats] = useState({
    totalDonors: 0,
    bloodTypes: {
      "O+": 0,
      "O-": 0,
      "B+": 0,
      "B-": 0,
      "A+": 0,
      "A-": 0,
      "AB+": 0,
      "AB-": 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ استخدم endpoint العام بدل admin
        const res = await axios.get(`${API_URL}/api/donors/all`);

        const donors = res.data?.donors || [];

        const bloodCounts = {
          "O+": 0,
          "O-": 0,
          "B+": 0,
          "B-": 0,
          "A+": 0,
          "A-": 0,
          "AB+": 0,
          "AB-": 0,
        };

        donors.forEach((donor) => {
          const type = donor.bloodType;

          if (bloodCounts[type] !== undefined) {
            bloodCounts[type]++;
          }
        });

        setStats({
          totalDonors: donors.length,
          bloodTypes: bloodCounts,
        });
      } catch (err) {
        console.error("Statistics Error:", err);
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <section className="statistics-page">
      <div className="statistics-container">
        <div className="statistics-header">
          <h1>{t("statistics")}</h1>
          <p>{t("bloodStats")}</p>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "40px", color: "#fff" }}>
            Loading...
          </div>
        )}

        {error && !loading && (
          <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="stats-table">
            <div className="table-row table-head">
              <div>{t("totalDonors")}</div>
              <div>O+</div>
              <div>O-</div>
              <div>B+</div>
              <div>B-</div>
              <div>A+</div>
              <div>A-</div>
              <div>AB+</div>
              <div>AB-</div>
            </div>

            <div className="table-row">
              <div>{stats.totalDonors}</div>

              <div>{stats.bloodTypes["O+"]}</div>
              <div>{stats.bloodTypes["O-"]}</div>
              <div>{stats.bloodTypes["B+"]}</div>
              <div>{stats.bloodTypes["B-"]}</div>
              <div>{stats.bloodTypes["A+"]}</div>
              <div>{stats.bloodTypes["A-"]}</div>
              <div>{stats.bloodTypes["AB+"]}</div>
              <div>{stats.bloodTypes["AB-"]}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Statistics;
