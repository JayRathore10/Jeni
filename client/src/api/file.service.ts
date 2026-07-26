import api from "./axios";

export const getFiles = async () => {
  const { data } = await api.get("/file");
  return data.data; // backend returns { success: true, data: [...] }
};

export const uploadFile = async (file: File, folderId?: string) => {
  const formData = new FormData();
  formData.append("file", file);
  if (folderId) {
    formData.append("folderId", folderId);
  }

  const { data } = await api.post("/file", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data.data;
};

export const updateFile = async (fileId: string, updates: any) => {
  const { data } = await api.patch(`/file/${fileId}`, updates);
  return data.data;
};

export const deleteFile = async (fileId: string) => {
  const { data } = await api.delete(`/file/${fileId}`);
  return data;
};

export const copyFile = async (fileId: string) => {
  const { data } = await api.post(`/file/${fileId}/copy`);
  return data.data;
};

export const downloadFile = async (fileId: string, filename: string) => {
  const response = await api.get(`/file/${fileId}/download`, {
    responseType: 'blob',
  });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
};
