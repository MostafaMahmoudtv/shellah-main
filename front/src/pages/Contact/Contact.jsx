import "./Contact.css";

import { useTranslation } from "react-i18next";

import {
  FaUser,
} from "react-icons/fa";

import {
  MdEmail,
} from "react-icons/md";

const Contact = () => {
  const { t } = useTranslation();

  return (
    <section className="contact-page">

      <div className="contact-container">

        <div className="contact-header">

          <h1>{t("contactTitle")}</h1>

          <p>
            {t("contactDesc")}
          </p>

        </div>

        <form className="contact-form">

          {/* NAME */}

          <div className="input-group">

            <label>
              {t("name")}
            </label>

            <div className="input-wrapper">

              <input
                type="text"
                placeholder={t("namePlaceholder")}
              />

              <FaUser className="input-icon" />

            </div>

          </div>

          {/* EMAIL */}

          <div className="input-group">

            <label>
              {t("email")}
            </label>

            <div className="input-wrapper">

              <input
                type="email"
                placeholder={t("emailPlaceholder")}
              />

              <MdEmail className="input-icon" />

            </div>

          </div>

          {/* MESSAGE */}

          <div className="input-group">

            <label>
              {t("message")}
            </label>

            <textarea
              rows="6"
              placeholder={t("messagePlaceholder")}
            />

          </div>

          <button type="submit">
            {t("send")}
          </button>

        </form>

      </div>

    </section>
  );
};

export default Contact;