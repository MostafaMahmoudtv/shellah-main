import styles from "./Footer.module.css";

import { Link } from "react-router-dom";

import { FaFacebookF,FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
 
import logo from "../../assets/images/logo.png";

import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className={styles["footer"]}>
      <div className={styles["footer-container"]}>
        {/* LOGO */}

        <div className={styles["footer-logo"]}>
          <Link to="/" className={styles["logo"]}>
            <img
              className={styles["footer-logo"]}
              src={logo}
              alt="Sangdz Logo"
            />
          </Link>

          <div className={styles["email"]}>
            <MdEmail size={18} />
            <span>contact@echeile.com</span>
          </div>
          <div className={styles["company"]}>
            <a
              href="https://elkhayme.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              تطوير شركة الخيمة للخدمات التقنية
            </a>
          </div>
        </div>

        {/* LINKS */}

        <div className={styles["footer-links"]}>
          <h3>{t("links")}</h3>

          <ul>
            <li>
              <Link to="/contact">{t("contact")}</Link>
            </li>

            <li>
              <Link to="/about">{t("who")}</Link>
            </li>

            <li>
              <Link to="/privacy">{t("privacy")}</Link>
            </li>

            <li>
              <Link to="/donation-rules">{t("donationRules")}</Link>
            </li>

            <li>
              <Link to="/donation-benefits">{t("donationBenefits")}</Link>
            </li>
          </ul>
        </div>

        {/* ABOUT */}

        <div className={styles["footer-about"]}>
          <h3>{t("about")}</h3>

          <p>{t("aboutDesc")}</p>

          <div className={styles["socials"]}>
            <a
              href="https://www.facebook.com/share/1HKNc9e3e6/?mibextid=wwXIfr

"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://wa.me/22249682731"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
        <div className={styles["company-mobile"]}>
          <a
            href="https://elkhayme.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            تطوير شركة الخيمة للخدمات التقنية
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
