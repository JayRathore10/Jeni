import api from "./axios";

export interface CreateShareLinkParams {
  resourceType: "file" | "folder";
  resourceId: string;
  expiresAt: string | null;
  password?: string | null;
  maxDownloads?: number | null;
}

export interface UpdateShareLinkParams {
  expiresAt?: string | null;
  maxDownloads?: number | null;
  password?: string | null;
  passwordChanged?: boolean;
  isActive?: boolean;
}

export const createShareLink = async (params: CreateShareLinkParams) => {
  const { data } = await api.post("/share", params);
  return data.data;
};

export const getMyShareLinks = async () => {
  const { data } = await api.get("/share/my");
  return data.data;
};

export const updateShareLink = async (id: string, updates: UpdateShareLinkParams) => {
  const { data } = await api.patch(`/share/${id}`, updates);
  return data.data;
};

export const deleteShareLink = async (id: string) => {
  const { data } = await api.delete(`/share/${id}`);
  return data;
};

export const getShareLinkStats = async (id: string) => {
  const { data } = await api.get(`/share/${id}/stats`);
  return data.data;
};

export const getPublicShareInfo = async (token: string) => {
  const { data } = await api.get(`/share/${token}`);
  return data.data;
};

export const downloadSharedFile = async (token: string, filename: string, password?: string) => {
  const response = await api.post(`/share/download/${token}`, { password }, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
};
