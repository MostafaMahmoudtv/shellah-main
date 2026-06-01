import { useEffect, useState } from "react";
import api from "../../services/api";
import "./notifications.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // =========================
  // GET ALL NOTIFICATIONS
  // =========================
  const getNotifications = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/notifications");

      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UNREAD COUNT
  // =========================
  const getUnreadCount = async () => {
    try {
      const res = await api.get("/api/notifications/unread/count");

      setUnreadCount(res.data.count || 0);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // MARK AS READ
  // =========================
  const markAsRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);

      // refresh
      getNotifications();
      getUnreadCount();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getNotifications();
    getUnreadCount();
  }, []);

  return (
    <div className="notifications-page">

      {/* Header */}
      <div className="header">
        <h2>Notifications</h2>
        <span className="badge">
          Unread: {unreadCount}
        </span>
      </div>

      {/* Content */}
      <div className="notifications-box">

        {loading ? (
          <p>Loading...</p>
        ) : notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`notification ${n.isRead ? "read" : "unread"}`}
            >
              <div className="message">
                {n.message}
              </div>

              <div className="actions">
                {!n.isRead && (
                  <button onClick={() => markAsRead(n._id)}>
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))
        )}

      </div>

    </div>
  );
}