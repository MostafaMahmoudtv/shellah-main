// pages/Users.jsx
import { useEffect, useState } from "react";
import Layout from "../../components/Dashboard/Layout";
import  api from "../../services/api";

export default function Users() {
  const [users, setUsers] = useState([]);

  const load = async () => {
    const res = await api.getUsers();
    setUsers(res.data.users);
  };

  useEffect(() => {
    load();
  }, []);

  const changeRole = async (id, role) => {
    await api.updateRole(id, role);
    load();
  };

  const removeUser = async (id) => {
    await api.deleteUser(id);
    load();
  };

  return (
    <Layout>
      <h2>Users</h2>

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

              <td>
                <button onClick={() => changeRole(u._id, "admin")}>
                  Make Admin
                </button>

                <button onClick={() => changeRole(u._id, "donor")}>
                  Make Donor
                </button>

                <button onClick={() => removeUser(u._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}