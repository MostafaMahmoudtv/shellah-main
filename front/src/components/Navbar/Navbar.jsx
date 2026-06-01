import "./Navbar.css";
import logo from "../../assets/images/logo.png";

import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";

import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/");

    window.location.reload();
  };

  return (
    <header className="navbar">
      <div className="logo">
        <Link to="/">
          <img
            className="logo"
            src={logo}
            alt="Bastala Logo"
          />
        </Link>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/">{t("home")}</Link>
        </li>

        <li>
          <Link to="/statistics">
            {t("stats")}
          </Link>
        </li>

        <li>
          <Link to="/support">
            {t("support")}
          </Link>
        </li>
      </ul>

      <div className="nav-right">
        <LanguageSwitcher />

        {!isLoggedIn ? (
          <Link to="/login">
            <button className="login-btn">
              {t("login")}
            </button>
          </Link>
        ) : (
          <div className="user-menu-container">
            <button
              className="avatar-btn"
              onClick={() =>
                setShowMenu(!showMenu)
              }
            >
              <FaUserCircle size={38} />
            </button>

            {showMenu && (
              <div className="user-dropdown">
                <Link
                  to="/profile"
                  className="dropdown-item"
                  onClick={() =>
                    setShowMenu(false)
                  }
                >
                  الملف الشخصي
                </Link>

                <Link
                  to="/profile"
                  className="dropdown-item"
                  onClick={() =>
                    setShowMenu(false)
                  }
                >
                  إعدادات الحساب
                </Link>

                <button
                  className="dropdown-item logout-btn"
                  onClick={handleLogout}
                >
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;