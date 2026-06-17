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