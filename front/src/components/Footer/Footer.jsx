import "./Footer.css";

import { Link } from "react-router-dom";

import { FaFacebookF } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { BsChatDotsFill } from "react-icons/bs";

import logo from "../../assets/images/logo.png";

import { useTranslation } from "react-i18next";

import LanguageSwitcher from "../Navbar/LanguageSwitcher";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* LOGO */}

        <div className="footer-logo">
          <Link to="/" className="logo">
            <img
              className="footer-logo"
              src={logo}
              alt="Sangdz Logo"
            />
          </Link>

          <div className="email">
            <MdEmail size={18} />
            <span>admin@sangdz.com</span>
          </div>

          <div className="footer-lang">
            <LanguageSwitcher />
          </div>
        </div>

        {/* LINKS */}

        <div className="footer-links">
          <h3>{t("links")}</h3>

          <ul>
            <li>
              <Link to="/contact">
                {t("contact")}
              </Link>
            </li>

            <li>
              <Link to="/about">
                {t("who")}
              </Link>
            </li>

            <li>
              <Link to="/privacy">
                {t("privacy")}
              </Link>
            </li>

            <li>
              <Link to="/donation-rules">
                {t("donationRules")}
              </Link>
            </li>

            <li>
              <Link to="/donation-benefits">
                {t("donationBenefits")}
              </Link>
            </li>
          </ul>
        </div>

        {/* ABOUT */}

        <div className="footer-about">
           <h3>{t("about")}</h3>

          <p>{t("aboutDesc")}</p>

          <div className="socials">
            <FaFacebookF />

            <BsChatDotsFill />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;