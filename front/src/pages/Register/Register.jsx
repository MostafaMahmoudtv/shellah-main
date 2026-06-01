import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getWilayas, getMoughataas } from "../../services/locationService";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
import {
  FaUser,
  FaPhoneAlt,
  FaLock,
  FaEnvelope,
  FaTint,
  FaClock,
  FaCommentDots,
  FaMapMarkerAlt,
  FaChevronDown,
  FaExclamationTriangle,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",

    password: "",
    confirmPassword: "",
    bloodType: "",
    wilaya: "",
    moughataa: "",
    preferredContactTime: "",
    contactMethod: "",
  });
  // locations state
  const [wilayas, setWilayas] = useState([]);
  const [moughataas, setMoughataas] = useState([]);

  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedMoughataa, setSelectedMoughataa] = useState("");

  // fetch wilayas
  useEffect(() => {
    const loadWilayas = async () => {
      try {
        const data = await getWilayas();
        setWilayas(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadWilayas();
  }, []);

  // fetch moughataas when wilaya changes
  useEffect(() => {
    if (!selectedWilaya) {
      setMoughataas([]);
      return;
    }

    const loadMoughataas = async () => {
      try {
        const data = await getMoughataas(selectedWilaya);
        setMoughataas(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadMoughataas();
  }, [selectedWilaya]);
  const handleRegister = async () => {
    try {
      const res = await register(formData);

      // خزّن التوكن بعد التسجيل
      if (res?.token) {
        localStorage.setItem("token", res.token);
      }

      // روح للصفحة الرئيسية
      navigate("/");
    } catch (err) {
      console.log(err.response?.data);
      console.log(err.response?.status);
      console.log(err);
    }
  };
  return (
    <div className="register-page">
      <div className="overlay"></div>

      <div className="register-container">
        <div className="card">
          <h1>{t("registerTitle")}</h1>

          {/* Warning */}
          <div className="warning-box">
            <FaExclamationTriangle />
            <div>
              <h3>{t("warningTitle")}</h3>
              <p>{t("warningText")}</p>
            </div>
          </div>

          <div className="grid">
            {/* Full Name */}
            <div className="input-group">
              <label>{t("fullName")} *</label>
              <div className="input-box">
                <input
                  type="text"
                  placeholder={t("fullNamePlaceholder")}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <FaUser />
              </div>
            </div>

            {/* Phone */}
            <div className="input-group">
              <label>{t("phone")} *</label>
              <div className="input-box">
                <input
                  type="text"
                  placeholder={t("phonePlaceholder")}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                <FaPhoneAlt />
              </div>
            </div>
            {/* Email */}
            <div className="input-group">
              <label>{t("email")} *</label>

              <div className="input-box">
                <input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                />

                <FaEnvelope />
              </div>
            </div>
            {/* Password */}
            <div className="input-group">
              <label>{t("password")} *</label>
              <div className="input-box">
                <input
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <FaLock />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="input-group">
              <label>{t("confirmPassword")} *</label>
              <div className="input-box">
                <input
                  type="password"
                  placeholder={t("confirmPasswordPlaceholder")}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <FaLock />
              </div>
            </div>

            {/* Blood Type */}
            <div className="input-group">
              <label>{t("bloodType")} *</label>
              <div className="input-box select-box">
                <select
                  value={formData.bloodType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bloodType: e.target.value,
                    })
                  }
                >
                  <option value="">{t("selectBlood")}</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>

                <FaTint />
              </div>
            </div>

            {/* Contact Time */}
            <div className="input-group">
              <label>{t("contactTime")} *</label>
              <div className="input-box select-box">
                <select
                  value={formData.preferredContactTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferredContactTime: e.target.value,
                    })
                  }
                >
                  <option value="">{t("selectContactTime")}</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>

                <FaClock />
              </div>
            </div>

            {/* Contact Method */}
            <div className="input-group">
              <label>{t("contactMethod")} *</label>
              <div className="input-box select-box">
                <select
                  value={formData.contactMethod}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactMethod: e.target.value,
                    })
                  }
                >
                  <option value="">{t("selectContactMethod")}</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="phone">Phone</option>
                  <option value="email">Email</option>
                </select>

                <FaCommentDots />
              </div>
            </div>

            {/* Wilaya */}
            <div className="input-group">
              <label>{t("state")} *</label>

              <div className="input-box select-box">
                <select
                  value={selectedWilaya}
                  onChange={(e) => {
                    const value = e.target.value;

                    setSelectedWilaya(value);
                    setSelectedMoughataa("");

                    setFormData({
                      ...formData,
                      wilaya: value,
                      moughataa: "",
                    });
                  }}
                >
                  <option value="">{t("selectState")}</option>

                  {wilayas.map((wilaya, index) => (
                    <option key={index} value={wilaya}>
                      {wilaya}
                    </option>
                  ))}
                </select>

                <FaMapMarkerAlt />
              </div>
            </div>

            {/* Moughataa */}
            <div className="input-group">
              <label>{t("province")} *</label>

              <div className="input-box select-box">
                <select
                  value={selectedMoughataa}
                  onChange={(e) => {
                    const value = e.target.value;

                    setSelectedMoughataa(value);

                    setFormData({
                      ...formData,
                      moughataa: value,
                    });
                  }}
                  disabled={!selectedWilaya}
                >
                  <option value="">
                    {selectedWilaya
                      ? t("selectProvince")
                      : t("selectStateFirst")}
                  </option>

                  {moughataas.map((moughataa, index) => (
                    <option key={index} value={moughataa}>
                      {moughataa}
                    </option>
                  ))}
                </select>

                <FaChevronDown />
              </div>
            </div>
          </div>

          <button className="submit-btn" onClick={handleRegister}>
            {t("register")}
          </button>
          <div className="register-link">
            <span>{t("alreadyMember")}</span>
            <Link to="/login">{t("login")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
