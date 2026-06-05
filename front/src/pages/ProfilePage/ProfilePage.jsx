import { useEffect, useState } from "react";
import axios from "axios";
import i18n from "i18next";
import { getWilayas, getMoughataas } from "../../services/locationService";
import styles from "./ProfilePage.module.css";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
const API_URL = "https://api.echeile.com";

const ProfilePage = () => {
  const { t } = useTranslation();

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

  // 👇 reload data when language changes
  useEffect(() => {
    loadWilayas();
    fetchUser();

    // reset dependent state
    setSelectedWilaya("");
    setSelectedMoughataa("");
    setMoughataas([]);
  }, [i18n.language]);

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

      Swal.fire({
        icon: "success",
        title: t("profilePopupSuccessTitle"),
        text: t("profileUpdatedSuccess"),
        confirmButtonText: t("profilePopupConfirm"),
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: t("profilePopupErrorTitle"),
        text: t("profileUpdatedError"),
        confirmButtonText: t("profilePopupConfirm"),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles["profile-page"]}>
      <div className={styles["settings-layout"]}>
        <div className={styles["profile-card"]}>
          <h2 className={styles["profile-title"]}>
            {t("profileAccountInfoTitle")}
          </h2>

          <form className={styles["profile-form"]} onSubmit={handleSubmit}>
            <div className={styles["form-group"]}>
              <label>{t("profileNameLabel")}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className={styles["form-group"]}>
              <label>{t("profilePhoneLabel")}</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className={styles["form-group"]}>
              <label>{t("profileEmailLabel")}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className={styles["form-group"]}>
              <label>{t("profileBloodTypeLabel")}</label>
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
              >
                <option value="">{t("profileSelectBloodType")}</option>
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

            <div className={styles["form-group"]}>
              <label>{t("profileWilayaLabel")}</label>

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
                <option value="">{t("profileSelectWilaya")}</option>

                {wilayas.map((wilaya, index) => (
                  <option key={index} value={wilaya}>
                    {wilaya}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles["form-group"]}>
              <label>{t("profileMoughataaLabel")}</label>

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
                  {selectedWilaya
                    ? t("profileSelectMoughataa")
                    : t("profileSelectWilayaFirst")}
                </option>

                {moughataas.map((moughataa, index) => (
                  <option key={index} value={moughataa}>
                    {moughataa}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles["form-group"]}>
              <label>{t("profileContactMethodLabel")}</label>

              <select
                name="contactMethod"
                value={formData.contactMethod}
                onChange={handleChange}
              >
                <option value="">{t("profileAnyContactMethod")}</option>

                <option value="phone">{t("profileSmsContact")}</option>

                <option value="whatsapp">{t("profilePhoneContact")}</option>

                <option value="telegram">{t("profileWhatsappContact")}</option>
              </select>
            </div>

            <div className={styles["form-group"]}>
              <label>{t("profileContactTimeLabel")}</label>

              <select
                name="preferredContactTime"
                value={formData.preferredContactTime}
                onChange={handleChange}
              >
                <option value="">{t("profileAnyTime")}</option>

                <option value="morning">{t("profileMorning")}</option>

                <option value="afternoon">{t("profileAfternoon")}</option>

                <option value="evening">{t("profileEvening")}</option>
              </select>
            </div>

            <div className={styles["actions"]}>
              <button
                type="submit"
                className={styles["save-btn"]}
                disabled={saving}
              >
                {saving ? t("profileSavingButton") : t("profileSaveButton")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
