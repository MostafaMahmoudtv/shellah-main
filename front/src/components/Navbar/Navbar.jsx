import "./Navbar.css";
import logo from "../../assets/images/logo.png";

import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const { t } = useTranslation();

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

        <Link to="/login">
          <button className="login-btn">
            {t("login")}
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;