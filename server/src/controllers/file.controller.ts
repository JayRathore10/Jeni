import { Response, NextFunction } from "express";
import { File } from "../models/file.model";
import { AuthRequest } from "../middleware/auth.middleware";

export const getFiles = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = await File.find({
      owner: req.user?.userId,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: files,
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