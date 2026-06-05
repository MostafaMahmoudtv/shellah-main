// components/Layout.jsx
import Sidebar from "./Sidebar/Sidebar";
import styles from "./Layout.module.css";
export default function Layout({ children }) {
  return (
    <div className={styles.dashContainer}>
      <Sidebar />
      <div className={styles.dashBg}>
        {children}
      </div>
    </div>
  );
}