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

export const renameFile = async (fileId: string, name: string) => {
  const { data } = await api.patch(`/file/${fileId}`, { name });
  return data.data;
};

export const deleteFile = async (fileId: string) => {
  const { data } = await api.delete(`/file/${fileId}`);
  return data;
};
