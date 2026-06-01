import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { AuthContext } from "./AuthContext";

const DonorContext = createContext();

export function DonorProvider({ children }) {
  const { user } = useContext(AuthContext);

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Get token safely
  // =========================
  const getToken = () => user?.token || localStorage.getItem("token");

  // =========================
  // Fetch donors
  // =========================
  const fetchDonors = async () => {
    try {
      setLoading(true);

      const token = getToken();

      const res = await api.get("/donors/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = Array.isArray(res.data.donors)
        ? res.data.donors
        : [];

      setDonors(data);
    } catch (err) {
      console.log(err.response?.data || err.message);

      // ❌ مهم: ما تمسحش الداتا فجأة في error
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Load when user ready
  // =========================
  useEffect(() => {
    if (user?.token || localStorage.getItem("token")) {
      fetchDonors();
    }
  }, [user]);

  // =========================
  // Delete donor
  // =========================
  const deleteDonor = async (id) => {
    try {
      const token = getToken();

      await api.delete("/donors/delete", {
        data: { donorId: id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 🔥 optimistic update (no refetch needed)
      setDonors((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // =========================
  // Toggle donor (disable/enable)
  // =========================
  const toggleDonor = async (id) => {
    try {
      const token = getToken();

      await api.post(
        "/donors/soft-delete",
        { donorId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔥 optimistic update
      setDonors((prev) =>
        prev.map((d) =>
          d._id === id
            ? { ...d, isActive: !d.isActive }
            : d
        )
      );
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <DonorContext.Provider
      value={{
        donors,
        loading,
        fetchDonors,
        deleteDonor,
        toggleDonor,
      }}
    >
      {children}
    </DonorContext.Provider>
  );
}

export const useDonors = () => useContext(DonorContext);