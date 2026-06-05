import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaPhoneAlt, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import styles from "./login.module.css";

function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // =========================
  // Redirect if already logged in
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      if (role === "admin" || role === "super_admin") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } else {
      setCheckingAuth(false);
    }
  }, [navigate]);

  // =========================
  // Handle Input
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // clear field error instantly
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // =========================
  // Validation
  // =========================
  const validate = () => {
    const newErrors = {};

    if (!formData.phone.trim()) {
      newErrors.phone = t("phoneRequired") || "رقم الهاتف مطلوب";
    }

    if (!formData.password) {
      newErrors.password = t("passwordRequired") || "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password = t("passwordMinLength") || "كلمة المرور قصيرة جدًا";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const res = await login(formData);
      const user = res?.user;

      // حماية
      if (!user) {
        setErrors({ general: "بيانات غير صحيحة" });
        return;
      }

      // حساب معطل
      if (user.isActive === false) {
        setErrors({ general: "الحساب معطل من الإدارة" });

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        return;
      }

      // Save auth
      if (res?.token) {
        localStorage.setItem("token", res.token);
      }

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      // redirect
      if (user.role === "admin" || user.role === "super_admin") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.log(err?.response?.data);

      setErrors({
        general: err?.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول",
      });
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || checkingAuth;

  return (
    <div className={styles.loginPage}>
      <div className={styles.overlay}></div>

      <div className={styles.loginContainer}>
        <div className={styles.card}>
          <h1>{t("loginTitle")}</h1>

          {/* General Error */}
          {errors.general && (
            <div className={styles.errorBox}>{errors.general}</div>
          )}

          {/* Phone */}
          <div className={styles.inputGroup}>
            <label>{t("phone")}</label>

            <div
              className={`${styles.inputBox} ${
                errors.phone ? styles.inputError : ""
              }`}
            >
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t("phonePlaceholder")}
                disabled={isDisabled}
              />
              <FaPhoneAlt />
            </div>

            {errors.phone && (
              <div className={styles.errorText}>{errors.phone}</div>
            )}
          </div>

          {/* Password */}
          <div className={styles.inputGroup}>
            <label>{t("password")}</label>

            <div
              className={`${styles.inputBox} ${
                errors.password ? styles.inputError : ""
              }`}
            >
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t("passwordPlaceholder")}
                disabled={isDisabled}
              />
              <FaLock />
            </div>

            {errors.password && (
              <div className={styles.errorText}>{errors.password}</div>
            )}
          </div>

          <span className={styles.forgot}>{t("forgot")}</span>

          <button
            className={styles.submitBtn}
            onClick={handleLogin}
            disabled={isDisabled}
          >
            {loading ? "Loading..." : t("login")}
          </button>

          <div className={styles.register}>
            <span>{t("newUser")}</span>
            <Link to="/register">{t("register")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
