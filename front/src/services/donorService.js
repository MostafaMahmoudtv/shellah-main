import api from "./api";

export const searchDonors = async (params) => {
  const res = await api.get("/donors/search", {
    params,
  });

  return res.data;
};

export const getProfile = async () => {
  const res = await api.get("/donors/profile");
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await api.put("/donors/profile", data);
  return res.data;
};