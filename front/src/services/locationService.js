import api from "./api";
import i18n from "i18next";

export const getWilayas = async () => {
  const lang = i18n.language; // 👈 اللغة الحالية

  const res = await api.get(`/locations/wilayas?lang=${lang}`);
  return res.data.wilayas;
};

export const getMoughataas = async (wilaya) => {
  const lang = i18n.language; // 👈 نفس الفكرة

  const res = await api.get(
    `/locations/wilayas/${encodeURIComponent(wilaya)}/moughataa?lang=${lang}`
  );

  return res.data.moughataas;
};