import { useEffect, useState } from "react";
import api from "../../services/api";
import "./admins.css";

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
  });

  // =========================
  // GET ALL ADMINS
  // =========================
  const getAdmins = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/admins");

      setAdmins(res.data.admins || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ADD ADMIN
  // =========================
  const addAdmin = async () => {
    try {
      await api.post("/api/admins", form);

      setForm({ name: "", phone: "", password: "" });

      getAdmins();
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // DELETE ADMIN
  // =========================
  const deleteAdmin = async (id) => {
    try {
      await api.delete(`/api/admins/${id}`);

      getAdmins();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAdmins();
  }, []);

  return (
    <div className="admins-page">

      <h2>Admins Management</h2>

      {/* FORM */}
      <div className="admin-form">

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button onClick={addAdmin}>
          Add Admin
        </button>
      </div>

      {/* LIST */}
      <div className="admins-list">

        {loading ? (
          <p>Loading...</p>
        ) : admins.length === 0 ? (
          <p>No admins found</p>
        ) : (
          admins.map((admin) => (
            <div key={admin._id} className="admin-card">

              <div>
                <h4>{admin.name}</h4>
                <p>{admin.phone}</p>
              </div>

              <button
                className="delete-btn"
                onClick={() => deleteAdmin(admin._id)}
              >
                Delete
              </button>

            </div>
          ))
        )}

      </div>

    </div>
  );
}