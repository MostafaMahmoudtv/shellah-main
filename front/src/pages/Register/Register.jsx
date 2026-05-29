import { useState } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  // البيانات دي مؤقتة لحد ما تيجي من الباك
  const provinces = [
    { id: 1, name: "Province 1" },
    { id: 2, name: "Province 2" },
    { id: 3, name: "Province 3" },
  ];

  const states = {
    1: [
      { id: 1, name: "State 1 - A" },
      { id: 2, name: "State 1 - B" },
    ],
    2: [
      { id: 3, name: "State 2 - A" },
      { id: 4, name: "State 2 - B" },
    ],
    3: [
      { id: 5, name: "State 3 - A" },
      { id: 6, name: "State 3 - B" },
    ],
  };

  const [selectedProvince, setSelectedProvince] = useState("");

  return (
    <div className="register-page">
      <div className="overlay"></div>

      <div className="register-container">
        <div className="card">
          {/* العنوان */}

          <h1>{t("registerTitle")}</h1>

          {/* التحذير */}

          <div className="warning-box">
            <FaExclamationTriangle />

            <div>
              <h3>{t("warningTitle")}</h3>

              <p>{t("warningText")}</p>
            </div>
          </div>

          {/* الفورم */}

          <div className="grid">
            {/* الاسم */}

            <div className="input-group">
              <label>{t("fullName")} *</label>

              <div className="input-box">
                <input type="text" placeholder={t("fullNamePlaceholder")} />

                <FaUser />
              </div>
            </div>

            {/* الهاتف */}

            <div className="input-group">
              <label>{t("phone")} *</label>

              <div className="input-box">
                <input type="text" placeholder={t("phonePlaceholder")} />

                <FaPhoneAlt />
              </div>
            </div>

            {/* البريد الإلكتروني */}

            <div className="input-group">
              <label>{t("email")} *</label>

              <div className="input-box">
                <input type="email" placeholder={t("emailPlaceholder")} />

                <FaEnvelope />
              </div>
            </div>

            {/* كلمة المرور */}

            <div className="input-group">
              <label>{t("password")} *</label>

              <div className="input-box">
                <input
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                />

                <FaLock />
              </div>
            </div>

            {/* تأكيد كلمة المرور */}

            <div className="input-group">
              <label>{t("confirmPassword")} *</label>

              <div className="input-box">
                <input
                  type="password"
                  placeholder={t("confirmPasswordPlaceholder")}
                />

                <FaLock />
              </div>
            </div>

            {/* فصيلة الدم */}

            <div className="input-group">
              <label>{t("bloodType")} *</label>

              <div className="input-box select-box">
                <select>
                  <option>{t("selectBlood")}</option>

                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>O+</option>
                  <option>O-</option>
                </select>

                <FaTint />
              </div>
            </div>

            {/* وقت الاتصال */}

            <div className="input-group">
              <label>{t("contactTime")} *</label>

              <div className="input-box select-box">
                <select>
                  <option>{t("selectContactTime")}</option>

                  <option>08:00 - 12:00</option>
                  <option>12:00 - 18:00</option>
                  <option>18:00 - 22:00</option>
                </select>

                <FaClock />
              </div>
            </div>

            {/* وسيلة الاتصال */}

            <div className="input-group">
              <label>{t("contactMethod")} *</label>

              <div className="input-box select-box">
                <select>
                  <option>{t("selectContactMethod")}</option>

                  <option>WhatsApp</option>
                  <option>Phone</option>
                  <option>Email</option>
                </select>

                <FaCommentDots />
              </div>
            </div>

            {/* المقاطعة */}

            <div className="input-group">
              <label>{t("province")} *</label>

              <div className="input-box select-box">
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                >
                  <option value="">{t("selectProvince")}</option>

                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>

                <FaChevronDown />
              </div>
            </div>

            {/* الولاية */}

            <div className="input-group">
              <label>{t("state")} *</label>

              <div className="input-box select-box">
                <select disabled={!selectedProvince}>
                  <option value="">
                    {selectedProvince
                      ? t("selectState")
                      : t("selectProvinceFirst")}
                  </option>

                  {selectedProvince &&
                    states[selectedProvince]?.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                </select>

                <FaMapMarkerAlt />
              </div>
            </div>
          </div>

          {/* زر التسجيل */}

          <button className="submit-btn">{t("register")}</button>

          {/* لينك تسجيل الدخول */}

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