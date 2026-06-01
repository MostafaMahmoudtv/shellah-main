// pages/DonorsSearch.jsx
import { useState } from "react";
import Layout from "../components/Layout";
import { api } from "../services/api";

export default function DonorsSearch() {
  const [donors, setDonors] = useState([]);

  const search = async () => {
    const query = "bloodType=O+&wilaya=الجزائر&moughataa=باب الزوار";

    const res = await api.searchDonors(query);
    setDonors(res.data.donors);
  };

  return (
    <Layout>
      <h2>Search Donors</h2>

      <button onClick={search}>Search</button>

      <table className="table">
        <tbody>
          {donors.map((d) => (
            <tr key={d._id}>
              <td>{d.name}</td>
              <td>{d.phone}</td>
              <td>{d.bloodType}</td>
              <td>{d.wilaya}</td>
              <td>{d.moughataa}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}