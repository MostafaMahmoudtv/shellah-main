import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Dashboard/Layout";

export default function Dashboard() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const API = "http://localhost:5000/api/admin";

  // =========================
  // 🔥 Fetch donors (ADMIN API)
  // =========================
  const fetchDonors = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/donors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDonors(res.data.donors || []);
    } catch (err) {
      console.log("Error fetching donors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDonors();
  }, [token]);

  // =========================
  // 🔥 DELETE donor (SUPER ADMIN ONLY ideally)
  // =========================
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/donors/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchDonors();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  // =========================
  // 🔥 UI
  // =========================
  const totalDonors = donors.length;

  return (
    <Layout>
      <h2>Admin Dashboard ⚡</h2>

      {/* =========================
          🔥 Stats
      ========================= */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div className="card p-3">
          <h3>Total Donors</h3>
          <h2>{totalDonors}</h2>
        </div>
      </div>

      {/* =========================
          🔥 List
      ========================= */}
      <div>
        <h3>All Donors</h3>

        {loading ? (
          <p>Loading...</p>
        ) : donors.length === 0 ? (
          <p>لا يوجد متبرعين</p>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {donors.map((donor) => (
              <div key={donor._id} className="card p-3">

                <p><b>Name:</b> {donor.name}</p>
                <p><b>Phone:</b> {donor.phone}</p>
                <p><b>Blood Type:</b> {donor.bloodType}</p>
                <p><b>Wilaya:</b> {donor.wilaya}</p>

                {/* =========================
                    🔥 Actions
                ========================= */}
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>

                  <button
                    onClick={() => handleDelete(donor._id)}
                    style={{ background: "red", color: "#fff" }}
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}