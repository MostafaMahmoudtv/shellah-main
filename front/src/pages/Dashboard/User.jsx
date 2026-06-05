import { useEffect, useState } from "react";
import Layout from "../../components/Dashboard/Layout";
import api from "../../services/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);

      const res = await api.getUsers();

      setUsers(res?.data?.users || []);
    } catch (err) {
      console.log("Load users error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeRole = async (id, role) => {
    try {
      await api.updateRole(id, role);
      load();
    } catch (err) {
      console.log("Update role error:", err);
    }
  };

  const removeUser = async (id) => {
    try {
      await api.deleteUser(id);
      load();
    } catch (err) {
      console.log("Delete user error:", err);
    }
  };

  return (
    <Layout>
      <h2>Users</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Blood</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.phone}</td>
                <td>{u.bloodType}</td>
                <td>{u.role}</td>
                <td>{u.isActive ? "Active" : "Disabled"}</td>

                <td style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => changeRole(u._id, "admin")}>
                    Admin
                  </button>

                  <button onClick={() => changeRole(u._id, "donor")}>
                    Donor
                  </button>

                  <button onClick={() => removeUser(u._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
