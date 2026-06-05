import styles from "./styles.module.css";
import logo from "../../assets/images/logo.png";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaUserCircle,
  FaBell,
  FaSignInAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useEffect, useState, useRef } from "react";

import LanguageSwitcher from "./LanguageSwitcher";
import axios from "axios";

const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  const mobileMenuRef = useRef(null);
  const menuBtnRef = useRef(null);

  const isLoggedIn = !!localStorage.getItem("token");
  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await axios.get("https://api.echeile.com/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUnreadCount = async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        "https://api.echeile.com/api/notifications/unread/count",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.log(err);
    }
  };

  const markAllAsRead = async () => {
    if (!token) return;
    try {
      await axios.put(
        "https://api.echeile.com/api/notifications/mark-all-read",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setUnreadCount(0);
      await fetchUnreadCount();
      await fetchNotifications();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    fetchNotifications();
    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 5000);

    return () => clearInterval(interval);
  }, [isLoggedIn]);

  // ✅ close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutsideNotif =
        notifRef.current && !notifRef.current.contains(event.target);

      const clickedOutsideUser =
        userMenuRef.current && !userMenuRef.current.contains(event.target);

      const clickedOutsideMobileMenu =
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        menuBtnRef.current &&
        !menuBtnRef.current.contains(event.target);

      if (clickedOutsideNotif) setShowNotifMenu(false);

      if (clickedOutsideUser) setShowMenu(false);

      if (clickedOutsideMobileMenu) setMobileMenu(false);
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ close dropdowns on route change
  useEffect(() => {
    setShowMenu(false);
    setShowNotifMenu(false);
    setMobileMenu(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  const MAX_VISIBLE = 7;
  const visibleNotifications = notifications.slice(0, MAX_VISIBLE);
  const hasMore = notifications.length > MAX_VISIBLE;

  return (
    <header className={styles["navbar"]}>
      <div className={styles["logo"]}>
        <Link to="/">
          <img className={styles["logo"]} src={logo} alt="Logo" />
        </Link>
      </div>

      <ul
        ref={mobileMenuRef}
        className={`${styles["nav-links"]} ${
          mobileMenu ? styles["active"] : ""
        }`}
      >
        <li>
          <Link to="/">{t("home")}</Link>
        </li>

        <li>
          <Link to="/statistics">{t("stats")}</Link>
        </li>

        <li>
          <Link to="/support">{t("support")}</Link>
        </li>
      </ul>

      <div className={styles["nav-right"]}>
        <LanguageSwitcher />

        {isLoggedIn && (
          <div className={styles["notif-wrapper"]} ref={notifRef}>
            <button
              className={styles["notif-btn"]}
              onClick={async () => {
                const next = !showNotifMenu;
                setShowNotifMenu(next);
                if (next) await markAllAsRead();
              }}
            >
              <FaBell size={22} />
              {unreadCount > 0 && (
                <span className={styles["notif-badge"]}>{unreadCount}</span>
              )}
            </button>

            {showNotifMenu && (
              <div className={styles["notif-dropdown"]}>
                <h4 className={styles["notif-title"]}>الإشعارات</h4>

                {visibleNotifications.length === 0 ? (
                  <p className={styles["notif-empty"]}>لا يوجد إشعارات</p>
                ) : (
                  <>
                    {visibleNotifications.map((n, index) => (
                      <div
                        key={index}
                        className={styles["notif-item"]}
                        style={{ opacity: n.read ? 0.6 : 1 }}
                      >
                        <p className={styles["notif-text"]}>{n.title}</p>
                        <span className={styles["notif-msg"]}>{n.message}</span>
                      </div>
                    ))}

                    {hasMore && (
                      <div className={styles["notif-more"]}>
                        + {notifications.length - MAX_VISIBLE} إشعارات أخرى
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {!isLoggedIn ? (
          <Link to="/login" className={styles["login-link"]}>
            <button className={styles["login-btn"]}>
              <FaSignInAlt className={styles["login-icon"]} />
              <span>{t("login")}</span>
            </button>
          </Link>
        ) : (
          <div className={styles["user-menu-container"]} ref={userMenuRef}>
            <button
              className={styles["avatar-btn"]}
              onClick={() => setShowMenu(!showMenu)}
            >
              <FaUserCircle size={38} />
            </button>

            {showMenu && (
              <div className={styles["user-dropdown"]}>
                <Link to="/profile" className={styles["dropdown-item"]}>
                  {t("account_settings")}
                </Link>

                <button
                  className={`${styles["dropdown-item"]} ${styles["logout-btn"]}`}
                  onClick={handleLogout}
                >
                  {t("logout")}
                </button>
              </div>
            )}
          </div>
        )}
        <button
          ref={menuBtnRef}
          className={styles["menu-btn"]}
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
