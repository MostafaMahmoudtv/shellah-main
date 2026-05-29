import api from "./api";

export const getUsers = async () => {
  const res = await api.get("/super-admin/users");
  return res.data;
};

export const exportDonors = async () => {
  const res = await api.get("/export/donors", {
    responseType: "blob",
  });

  return res.data;
};

export const exportAllUsers = async () => {
  const res = await api.get("/export/all-users", {
    responseType: "blob",
  });

  return res.data;
};