import axios from "axios";

const api = axios.create({
  baseURL: "https://api.echeile.com/api",
});

// ===============================
// Request Interceptor (Add Token)
// ===============================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ===============================
// Response Interceptor (Global Error Handling)
// ===============================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // remove auth data فقط (بدون reload)
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      // ❌ مهم جدًا: منع reload الكامل
      // window.location.href = "/login";  <-- تم حذفه

      // بدلها: نرسل event للتطبيق
      window.dispatchEvent(new Event("auth:logout"));
    }

    return Promise.reject(error);
  },
);

export default api;
