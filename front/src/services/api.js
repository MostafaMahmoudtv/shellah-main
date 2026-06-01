import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ===============================
// Request Interceptor (Add Token)
// ===============================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // نخليها آمنة لو مفيش headers أصلاً
    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===============================
// Response Interceptor (Global Error Handling)
// ===============================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // لو التوكن انتهى أو المستخدم غير مصرح
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      // نوجهه للوجين بدون ما نكسر التطبيق
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;