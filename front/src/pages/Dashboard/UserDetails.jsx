// src/pages/UserDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    try {
      const res = await api.get(`/super-admin/users/${id}`);
      setUser(res.data.user);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, [id]);

  const changeRole = async (role) => {
    await api.put(`/super-admin/users/${id}/role`, { role });
    getUser();
  };

  const deleteUser = async () => {
    await api.delete(`/super-admin/users/${id}`);
    navigate("/users");
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Details</h2>

      <div className="card p-3">
        <p><b>Name:</b> {user.name}</p>
        <p><b>Phone:</b> {user.phone}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Blood Type:</b> {user.bloodType}</p>
        <p><b>Wilaya:</b> {user.wilaya}</p>
        <p><b>Moughataa:</b> {user.moughataa}</p>
        <p><b>Role:</b> {user.role}</p>
        <p>
          <b>Status:</b>{" "}
          {user.isActive ? "Active" : "Disabled"}
        </p>
      </div>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => changeRole("admin")}>
          Make Admin
        </button>

        <button onClick={() => changeRole("donor")}>
          Make Donor
        </button>

        <button
          onClick={deleteUser}
          style={{ background: "red", color: "#fff" }}
        >
          Delete User
        </button>
      </div>

      <button
        onClick={() => navigate("/users")}
        style={{ marginTop: "20px" }}
      >
        Back
      </button>
    </div>
  );
}