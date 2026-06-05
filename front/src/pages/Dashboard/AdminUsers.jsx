import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Dashboard/Layout";
import { getWilayas, getMoughataas } from "../../services/locationService";
import styles from "./AdminUsers.module.css";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

export default function AdminUsers() {
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "", // 👈 اختياري
    password: "",
    bloodType: "",
    wilaya: "",
    moughataa: "",
  });

  const [wilayas, setWilayas] = useState([]);
  const [moughataas, setMoughataas] = useState([]);

  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedMoughataa, setSelectedMoughataa] = useState("");

  const token = localStorage.getItem("token");

  // =========================
  // Fetch Users
  // =========================
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://api.echeile.com/api/super-admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const filtered = res.data.users.filter(
        (user) => user.role === "admin" || user.role === "super_admin",
      );

      const sortedUsers = filtered.sort((a, b) => {
        if (a.role === "super_admin" && b.role !== "super_admin") return -1;
        if (a.role !== "super_admin" && b.role === "super_admin") return 1;
        return 0;
      });

      setUsers(sortedUsers);
    } catch (err) {
      console.log("Fetch Users Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Load Wilayas
  // =========================
  useEffect(() => {
    const loadWilayas = async () => {
      try {
        const data = await getWilayas();
        setWilayas(data);
      } catch (err) {
        console.log(err);
      }
    };

    loadWilayas();
    fetchUsers();
  }, []);

  // =========================
  // Load Moughataas
  // =========================
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
        console.log(err);
      }
    };

    loadMoughataas();
  }, [selectedWilaya]);

  // =========================
  // Delete Admin
  // =========================
  const deleteAdmin = async (id, role) => {
    if (role === "super_admin") {
      Swal.fire({
        icon: "error",
        title: "غير مسموح",
        text: "لا يمكن حذف السوبر أدمن",
        confirmButtonText: "حسناً",
      });
      return;
    }

    const result = await Swal.fire({
      title: "تأكيد الحذف",
      text: "هل أنت متأكد من حذف هذا الأدمن؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(
        `https://api.echeile.com/api/super-admin/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUsers((prev) => prev.filter((user) => user._id !== id));

      Swal.fire({
        icon: "success",
        title: "تم الحذف بنجاح",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "فشل الحذف",
        text: err?.response?.data?.message || "حدث خطأ أثناء الحذف",
      });
    }
  };

  // =========================
  // إنشاء أدمن
  // =========================
  const createAdmin = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        email: form.email?.trim() || undefined,
      };

      await axios.post(
        "https://api.echeile.com/api/super-admin/create-admin",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setForm({
        name: "",
        phone: "",
        email: "",
        password: "",
        bloodType: "",
        wilaya: "",
        moughataa: "",
      });

      setSelectedWilaya("");
      setSelectedMoughataa("");

      fetchUsers();

      Swal.fire({
        icon: "success",
        title: "تم الإنشاء بنجاح",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "فشل الإنشاء",
        text: err?.response?.data?.message || "حدث خطأ أثناء الإنشاء",
      });
    }
  };
  return (
    <Layout>
      <div className={styles["admin-users-page"]}>
        <h2 className={styles.pageTitle}>{t("adminTitle")}</h2>

        {/* ================= إنشاء أدمن ================= */}
        <div className={styles.formCard}>
          <div className={styles.formCardBody}>
            <h4 className={styles.sectionTitle}>{t("createAdminTitle")}</h4>

            <form onSubmit={createAdmin} className={styles.adminForm}>
              {/* الاسم */}
              <div className={styles.formGroup}>
                <input
                  className={styles.inputField}
                  placeholder={t("name")}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              {/* الهاتف */}
              <div className={styles.formGroup}>
                <input
                  className={styles.inputField}
                  placeholder={t("phone")}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>

              {/* البريد */}
              <div className={styles.formGroup}>
                <input
                  type="email"
                  className={styles.inputField}
                  placeholder={t("email")}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              {/* كلمة المرور */}
              <div className={styles.formGroup}>
                <input
                  type="password"
                  className={styles.inputField}
                  placeholder={t("password")}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>

              {/* فصيلة الدم */}
              <div className={styles.formGroup}>
                <select
                  className={styles.selectField}
                  value={form.bloodType}
                  onChange={(e) =>
                    setForm({ ...form, bloodType: e.target.value })
                  }
                  required
                >
                  <option value="">{t("selectBlood")}</option>
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

              {/* الولاية */}
              <div className={styles.formGroup}>
                <select
                  className={styles.selectField}
                  value={selectedWilaya}
                  onChange={(e) => {
                    const value = e.target.value;

                    setSelectedWilaya(value);
                    setSelectedMoughataa("");

                    setForm({
                      ...form,
                      wilaya: value,
                      moughataa: "",
                    });
                  }}
                  required
                >
                  <option value="">{t("selectWilaya")}</option>

                  {wilayas.map((wilaya, index) => (
                    <option key={index} value={wilaya}>
                      {wilaya}
                    </option>
                  ))}
                </select>
              </div>

              {/* المقاطعة */}
              <div className={styles.formGroup}>
                <select
                  className={styles.selectField}
                  value={selectedMoughataa}
                  onChange={(e) => {
                    const value = e.target.value;

                    setSelectedMoughataa(value);

                    setForm({
                      ...form,
                      moughataa: value,
                    });
                  }}
                  disabled={!selectedWilaya}
                  required
                >
                  <option value="">
                    {selectedWilaya
                      ? t("selectMoughataa")
                      : t("selectWilayaFirst")}
                  </option>

                  {moughataas.map((moughataa, index) => (
                    <option key={index} value={moughataa}>
                      {moughataa}
                    </option>
                  ))}
                </select>
              </div>

              {/* زر الإنشاء */}
              <div className={styles.fullWidth}>
                <button type="submit" className={styles.submitButton}>
                  {t("create")}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ================= الجدول ================= */}
        <div className={styles.tableCard}>
          <div className={styles.tableCardBody}>
            <h4 className={styles.sectionTitle}>{t("adminListTitle")}</h4>

            {loading ? (
              <p>{t("loading")}</p>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.usersTable}>
                  <thead>
                    <tr>
                      <th>{t("tableName")}</th>
                      <th>{t("tablePhone")}</th>
                      <th>{t("tableEmail")}</th>
                      <th>{t("tableRole")}</th>
                      <th>{t("tableActions")}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.phone}</td>
                        <td>{user.email}</td>

                        <td>
                          <span
                            className={
                              user.role === "super_admin"
                                ? styles.roleBadgeSuper
                                : styles.roleBadgeAdmin
                            }
                          >
                            {user.role === "super_admin"
                              ? t("roleSuperAdmin")
                              : t("roleAdmin")}
                          </span>
                        </td>

                        <td>
                          {user.role !== "super_admin" && (
                            <button
                              className={styles.deleteButton}
                              onClick={() => deleteAdmin(user._id, user.role)}
                            >
                              {t("delete")}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}

                    {users.length === 0 && (
                      <tr>
                        <td colSpan="5" className={styles.emptyTable}>
                          {t("noUsers")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
