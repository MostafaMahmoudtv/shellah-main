import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import ProtectedRoute from "../routes/ProtectedRoute";

// ======================
// Public Pages
// ======================
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Statistics from "../pages/Statistics/Statistics";
import Support from "../pages/Support/SupportUs";
import Privacy from "../pages/Privacy/Privacy";
import Donation from "../pages/DonationConditions/DonationConditions";
import DonationB from "../pages/DonationBenefits/DonationBenefits";
import Contact from "../pages/Contact/Contact";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import SearchDonors from "../pages/Search/SearchDonors";

// Profile
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import Password from "../pages/ProfilePage/Password/Password";
import SettingsPage from "../pages/ProfilePage/SettingsPage/SettingsPage";
import ProfileLayout from "../pages/ProfilePage/ProfileLayout";

// ======================
// Dashboard Pages
// ======================
import Dashboard from "../pages/Dashboard/Dashboard";
import Users from "../pages/Dashboard/User";
import UserDetails from "../pages/Dashboard/UserDetails";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ======================
          PUBLIC ROUTES
      ====================== */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/support" element={<Support />} />
        <Route path="/donation-rules" element={<Donation />} />
        <Route path="/donation-benefits" element={<DonationB />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/search" element={<SearchDonors />} />

        {/* Profile */}
        <Route path="/profile" element={<ProfileLayout />}>
          <Route index element={<ProfilePage />} />
          <Route path="security" element={<Password />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* ======================
          DASHBOARD (PROTECTED)
      ====================== */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<UserDetails />} />
      </Route>

    </Routes>
  );
};

export default AppRoutes;