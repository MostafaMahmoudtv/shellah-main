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
                <input type="password" placeholder={t("passwordPlaceholder")} />

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

            {/* البريد الإلكتروني */}

            <div className="input-group">
              <label>{t("email")} *</label>

              <div className="input-box">
                <input type="email" placeholder={t("emailPlaceholder")} />

                <FaEnvelope />
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

            {/* البلدية */}

            <div className="input-group">
              <label>{t("city")}</label>

              <div className="input-box select-box">
                <select>
                  <option>{t("selectCity")}</option>
                </select>

                <FaChevronDown />
              </div>
            </div>

            {/* الدائرة */}

            <div className="input-group">
              <label>{t("district")}</label>

              <div className="input-box select-box">
                <select>
                  <option>{t("selectDistrict")}</option>
                </select>

                <FaChevronDown />
              </div>
            </div>

            {/* الولاية */}

            <div className="input-group">
              <label>{t("state")} *</label>

              <div className="input-box select-box">
                <select>
                  <option>{t("selectState")}</option>
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
