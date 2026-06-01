import { Outlet, NavLink } from "react-router-dom";
import {
  FiUser,
  FiLock,
  FiSettings,
} from "react-icons/fi";

const ProfileLayout = () => {
  return (
    <div className="main-profile-page">
      <div className="settings-layout">

        <div className="profile-content">
          <Outlet />
        </div>

        <aside className="settings-sidebar">
          <NavLink
            to="/profile"
            end
            className="sidebar-item"
          >
            <FiUser />
            <span>المعلومات الشخصية</span>
          </NavLink>

          <NavLink
            to="/profile/security"
            className="sidebar-item"
          >
            <FiLock />
            <span>كلمة المرور والأمان</span>
          </NavLink>

          <NavLink
            to="/profile/settings"
            className="sidebar-item"
          >
            <FiSettings />
            <span>إعدادات الحساب</span>
          </NavLink>
        </aside>

      </div>
    </div>
  );
};

export default ProfileLayout;