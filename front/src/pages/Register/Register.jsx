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
import styles from "./Register.module.css";

function Register() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

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

  // Validation errors state
  const [errors, setErrors] = useState({});

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
  }, [i18n.language]); // 👈 مهم جدًا

  // fetch moughataas when wilaya changes
  useEffect(() => {
    if (!selectedWilaya) {
      setMoughataas([]);
      return;
    }

    const loadMoughataas = async () => {
      try {
        const data = await getMoughataas(selectedWilaya);
        setMoughataas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setMoughataas([]);
      }
    };

    loadMoughataas();
  }, [selectedWilaya, i18n.language]); // 👈 مهم جدًا

  // Validation function for Mauritanian phone number
  const validateMauritanianPhone = (phone) => {
    const cleanPhone = normalizePhone(phone);

    // 8 digits local (Mauritania old format)
    const local = /^[0-9]{8}$/;

    // 9 digits mobile
    const mobile = /^(06|07|09)[0-9]{7}$/;

    // international
    const international = /^222[0-9]{8}$/;

    return (
      local.test(cleanPhone) ||
      mobile.test(cleanPhone) ||
      international.test(cleanPhone)
    );
  };
  const normalizePhone = (phone) => {
    return phone
      .replace(/[\s\-+]/g, "") // شيل المسافات والرموز
      .replace(/^00/, ""); // لو كاتب 00 بدل +
  };
  // Validate all fields
  const validateForm = () => {
    const newErrors = {};

    // Validate Name
    if (!formData.name.trim()) {
      newErrors.name = t("nameRequired") || "الاسم الكامل مطلوب";
    } else if (formData.name.trim().length < 3) {
      newErrors.name =
        t("nameMinLength") || "الاسم يجب أن يكون 3 أحرف على الأقل";
    }

    // Validate Mauritanian Phone
    if (!formData.phone.trim()) {
      newErrors.phone = t("phoneRequired") || "رقم الموبايل مطلوب";
    } else if (!validateMauritanianPhone(formData.phone)) {
      newErrors.phone =
        t("phoneMauritania") ||
        "رقم الموبايل يجب أن يكون موريتاني (222XXXXXXXX أو 09XXXXXXX أو 07XXXXXXX أو 06XXXXXXX)";
    }

    // Validate Email
    // Validate Email (OPTIONAL)
// Validate Email (OPTIONAL)
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (formData.email.trim() && !emailPattern.test(formData.email)) {
  newErrors.email =
    t("emailInvalid") || "البريد الإلكتروني غير صحيح";
}
    // Validate Password
    if (!formData.password) {
      newErrors.password = t("passwordRequired") || "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password =
        t("passwordMinLength") || "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    // Validate Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        t("confirmPasswordRequired") || "تأكيد كلمة المرور مطلوب";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword =
        t("passwordsNotMatch") || "كلمة المرور غير متطابقة";
    }

    // Validate Blood Type
    if (!formData.bloodType) {
      newErrors.bloodType = t("bloodTypeRequired") || "فصيلة الدم مطلوبة";
    }

    // Validate Preferred Contact Time
    if (!formData.preferredContactTime) {
      newErrors.preferredContactTime =
        t("contactTimeRequired") || "وقت الاتصال المفضل مطلوب";
    }

    // Validate Contact Method
    if (!formData.contactMethod) {
      newErrors.contactMethod =
        t("contactMethodRequired") || "طريقة الاتصال مطلوبة";
    }

    // Validate Wilaya
    if (!formData.wilaya) {
      newErrors.wilaya = t("wilayaRequired") || "الولاية مطلوبة";
    }

    // Validate Moughataa
    if (!formData.moughataa) {
      newErrors.moughataa = t("moughataaRequired") || "المقاطعة مطلوبة";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        ...formData,
        email: formData.email.trim() || undefined,
      };

      const res = await register(payload);
      console.log("Register Response:", res);

      if (res?.token) {
        localStorage.setItem("token", res.token);
      }

      if (res?.user) {
        localStorage.setItem("user", JSON.stringify(res.user));
      }

      navigate("/");
    } catch (err) {
      console.log(err.response?.data);
      console.log(err.response?.status);
      console.log(err);

      // Handle server validation errors
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        // Show general error message
        setErrors({ general: err.response.data.message });
      }
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.overlay}></div>

      <div className={styles.registerContainer}>
        <div className={styles.card}>
          <h1>{t("registerTitle")}</h1>

          {/* Warning */}
          <div className={styles.warningBox}>
            <FaExclamationTriangle />
            <div>
              <h3>{t("warningTitle")}</h3>
              <p>{t("warningText")}</p>
            </div>
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div className={styles.errorMessage}>{errors.general}</div>
          )}

          <div className={styles.grid}>
            {/* Full Name */}
            <div className={styles.inputGroup}>
              <label>{t("fullName")} *</label>
              <div
                className={`${styles.inputBox} ${errors.name ? styles.inputError : ""}`}
              >
                <input
                  type="text"
                  placeholder={t("fullNamePlaceholder")}
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                />
                <FaUser />
              </div>
              {errors.name && (
                <div className={styles.errorText}>{errors.name}</div>
              )}
            </div>

            {/* Phone */}
            <div className={styles.inputGroup}>
              <label>{t("phone")} *</label>
              <div
                className={`${styles.inputBox} ${errors.phone ? styles.inputError : ""}`}
              >
                <input
                  type="tel"
                  placeholder={t("phonePlaceholder")}
                  value={formData.phone}
                  className={styles.phoneInput}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: "" });
                  }}
                />
                <FaPhoneAlt />
              </div>
              {errors.phone && (
                <div className={styles.errorText}>{errors.phone}</div>
              )}
            </div>

            {/* Email */}
            <div className={styles.inputGroup}>
              <label>{t("email")} *</label>
              <div
                className={`${styles.inputBox} ${errors.email ? styles.inputError : ""}`}
              >
                <input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                />
                <FaEnvelope />
              </div>
              {errors.email && (
                <div className={styles.errorText}>{errors.email}</div>
              )}
            </div>

            {/* Password */}
            <div className={styles.inputGroup}>
              <label>{t("password")} *</label>
              <div
                className={`${styles.inputBox} ${errors.password ? styles.inputError : ""}`}
              >
                <input
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                />
                <FaLock />
              </div>
              {errors.password && (
                <div className={styles.errorText}>{errors.password}</div>
              )}
            </div>

            {/* Confirm Password */}
            <div className={styles.inputGroup}>
              <label>{t("confirmPassword")} *</label>
              <div
                className={`${styles.inputBox} ${errors.confirmPassword ? styles.inputError : ""}`}
              >
                <input
                  type="password"
                  placeholder={t("confirmPasswordPlaceholder")}
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    });
                    if (errors.confirmPassword)
                      setErrors({ ...errors, confirmPassword: "" });
                  }}
                />
                <FaLock />
              </div>
              {errors.confirmPassword && (
                <div className={styles.errorText}>{errors.confirmPassword}</div>
              )}
            </div>

            {/* Blood Type */}
            <div className={styles.inputGroup}>
              <label>{t("bloodType")} *</label>
              <div
                className={`${styles.inputBox} ${errors.bloodType ? styles.inputError : ""}`}
              >
                <select
                  value={formData.bloodType}
                  onChange={(e) => {
                    setFormData({ ...formData, bloodType: e.target.value });
                    if (errors.bloodType)
                      setErrors({ ...errors, bloodType: "" });
                  }}
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
              {errors.bloodType && (
                <div className={styles.errorText}>{errors.bloodType}</div>
              )}
            </div>

            {/* Contact Time */}
            <div className={styles.inputGroup}>
              <label>{t("contactTime")} *</label>
              <div
                className={`${styles.inputBox} ${errors.preferredContactTime ? styles.inputError : ""}`}
              >
                <select
                  value={formData.preferredContactTime}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      preferredContactTime: e.target.value,
                    });
                    if (errors.preferredContactTime)
                      setErrors({ ...errors, preferredContactTime: "" });
                  }}
                >
                  <option value="">{t("selectContactTime")}</option>
                  <option value="أي وقت">{t("anyTime")}</option>
                  <option value="صباحا">{t("morning")}</option>
                  <option value="بعد الظهر">{t("afternoon")}</option>
                  <option value="مساءا">{t("evening")}</option>
                </select>
                <FaClock />
              </div>
              {errors.preferredContactTime && (
                <div className={styles.errorText}>
                  {errors.preferredContactTime}
                </div>
              )}
            </div>

            {/* Contact Method */}
            <div className={styles.inputGroup}>
              <label>{t("contactMethod")} *</label>
              <div
                className={`${styles.inputBox} ${errors.contactMethod ? styles.inputError : ""}`}
              >
                <select
                  value={formData.contactMethod}
                  onChange={(e) => {
                    setFormData({ ...formData, contactMethod: e.target.value });
                    if (errors.contactMethod)
                      setErrors({ ...errors, contactMethod: "" });
                  }}
                >
                  <option value="">{t("selectContactMethod")}</option>

                  <option value="أي طريقة">{t("anyMethod")}</option>
                  <option value="واتساب">{t("whatsapp")}</option>
                  <option value="رسائل نصية">{t("sms")}</option>
                  <option value="تليفون">{t("phone")}</option>
                </select>
                <FaCommentDots />
              </div>
              {errors.contactMethod && (
                <div className={styles.errorText}>{errors.contactMethod}</div>
              )}
            </div>

            {/* Wilaya */}
            <div className={styles.inputGroup}>
              <label>{t("state")} *</label>
              <div
                className={`${styles.inputBox} ${errors.wilaya ? styles.inputError : ""}`}
              >
                <select
                  value={selectedWilaya}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedWilaya(value);
                    setSelectedMoughataa("");
                    setFormData({ ...formData, wilaya: value, moughataa: "" });
                    if (errors.wilaya) setErrors({ ...errors, wilaya: "" });
                    if (errors.moughataa)
                      setErrors({ ...errors, moughataa: "" });
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
              {errors.wilaya && (
                <div className={styles.errorText}>{errors.wilaya}</div>
              )}
            </div>

            {/* Moughataa */}
            <div className={styles.inputGroup}>
              <label>{t("province")} *</label>
              <div
                className={`${styles.inputBox} ${errors.moughataa ? styles.inputError : ""}`}
              >
                <select
                  value={selectedMoughataa}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedMoughataa(value);
                    setFormData({ ...formData, moughataa: value });
                    if (errors.moughataa)
                      setErrors({ ...errors, moughataa: "" });
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
              {errors.moughataa && (
                <div className={styles.errorText}>{errors.moughataa}</div>
              )}
            </div>
          </div>

          <button className={styles.submitBtn} onClick={handleRegister}>
            {t("register")}
          </button>
          <div className={styles.registerLink}>
            <span>{t("alreadyMember")}</span>
            <Link to="/login">{t("login")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
