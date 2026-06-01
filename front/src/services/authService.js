import api from "./api";

export const register = async (userData) => {
  const res = await api.post("/auth/register", userData);

  localStorage.setItem("token", res.data.token);

  return res.data;
};
export const login = async (data) => {
  const res = await api.post("/auth/login", data);

  localStorage.setItem("token", res.data.token);

  return res.data;
};

export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};
