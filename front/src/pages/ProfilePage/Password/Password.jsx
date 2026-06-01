import { useState } from "react";
import axios from "axios";
import { FiLock, FiSave } from "react-icons/fi";

import "./Password.css";

const API_URL = "http://localhost:5000";

const Password = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = formData;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("من فضلك املأ كل الحقول");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("كلمتا المرور غير متطابقتين");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

     const response = await axios.put(
  `${API_URL}/api/donors/change-password`,
  {
    currentPassword,
    newPassword,
    confirmNewPassword: confirmPassword,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      alert(response.data?.message || "تم تغيير كلمة المرور بنجاح");
      console.log("تم التحديث بنجاح ");
      console.log("Status:", response.status);
      console.log("Response Data:", response.data);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error:", error);

      alert(error.response?.data?.message || "حدث خطأ أثناء تغيير كلمة المرور");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="security-page">
      <div className="security-card">
        <div className="security-header">
          <h2>إعدادات كلمة المرور والأمان</h2>
          <p>قم بتغيير كلمة المرور الخاصة بك بشكل آمن.</p>
        </div>

        <form className="security-form" onSubmit={handleSubmit}>
          <div className="form-group full-width">
            <label>
              كلمة المرور الحالية <span>*</span>
            </label>

            <div className="input-wrapper">
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="أدخل كلمة المرور الحالية"
              />
              <FiLock className="icon" />
            </div>
          </div>

          <div className="form-group">
            <label>
              كلمة المرور الجديدة <span>*</span>
            </label>

            <div className="input-wrapper">
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="أدخل كلمة المرور الجديدة"
              />
              <FiLock className="icon" />
            </div>
          </div>

          <div className="form-group">
            <label>
              تأكيد كلمة المرور <span>*</span>
            </label>

            <div className="input-wrapper">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="تأكيد كلمة المرور الجديدة"
              />
              <FiLock className="icon" />
            </div>
          </div>

          <button type="submit" className="save-btn" disabled={saving}>
            <FiSave />
            {saving ? "جارٍ الحفظ..." : "حفظ"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Password;
