import { Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { File } from "../models/file.model";
import { Folder } from "../models/folder.model";
import { User } from "../models/user.model";
import { AuthRequest } from "../middleware/auth.middleware";

/**
 * Resolve the path of a folder by walking up the parentFolder chain.
 * Returns something like "My files / Projects / React"
 */
const resolveFolderPath = async (folderId: string | null, owner: string): Promise<string> => {
  if (!folderId) return "My files";

  const parts: string[] = [];
  let currentId: string | null = folderId;

  while (currentId) {
    const folder: any= await Folder.findOne({ _id: currentId, owner });
    if (!folder) break;
    parts.unshift(folder.name);
    currentId = folder.parentFolder ? folder.parentFolder.toString() : null;
  }

  return parts.length > 0 ? `My files / ${parts.join(" / ")}` : "My files";
};

/**
 * GET TRASH ITEMS
 * Returns top-level deleted items (files and folders that were directly deleted,
 * not those that were deleted because their parent was deleted).
 */
export const getTrashItems = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner = req.user?.userId;

    // Get all deleted folders for this user
    const deletedFolders = await Folder.find({
      owner,
      isDeleted: true,
    }).sort({ deletedAt: -1 });

    // Filter to only top-level deleted folders
    // A folder is "top-level deleted" if its parent is either null, not deleted, or doesn't exist
    const deletedFolderIds = new Set(deletedFolders.map((f) => f._id.toString()));
    const topLevelFolders = deletedFolders.filter((folder) => {
      if (!folder.parentFolder) return true;
      const parentId = folder.parentFolder.toString();
      // If parent is also in deleted set, this is a child — check if parent was deleted at the same time
      const parent = deletedFolders.find((f) => f._id.toString() === parentId);
      if (!parent) return true;
      // If parent was deleted at the same timestamp (part of recursive delete), skip this child
      if (parent.deletedAt && folder.deletedAt &&
          parent.deletedAt.getTime() === folder.deletedAt.getTime()) {
        return false;
      }
      return true;
    });

    // Get all deleted files
    const deletedFiles = await File.find({
      owner,
      isDeleted: true,
    }).sort({ deletedAt: -1 });

    // Filter to top-level deleted files (not those deleted as part of folder deletion)
    const topLevelFiles = deletedFiles.filter((file) => {
      if (!file.folderId) return true;
      const folderId = file.folderId.toString();
      // If the file's folder is also deleted at the same time, this file was deleted as part of folder deletion
      const folder = deletedFolders.find((f) => f._id.toString() === folderId);
      if (!folder) return true;
      if (folder.deletedAt && file.deletedAt &&
          folder.deletedAt.getTime() === file.deletedAt.getTime()) {
        return false;
      }
      return true;
    });

    // Build response with original location info
    const folderItems = await Promise.all(
      topLevelFolders.map(async (folder) => {
        const originalLocation = await resolveFolderPath(
          folder.parentFolder ? folder.parentFolder.toString() : null,
          owner!
        );
        return {
          ...folder.toObject(),
          itemType: "folder" as const,
          originalLocation,
        };
      })
    );

    const fileItems = await Promise.all(
      topLevelFiles.map(async (file) => {
        const originalLocation = await resolveFolderPath(
          file.folderId ? file.folderId.toString() : null,
          owner!
        );
        return {
          ...file.toObject(),
          itemType: "file" as const,
          originalLocation,
        };
      })
    );

    res.json({
      success: true,
      data: {
        folders: folderItems,
        files: fileItems,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Generate a unique name for restore conflicts.
 */
const getUniqueRestoreName = async (
  name: string,
  parentFolder: string | null,
  owner: string,
  type: "file" | "folder"
): Promise<string> => {
  let newName = name;
  let counter = 1;

  if (type === "folder") {
    while (true) {
      const existing = await Folder.findOne({
        name: newName,
        parentFolder,
        owner,
        isDeleted: false,
      });
      if (!existing) break;
      newName = `${name} (${counter})`;
      counter++;
    }
  } else {
    const ext = path.extname(name);
    const baseName = path.basename(name, ext);
    while (true) {
      const existing = await File.findOne({
        originalName: newName,
        folderId: parentFolder,
        owner,
        isDeleted: false,
      });
      if (!existing) break;
      newName = `${baseName} (${counter})${ext}`;
      counter++;
    }
  }

  return newName;
};

/**
 * Recursively restore a folder and all its descendants.
 */
const recursiveRestore = async (
  folderId: string,
  owner: string,
  originalDeletedAt: Date
): Promise<void> => {
  // Restore files in this folder that were deleted at the same time
  await File.updateMany(
    {
      folderId,
      owner,
      isDeleted: true,
      deletedAt: originalDeletedAt,
    },
    { isDeleted: false, deletedAt: null }
  );

  // Find subfolders that were deleted at the same time
  const subfolders = await Folder.find({
    parentFolder: folderId,
    owner,
    isDeleted: true,
    deletedAt: originalDeletedAt,
  });

  for (const subfolder of subfolders) {
    await recursiveRestore(subfolder._id.toString(), owner, originalDeletedAt);
    subfolder.isDeleted = false;
    subfolder.deletedAt = null;
    await subfolder.save();
  }
};

/**
 * RESTORE ITEM
 */
export const restoreItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'file' or 'folder'
    const owner = req.user?.userId;

    if (!type || !["file", "folder"].includes(type)) {
      res.status(400).json({
        success: false,
        message: "Invalid type. Must be 'file' or 'folder'.",
      });
      return;
    }

    if (type === "file") {
      const file = await File.findOne({ _id: id, owner, isDeleted: true });
      if (!file) {
        res.status(404).json({ success: false, message: "File not found in trash" });
        return;
      }

      // Check if the original folder still exists and is not deleted
      let targetFolderId = file.folderId ? file.folderId.toString() : null;
      if (targetFolderId) {
        const originalFolder = await Folder.findOne({
          _id: targetFolderId,
          owner,
          isDeleted: false,
        });
        if (!originalFolder) {
          // Original folder is deleted or missing — restore to root
          targetFolderId = null;
        }
      }

      // Handle name conflicts
      const restoredName = await getUniqueRestoreName(
        file.originalName,
        targetFolderId,
        owner!,
        "file"
      );

      file.isDeleted = false;
      file.deletedAt = null;
      file.folderId = targetFolderId as any;
      if (restoredName !== file.originalName) {
        file.originalName = restoredName;
      }
      await file.save();

      res.json({
        success: true,
        message: "File restored successfully",
        data: file,
      });
    } else {
      // type === 'folder'
      const folder = await Folder.findOne({ _id: id, owner, isDeleted: true });
      if (!folder) {
        res.status(404).json({ success: false, message: "Folder not found in trash" });
        return;
      }

      // Check if the original parent folder still exists and is not deleted
      let targetParentFolder = folder.parentFolder ? folder.parentFolder.toString() : null;
      if (targetParentFolder) {
        const originalParent = await Folder.findOne({
          _id: targetParentFolder,
          owner,
          isDeleted: false,
        });
        if (!originalParent) {
          targetParentFolder = null;
        }
      }

      // Handle name conflicts
      const restoredName = await getUniqueRestoreName(
        folder.name,
        targetParentFolder,
        owner!,
        "folder"
      );

      // Recursively restore descendants that were deleted at the same time
      if (folder.deletedAt) {
        await recursiveRestore(id, owner!, folder.deletedAt);
      }

      folder.isDeleted = false;
      folder.deletedAt = null;
      folder.parentFolder = targetParentFolder as any;
      if (restoredName !== folder.name) {
        folder.name = restoredName;
      }
      await folder.save();

      res.json({
        success: true,
        message: "Folder restored successfully",
        data: folder,
      });
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Safely delete a physical file from disk.
 * Validates the path is within the uploads directory.
 */
const safeDeletePhysicalFile = (storagePath: string): boolean => {
  try {
    const uploadsDir = path.resolve(process.cwd(), "uploads");
    const resolvedPath = path.resolve(storagePath);

    // Path traversal protection
    if (!resolvedPath.startsWith(uploadsDir)) {
      console.error(`[Trash] Blocked path traversal attempt: ${storagePath}`);
      return false;
    }

    if (fs.existsSync(resolvedPath)) {
      fs.unlinkSync(resolvedPath);
      return true;
    }

    // File already missing — still considered success for cleanup
    return true;
  } catch (err) {
    console.error(`[Trash] Failed to delete physical file: ${storagePath}`, err);
    return false;
  }
};

/**
 * Recursively permanently delete a folder and all its contents.
 * Returns the total size of files deleted.
 */
const recursivePermanentDelete = async (folderId: string, owner: string): Promise<number> => {
  let totalSizeFreed = 0;

  // Delete files in this folder
  const files = await File.find({ folderId, owner });
  for (const file of files) {
    safeDeletePhysicalFile(file.storagePath);
    totalSizeFreed += file.size;
    await File.deleteOne({ _id: file._id });
  }

  // Find and recursively delete subfolders
  const subfolders = await Folder.find({ parentFolder: folderId, owner });
  for (const subfolder of subfolders) {
    totalSizeFreed += await recursivePermanentDelete(subfolder._id.toString(), owner);
    await Folder.deleteOne({ _id: subfolder._id });
  }

  return totalSizeFreed;
};

/**
 * PERMANENTLY DELETE ITEM
 */
export const permanentDeleteItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const owner = req.user?.userId;

    if (!type || !["file", "folder"].includes(type)) {
      res.status(400).json({
        success: false,
        message: "Invalid type. Must be 'file' or 'folder'.",
      });
      return;
    }

    let totalSizeFreed = 0;

    if (type === "file") {
      const file = await File.findOne({ _id: id, owner, isDeleted: true });
      if (!file) {
        res.status(404).json({ success: false, message: "File not found in trash" });
        return;
      }

      safeDeletePhysicalFile(file.storagePath);
      totalSizeFreed = file.size;
      await File.deleteOne({ _id: file._id });
    } else {
      // type === 'folder'
      const folder = await Folder.findOne({ _id: id, owner, isDeleted: true });
      if (!folder) {
        res.status(404).json({ success: false, message: "Folder not found in trash" });
        return;
      }

      totalSizeFreed = await recursivePermanentDelete(id, owner!);
      await Folder.deleteOne({ _id: folder._id });
    }

    // Update storage accounting
    if (totalSizeFreed > 0) {
      await User.findByIdAndUpdate(owner, {
        $inc: { totalStorageUsed: -totalSizeFreed },
      });
    }

    res.json({
      success: true,
      message: "Permanently deleted",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * EMPTY TRASH
 */
export const emptyTrash = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner = req.user?.userId;
    let totalSizeFreed = 0;
    let deletedCount = 0;
    let failedCount = 0;

    // Delete all trashed files
    const trashedFiles = await File.find({ owner, isDeleted: true });
    for (const file of trashedFiles) {
      try {
        safeDeletePhysicalFile(file.storagePath);
        totalSizeFreed += file.size;
        await File.deleteOne({ _id: file._id });
        deletedCount++;
      } catch (err) {
        console.error(`[Trash] Failed to permanently delete file ${file._id}:`, err);
        failedCount++;
      }
    }

    // Delete all trashed folders (children first via reverse sort doesn't matter with deleteOne)
    const trashedFolders = await Folder.find({ owner, isDeleted: true });
    for (const folder of trashedFolders) {
      try {
        await Folder.deleteOne({ _id: folder._id });
        deletedCount++;
      } catch (err) {
        console.error(`[Trash] Failed to permanently delete folder ${folder._id}:`, err);
        failedCount++;
      }
    }

    // Update storage accounting
    if (totalSizeFreed > 0) {
      await User.findByIdAndUpdate(owner, {
        $inc: { totalStorageUsed: -totalSizeFreed },
      });
    }

    res.json({
      success: true,
      message: `Trash emptied. ${deletedCount} items deleted.${failedCount > 0 ? ` ${failedCount} items failed.` : ""}`,
    });
  } catch (err) {
    next(err);
  }
};
