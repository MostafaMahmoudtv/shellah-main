import api from "./api";

export const getAllDonors = async () => {
  const res = await api.get("/admin/donors");
  return res.data;
};

export const getStats = async () => {
  const res = await api.get("/admin/stats");
  return res.data;
};

export const updateDonor = async (id, data) => {
  const res = await api.put(`/admin/donors/${id}`, data);
  return res.data;
};

export const deleteDonor = async (id) => {
  const res = await api.delete(`/admin/donors/${id}`);
  return res.data;
};