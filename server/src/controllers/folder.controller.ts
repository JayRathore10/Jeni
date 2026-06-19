import { Response, NextFunction } from "express";
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