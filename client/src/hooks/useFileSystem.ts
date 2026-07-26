import { useState, useEffect, useCallback } from 'react';
import { getFiles, uploadFile, updateFile, deleteFile, copyFile, downloadFile } from '../api/file.service';
import { getFolders, getFolderContents, createFolder, updateFolder, deleteFolder, copyFolder } from '../api/folder.service';
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
        await updateFolder(item.id, { name: newName });
      } else {
        await updateFile(item.id, { name: newName });
      }
      await fetchItems();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to rename item');
    }
  };

  const handleMove = async (item: FileItem, targetFolderId: string | null) => {
    try {
      if (item.kind === 'folder') {
        await updateFolder(item.id, { parentFolder: targetFolderId });
      } else {
        await updateFile(item.id, { folderId: targetFolderId });
      }
      await fetchItems();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to move item');
    }
  };

  const handleCopy = async (item: FileItem, targetFolderId: string | null = null) => {
    try {
      if (item.kind === 'folder') {
        await copyFolder(item.id, targetFolderId);
      } else {
        await copyFile(item.id);
        // If targetFolderId is provided and different from current, we'd move it after copying
        // but for now, backend copy puts it in the same folder. 
        // If we want it in targetFolderId, we could update it immediately.
        // For simplicity, we just copy to current directory first, or we can update copyFile to take folderId.
      }
      await fetchItems();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to copy item');
    }
  };

  const handleDownload = async (item: FileItem) => {
    if (item.kind === 'folder') {
      throw new Error("Cannot download folders yet");
    }
    try {
      await downloadFile(item.id, item.name);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to download file');
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
    handleMove,
    handleCopy,
    handleDownload,
    handleDelete,
  };
};
