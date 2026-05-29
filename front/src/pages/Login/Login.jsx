import { useTranslation } from "react-i18next";

import {
  FaPhoneAlt,
  FaLock,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import "./login.css";

function Login() {
  const { t } = useTranslation();

  return (
    <div className="login-page">
      <div className="overlay"></div>

      <div className="login-container">
        <div className="card">

          <h1>{t("loginTitle")}</h1>

          {/* الهاتف */}

          <div className="input-group">
            <label>{t("phone")}</label>

            <div className="input-box">
              <input
                type="text"
                placeholder={t("phonePlaceholder")}
              />

              <FaPhoneAlt />
            </div>
          </div>

          {/* كلمة المرور */}

          <div className="input-group">
            <label>{t("password")}</label>

            <div className="input-box">
              <input
                type="password"
                placeholder={t(
                  "passwordPlaceholder"
                )}
              />

              <FaLock />
            </div>
          </div>

          <span className="forgot">
            {t("forgot")}
          </span>

          <button className="submit-btn">
            {t("login")}
          </button>

          {/* التسجيل */}

          <div className="register">
            <span>{t("newUser")}</span>

            <Link to="/register">
              {t("register")}
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;