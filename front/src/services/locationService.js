import api from "./api";

export const getWilayas = async () => {
  const res = await api.get("/locations/wilayas");
  return res.data.wilayas;
};

export const getMoughataas = async (wilaya) => {
  const res = await api.get(
    `/locations/wilayas/${encodeURIComponent(wilaya)}/moughataa`
  );

  return res.data.dairas;
};