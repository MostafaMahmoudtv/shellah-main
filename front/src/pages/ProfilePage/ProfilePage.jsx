import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { getWilayas, getMoughataas } from "../../services/locationService";
import "./ProfilePage.css";
import { FiUser, FiShield, FiLock, FiSettings } from "react-icons/fi";
const API_URL = "http://localhost:5000";

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    bloodType: "",
    wilaya: "",
    moughataa: "",
    preferredContactTime: "",
    contactMethod: "",
  });

  const [wilayas, setWilayas] = useState([]);
  const [moughataas, setMoughataas] = useState([]);

  const [selectedWilaya, setSelectedWilaya] = useState("");

  const [selectedMoughataa, setSelectedMoughataa] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadWilayas();
    fetchUser();
  }, []);

  useEffect(() => {
    if (!selectedWilaya) {
      setMoughataas([]);
      return;
    }

    loadMoughataas(selectedWilaya);
  }, [selectedWilaya]);

  const loadWilayas = async () => {
    try {
      const data = await getWilayas();
      setWilayas(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadMoughataas = async (wilaya) => {
    try {
      const data = await getMoughataas(wilaya);
      setMoughataas(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = data.user;

      setFormData({
        name: user?.name || "",
        phone: user?.phone || "",
        email: user?.email || "",
        bloodType: user?.bloodType || "",
        wilaya: user?.wilaya || "",
        moughataa: user?.moughataa || "",
        preferredContactTime: user?.preferredContactTime || "",
        contactMethod: user?.contactMethod || "",
      });

      setSelectedWilaya(user?.wilaya || "");

      if (user?.wilaya) {
        const districts = await getMoughataas(user.wilaya);

        setMoughataas(districts);
        setSelectedMoughataa(user?.moughataa || "");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      await axios.put(`${API_URL}/api/donors/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("تم حفظ التعديلات بنجاح");
    } catch (error) {
      console.error(error);
      alert("فشل حفظ التعديلات");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="settings-layout">
        <div className="profile-card">
          <h2 className="profile-title">معلومات الحساب</h2>

          <div className="alert-box">
            إشعار هام: عند تغيير رقم الهاتف سيتم إعادة التحقق من الحساب.
          </div>

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>الاسم</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>الهاتف</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>فصيلة الدم</label>

              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
              >
                <option value="">اختر فصيلة الدم</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="form-group">
              <label>الولاية</label>

              <select
                value={selectedWilaya}
                onChange={(e) => {
                  const value = e.target.value;

                  setSelectedWilaya(value);
                  setSelectedMoughataa("");

                  setFormData((prev) => ({
                    ...prev,
                    wilaya: value,
                    moughataa: "",
                  }));
                }}
              >
                <option value="">اختر الولاية</option>

                {wilayas.map((wilaya, index) => (
                  <option key={index} value={wilaya}>
                    {wilaya}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>المقاطعة</label>

              <select
                value={selectedMoughataa}
                onChange={(e) => {
                  const value = e.target.value;

                  setSelectedMoughataa(value);

                  setFormData((prev) => ({
                    ...prev,
                    moughataa: value,
                  }));
                }}
                disabled={!selectedWilaya}
              >
                <option value="">
                  {selectedWilaya ? "اختر المقاطعة" : "اختر الولاية أولاً"}
                </option>

                {moughataas.map((moughataa, index) => (
                  <option key={index} value={moughataa}>
                    {moughataa}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>وسيلة الاتصال</label>

              <select
                name="contactMethod"
                value={formData.contactMethod}
                onChange={handleChange}
              >
                <option value="">اختر وسيلة الاتصال</option>

                <option value="phone">مكالمة هاتفية</option>

                <option value="whatsapp">واتساب</option>

                <option value="telegram">تيليجرام</option>
              </select>
            </div>

            <div className="form-group">
              <label>وقت الاتصال</label>

              <select
                name="preferredContactTime"
                value={formData.preferredContactTime}
                onChange={handleChange}
              >
                <option value="">اختر وقت الاتصال</option>

                <option value="morning">صباحاً</option>

                <option value="afternoon">ظهراً</option>

                <option value="evening">مساءً</option>
              </select>
            </div>

            <div className="actions">
              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? "جارٍ الحفظ..." : "حفظ"}
              </button>
            </div>
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default ProfilePage;
