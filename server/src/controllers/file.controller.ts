import { Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { File } from "../models/file.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { ShareLink } from "../models/shareLink.model";

export const getFiles = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = await File.find({
      owner: req.user?.userId,
      isDeleted: false,
    }).sort({ createdAt: -1 }).lean();

    const activeShareLinks = await ShareLink.find({
      owner: req.user?.userId,
      isActive: true,
      $or: [
        { expiresAt: { $gt: new Date() } },
        { expiresAt: null }
      ]
    });
    const sharedIds = new Set(activeShareLinks.map(link => link.resourceId.toString()));

    const filesWithShared = files.map(file => ({
      ...file,
      shared: sharedIds.has(file._id.toString())
    }));

    res.status(200).json({
      success: true,
      data: filesWithShared,
    });
  } catch (err) {
    next(err);
  }
};

export const getFileById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileId } = req.params;

    const file = await File.findOne({
      _id: fileId,
      owner: req.user?.userId,
      isDeleted: false,
    });

    if (!file) {
      res.status(404).json({
        success: false,
        message: "File not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: file,
    });
  } catch (err) {
    next(err);
  }
};

export const createFile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const uploadedFile = (req as any).file;

    if (!uploadedFile) {
      res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
      return;
    }

    const file = await File.create({
      name: uploadedFile.filename,
      originalName: uploadedFile.originalname,
      mimeType: uploadedFile.mimetype,
      size: uploadedFile.size,
      storagePath: uploadedFile.path,
      owner: req.user?.userId,
      folderId: req.body.folderId || null,
      expiresAt: req.body.expiresAt || null,
    });

    res.status(201).json({
      success: true,
      data: file,
    });
  } catch (err) {
    next(err);
  }
};

export const updateFile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileId } = req.params;

    const file = await File.findOneAndUpdate(
      {
        _id: fileId,
        owner: req.user?.userId,
        isDeleted: false,
      },
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!file) {
      res.status(404).json({
        success: false,
        message: "File not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: file,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteFile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileId } = req.params;

    const file = await File.findOneAndUpdate(
      {
        _id: fileId,
        owner: req.user?.userId,
        isDeleted: false,
      },
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      {
        new: true,
      }
    );

    if (!file) {
      res.status(404).json({
        success: false,
        message: "File not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const downloadFile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileId } = req.params;

    const file = await File.findOne({
      _id: fileId,
      owner: req.user?.userId,
      isDeleted: false,
    });

    if (!file) {
      res.status(404).json({
        success: false,
        message: "File not found",
      });
      return;
    }

    if (!fs.existsSync(file.storagePath)) {
      res.status(404).json({
        success: false,
        message: "Physical file is missing from storage",
      });
      return;
    }

    res.download(file.storagePath, file.originalName, (err) => {
      if (err) {
        if (!res.headersSent) {
          next(err);
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

const getUniqueFilename = async (name: string, folderId: string | null, owner: string): Promise<string> => {
  const ext = path.extname(name);
  const baseName = path.basename(name, ext);
  
  let newName = name;
  let counter = 1;
  
  while (true) {
    const existingFile = await File.findOne({
      name: newName,
      folderId,
      owner,
      isDeleted: false,
    });
    
    if (!existingFile) {
      break;
    }
    
    newName = `${baseName} (${counter})${ext}`;
    counter++;
  }
  
  return newName;
};

export const copyFile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileId } = req.params;

    const file = await File.findOne({
      _id: fileId,
      owner: req.user?.userId,
      isDeleted: false,
    });

    if (!file) {
      res.status(404).json({
        success: false,
        message: "File not found",
      });
      return;
    }
    
    const newOriginalName = await getUniqueFilename(file.originalName, file.folderId ? file.folderId.toString() : null, req.user!.userId);
    const newName = await getUniqueFilename(file.name, file.folderId ? file.folderId.toString() : null, req.user!.userId);

    // To prevent data leaks and maintain proper isolation, we will copy the physical file as well
    const ext = path.extname(file.storagePath);
    const uploadDir = path.dirname(file.storagePath);
    const newStoragePath = path.join(uploadDir, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    
    if (fs.existsSync(file.storagePath)) {
      fs.copyFileSync(file.storagePath, newStoragePath);
    } else {
       res.status(404).json({
         success: false,
         message: "Physical file is missing from storage, cannot copy.",
       });
       return;
    }

    const copiedFile = await File.create({
      name: newName,
      originalName: newOriginalName,
      mimeType: file.mimeType,
      size: file.size,
      storagePath: newStoragePath,
      owner: req.user?.userId,
      folderId: file.folderId,
      expiresAt: file.expiresAt,
    });

    res.status(201).json({
      success: true,
      data: copiedFile,
    });
  } catch (err) {
    next(err);
  }
};