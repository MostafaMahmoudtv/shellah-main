// components/Sidebar.jsx
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={{ width: "220px", background: "#111", color: "#fff", height: "100vh", padding: "20px" }}>
      <h3>Dashboard</h3>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/dashboard" style={{ color: "#fff" }}>Home</Link></li>
        <li><Link to="/users" style={{ color: "#fff" }}>Users</Link></li>
        <li><Link to="/donors" style={{ color: "#fff" }}>Search Donors</Link></li>
      </ul>
    </div>
  );
}