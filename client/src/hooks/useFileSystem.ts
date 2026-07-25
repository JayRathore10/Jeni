import { useState, useEffect, useCallback } from 'react';
import { getFiles, uploadFile, renameFile, deleteFile } from '../api/file.service';
import { getFolders, getFolderContents, createFolder, renameFolder, deleteFolder } from '../api/folder.service';
import { mapBackendFileToItem, mapBackendFolderToItem } from '../types/types';
import type { FileItem } from '../types/types';

export const useFileSystem = (currentFolderId: string | null) => {
  const [items, setItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (currentFolderId) {
        // Fetch contents of a specific folder
        const data = await getFolderContents(currentFolderId);
        const folderItems = (data.folders || []).map(mapBackendFolderToItem);
        const fileItems = (data.files || []).map(mapBackendFileToItem);
        setItems([...folderItems, ...fileItems]);
      } else {
        // Fetch all root level items
        const [allFolders, allFiles] = await Promise.all([
          getFolders(),
          getFiles(),
        ]);
        
        // Filter out items that are inside a folder so we only show root items
        // (Assuming backend returns all items for the user)
        const rootFolders = allFolders.filter((f: any) => !f.parentFolder);
        const rootFiles = allFiles.filter((f: any) => !f.folderId);

        const folderItems = rootFolders.map(mapBackendFolderToItem);
        const fileItems = rootFiles.map(mapBackendFileToItem);
        
        setItems([...folderItems, ...fileItems]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load files');
    } finally {
      setLoading(false);
    }
  }, [currentFolderId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleUpload = async (files: FileList) => {
    try {
      const uploadPromises = Array.from(files).map((file) => 
        uploadFile(file, currentFolderId || undefined)
      );
      await Promise.all(uploadPromises);
      await fetchItems(); // Refresh list after upload
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to upload files');
    }
  };

  const handleCreateFolder = async (name: string) => {
    try {
      await createFolder(name, currentFolderId || null);
      await fetchItems();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create folder');
    }
  };

  const handleRename = async (item: FileItem, newName: string) => {
    try {
      if (item.kind === 'folder') {
        await renameFolder(item.id, newName);
      } else {
        await renameFile(item.id, newName);
      }
      await fetchItems();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to rename item');
    }
  };

  const handleDelete = async (item: FileItem) => {
    try {
      if (item.kind === 'folder') {
        await deleteFolder(item.id);
      } else {
        await deleteFile(item.id);
      }
      await fetchItems();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete item');
    }
  };

  return {
    items,
    loading,
    error,
    refresh: fetchItems,
    handleUpload,
    handleCreateFolder,
    handleRename,
    handleDelete,
  };
};
