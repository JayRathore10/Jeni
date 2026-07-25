import api from "./axios";

export const getFolders = async () => {
  const { data } = await api.get("/folder");
  return data.data;
};

export const getFolderContents = async (folderId: string) => {
  const { data } = await api.get(`/folder/${folderId}/contents`);
  return data.data; // usually { folders: [], files: [] }
};

export const createFolder = async (name: string, parentFolder: string | null = null) => {
  const { data } = await api.post("/folder", { name, parentFolder });
  return data.data;
};

export const renameFolder = async (folderId: string, name: string) => {
  const { data } = await api.patch(`/folder/${folderId}`, { name });
  return data.data;
};

export const deleteFolder = async (folderId: string) => {
  const { data } = await api.delete(`/folder/${folderId}`);
  return data;
};
