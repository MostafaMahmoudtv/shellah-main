import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";

function App() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  // =========================
  // Language direction handler
  // =========================
  useEffect(() => {
    document.documentElement.dir =
      i18n.language === "ar" ? "rtl" : "ltr";

    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // =========================
  // Global logout handler (NO RELOAD)
  // =========================
  useEffect(() => {
    const handleLogout = () => {
      navigate("/login", { replace: true });
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, [navigate]);

  return <AppRoutes />;
}

export default App;