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

export const updateFolder = async (folderId: string, updates: any) => {
  const { data } = await api.patch(`/folder/${folderId}`, updates);
  return data.data;
};

export const deleteFolder = async (folderId: string) => {
  const { data } = await api.delete(`/folder/${folderId}`);
  return data;
};

export const copyFolder = async (folderId: string, parentFolder: string | null = null) => {
  const { data } = await api.post(`/folder/${folderId}/copy`, { parentFolder });
  return data.data;
};
