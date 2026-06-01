import { useState } from "react";
import { useTranslation } from "react-i18next";

import { FaPhoneAlt, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../../services/authService";

import "./login.css";

function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await login(formData);

      // تأكد إن التوكن موجود
      if (res?.token) {
        localStorage.setItem("token", res.token);
      }

      // روح للهوم
      navigate("/");
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

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
                name="phone"
                value={formData.phone}
                onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t("passwordPlaceholder")}
              />
              <FaLock />
            </div>
          </div>

          <span className="forgot">
            {t("forgot")}
          </span>

          <button
            className="submit-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Loading..." : t("login")}
          </button>

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