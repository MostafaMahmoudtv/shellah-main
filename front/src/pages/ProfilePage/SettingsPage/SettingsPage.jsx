import { FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./SettingsPage.css";

const API_URL = "http://localhost:5000";

export default function SettingsPage() {
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "هل أنت متأكد من حذف الحساب نهائياً؟ لا يمكن التراجع عن هذا الإجراء."
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${API_URL}/api/donors/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      alert("تم حذف الحساب بنجاح");

      localStorage.removeItem("token");

      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "حدث خطأ أثناء حذف الحساب"
      );
    }
  };

  return (
    <div className="account-card">
      <div className="account-header">
        <h2>إعدادات الحساب</h2>
        <p>
          إدارة حالة الحساب أو حذفه بشكل نهائي.
        </p>
      </div>

      <div className="account-actions">
        <button
          className="delete-btn"
          onClick={handleDeleteAccount}
        >
          <FiTrash2 />
          <span>حذف الحساب</span>
        </button>
      </div>
    </div>
  );
}