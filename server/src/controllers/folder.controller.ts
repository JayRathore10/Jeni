import { Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { Folder } from "../models/folder.model";
import { File } from "../models/file.model";
import { AuthRequest } from "../middleware/auth.middleware";

/**
 * CREATE FOLDER
 */
export const createFolder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, parentFolder } = req.body;

    const folder = await Folder.create({
      name,
      owner: req.user?.userId,
      parentFolder: parentFolder || null,
    });

    res.status(201).json({
      success: true,
      data: folder,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET ALL FOLDERS (USER)
 */
export const getFolders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const folders = await Folder.find({
      owner: req.user?.userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: folders,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET SINGLE FOLDER
 */
export const getFolderById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderId } = req.params;

    const folder = await Folder.findOne({
      _id: folderId,
      owner: req.user?.userId,
    });

    if (!folder) {
      res.status(404).json({
        success: false,
        message: "Folder not found",
      });
      return;
    }

    res.json({
      success: true,
      data: folder,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * UPDATE FOLDER (rename / move)
 */
export const updateFolder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderId } = req.params;
    const { name, parentFolder } = req.body;

    if (parentFolder !== undefined) {
      if (parentFolder === folderId) {
        res.status(400).json({ success: false, message: "Cannot move a folder into itself" });
        return;
      }
      
      if (parentFolder !== null) {
        let currentParentId = parentFolder;
        while (currentParentId) {
          const p = await Folder.findOne({ _id: currentParentId, owner: req.user?.userId });
          if (!p) break;
          if (p._id.toString() === folderId) {
            res.status(400).json({ success: false, message: "Cannot move a folder into its own descendant" });
            return;
          }
          currentParentId = p.parentFolder;
        }
      }
    }

    const folder = await Folder.findOneAndUpdate(
      {
        _id: folderId,
        owner: req.user?.userId,
      },
      {
        $set: {
          ...(name && { name }),
          ...(parentFolder !== undefined && {
            parentFolder: parentFolder || null,
          }),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!folder) {
      res.status(404).json({
        success: false,
        message: "Folder not found",
      });
      return;
    }

    res.json({
      success: true,
      data: folder,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE FOLDER + ITS FILES
 */
export const deleteFolder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderId } = req.params;

    const folder = await Folder.findOneAndDelete({
      _id: folderId,
      owner: req.user?.userId,
    });

    if (!folder) {
      res.status(404).json({
        success: false,
        message: "Folder not found",
      });
      return;
    }

    // delete all files inside folder
    await File.deleteMany({
      folderId,
      owner: req.user?.userId,
    });

    res.json({
      success: true,
      message: "Folder deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET FOLDER CONTENTS (FILES + SUBFOLDERS)
 */
export const getFolderContents = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderId } = req.params;

    const folders = await Folder.find({
      parentFolder: folderId,
      owner: req.user?.userId,
    });

    const files = await File.find({
      folderId,
      owner: req.user?.userId,
      isDeleted: false,
    });

    res.json({
      success: true,
      data: {
        folders,
        files,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getUniqueFolderName = async (name: string, parentFolder: string | null, owner: string): Promise<string> => {
  let newName = name;
  let counter = 1;
  
  while (true) {
    const existingFolder = await Folder.findOne({
      name: newName,
      parentFolder,
      owner,
    });
    
    if (!existingFolder) {
      break;
    }
    
    newName = `${name} (${counter})`;
    counter++;
  }
  
  return newName;
};

const recursiveCopyFolder = async (sourceFolderId: string, destParentFolderId: string | null, owner: string, isRoot = false): Promise<any> => {
  const sourceFolder = await Folder.findOne({ _id: sourceFolderId, owner });
  if (!sourceFolder) return null;

  let newName = sourceFolder.name;
  if (isRoot) {
    newName = await getUniqueFolderName(sourceFolder.name, destParentFolderId, owner);
  }

  const newFolder = await Folder.create({
    name: newName,
    owner,
    parentFolder: destParentFolderId,
  });

  // Copy files inside this folder
  const files = await File.find({ folderId: sourceFolderId, owner, isDeleted: false });
  for (const file of files) {
    const ext = path.extname(file.storagePath);
    const uploadDir = path.dirname(file.storagePath);
    const newStoragePath = path.join(uploadDir, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    
    if (fs.existsSync(file.storagePath)) {
      fs.copyFileSync(file.storagePath, newStoragePath);
    }
    
    await File.create({
      name: file.name, // original internal name can be same since it's in a different folder now (or it might collide if we don't ensure folder-level uniqueness, but file name is globally unique by multer)
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      storagePath: newStoragePath,
      owner,
      folderId: newFolder._id,
      expiresAt: file.expiresAt,
    });
  }

  // Copy subfolders
  const subfolders = await Folder.find({ parentFolder: sourceFolderId, owner });
  for (const subfolder of subfolders) {
    await recursiveCopyFolder(subfolder._id.toString(), newFolder._id.toString(), owner);
  }

  return newFolder;
};

export const copyFolder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { folderId } = req.params;

    const newFolder = await recursiveCopyFolder(folderId, req.body.parentFolder || null, req.user!.userId, true);

    if (!newFolder) {
      res.status(404).json({
        success: false,
        message: "Folder not found",
      });
      return;
    }

    res.status(201).json({
      success: true,
      data: newFolder,
    });
  } catch (err) {
    next(err);
  }
};