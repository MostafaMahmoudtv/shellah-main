import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Statistics from "../pages/Statistics/Statistics";

import Dashboard from "../pages/Dashboard/Dashboard";
import Support from "../pages/Support/SupportUs";
import Privacy from "../pages/Privacy/Privacy";
import Donation from "../pages/DonationConditions/DonationConditions";
import DonationB from "../pages/DonationBenefits/DonationBenefits";
import Contact from "./../pages/Contact/Contact";
import Login from "./../pages/Login/Login";
import Register from './../pages/Register/Register';
const AppRoutes = () => {
  return (
    <Routes>
      {/* صفحات الموقع */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/support" element={<Support />} />{" "}
        <Route path="/donation-rules" element={<Donation />} />{" "}
        <Route path="/donation-benefits" element={<DonationB />} />{" "}
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Route>

      {/* صفحات الداشبورد */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
