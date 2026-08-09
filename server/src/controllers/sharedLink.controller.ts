import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import fs from "fs";
import { ShareLink } from "../models/shareLink.model";
import { File } from "../models/file.model";
import { Folder } from "../models/folder.model";
import { DownloadLog } from "../models/downloadLog.model";
import { AuthRequest } from "../middleware/auth.middleware";

// Create Share Link
export const createShareLink = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const {
      resourceType,
      resourceId,
      expiresAt,
      password,
      maxDownloads,
    } = req.body;

    const owner = req.user?.userId;
    if (!owner) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    // Verify resource exists and belongs to owner
    if (resourceType === "file") {
      const file = await File.findOne({ _id: resourceId, owner, isDeleted: false });
      if (!file) {
        res.status(404).json({ success: false, message: "File not found or deleted" });
        return;
      }
    } else {
      const folder = await Folder.findOne({ _id: resourceId, owner, isDeleted: false });
      if (!folder) {
        res.status(404).json({ success: false, message: "Folder not found or deleted" });
        return;
      }
    }

    const token = crypto.randomBytes(32).toString("hex");

    let hashedPassword = null;
    if (password && password.trim() !== "") {
      hashedPassword = await bcrypt.hash(password.trim(), 10);
    }

    const shareLink = await ShareLink.create({
      token,
      owner,
      resourceType,
      resourceId,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      password: hashedPassword,
      maxDownloads: maxDownloads || null,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      data: shareLink,
    });
  } catch (error) {
    next(error);
  }
};

// Get Share Link details by Token (Public)
export const getShareLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;

    const shareLink = await ShareLink.findOne({ token });

    if (!shareLink) {
      res.status(404).json({
        success: false,
        message: "Share link not found",
      });
      return;
    }

    if (!shareLink.isActive) {
      res.status(403).json({
        success: false,
        message: "This link has been disabled.",
      });
      return;
    }

    if (shareLink.expiresAt && shareLink.expiresAt < new Date()) {
      res.status(410).json({
        success: false,
        message: "This link has expired.",
      });
      return;
    }

    if (
      shareLink.maxDownloads !== null &&
      shareLink.downloadCount >= shareLink.maxDownloads
    ) {
      res.status(410).json({
        success: false,
        message: "Download limit reached.",
      });
      return;
    }

    // Verify associated resource still exists
    let resourceDetails: any = null;
    if (shareLink.resourceType === "file") {
      const file = await File.findOne({ _id: shareLink.resourceId, isDeleted: false });
      if (!file) {
        res.status(404).json({
          success: false,
          message: "File not found or deleted.",
        });
        return;
      }
      resourceDetails = {
        _id: file._id,
        name: file.originalName || file.name,
        size: file.size,
        mimeType: file.mimeType,
      };
    } else {
      const folder = await Folder.findOne({ _id: shareLink.resourceId, isDeleted: false });
      if (!folder) {
        res.status(404).json({
          success: false,
          message: "Folder not found or deleted.",
        });
        return;
      }
      resourceDetails = {
        _id: folder._id,
        name: folder.name,
      };
    }

    res.json({
      success: true,
      data: {
        token: shareLink.token,
        resourceType: shareLink.resourceType,
        resourceId: resourceDetails,
        expiresAt: shareLink.expiresAt,
        maxDownloads: shareLink.maxDownloads,
        downloadCount: shareLink.downloadCount,
        isActive: shareLink.isActive,
        isPasswordProtected: !!shareLink.password,
        createdAt: shareLink.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// List Current User's Share Links
export const getMyShareLinks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const owner = req.user?.userId;
    if (!owner) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const links = await ShareLink.find({ owner }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: links,
    });
  } catch (error) {
    next(error);
  }
};

// Update Share Link Options (Owner only)
export const updateShareLink = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const owner = req.user?.userId;
    const { expiresAt, maxDownloads, password, passwordChanged, isActive } = req.body;

    if (!owner) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const shareLink = await ShareLink.findOne({ _id: id, owner });
    if (!shareLink) {
      res.status(404).json({ success: false, message: "Share link not found" });
      return;
    }

    if (isActive !== undefined) {
      shareLink.isActive = isActive;
    }

    if (expiresAt !== undefined) {
      shareLink.expiresAt = expiresAt ? new Date(expiresAt) : null;
    }

    if (maxDownloads !== undefined) {
      shareLink.maxDownloads = maxDownloads || null;
    }

    if (passwordChanged) {
      if (password && password.trim() !== "") {
        shareLink.password = await bcrypt.hash(password.trim(), 10);
      } else {
        shareLink.password = null;
      }
    }

    await shareLink.save();

    res.json({
      success: true,
      message: "Share link updated successfully",
      data: shareLink,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Share Link (Owner only)
export const deleteShareLink = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const owner = req.user?.userId;
    if (!owner) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const deleted = await ShareLink.findOneAndDelete({
      _id: id,
      owner,
    });

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "Share link not found",
      });
      return;
    }

    // Also clean up download logs
    await DownloadLog.deleteMany({ shareLinkId: id });

    res.json({
      success: true,
      message: "Share link deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get Share Link Statistics (Owner only)
export const getShareLinkStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const owner = req.user?.userId;
    if (!owner) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const shareLink = await ShareLink.findOne({ _id: id, owner });
    if (!shareLink) {
      res.status(404).json({ success: false, message: "Share link not found" });
      return;
    }

    const logs = await DownloadLog.find({ shareLinkId: id }).sort({ downloadedAt: -1 });

    res.json({
      success: true,
      data: {
        totalDownloads: shareLink.downloadCount,
        maxDownloads: shareLink.maxDownloads,
        expiresAt: shareLink.expiresAt,
        isActive: shareLink.isActive,
        createdAt: shareLink.createdAt,
        logs: logs.map(log => ({
          downloadedAt: log.downloadedAt,
          ipAddress: log.ipAddress,
          userAgent: log.userAgent
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Public Download / Stream Endpoint
export const downloadShareFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const shareLink = await ShareLink.findOne({ token });

    if (!shareLink) {
      res.status(404).json({ success: false, message: "Share link not found" });
      return;
    }

    if (!shareLink.isActive) {
      res.status(403).json({ success: false, message: "This link has been disabled." });
      return;
    }

    if (shareLink.expiresAt && shareLink.expiresAt < new Date()) {
      res.status(410).json({ success: false, message: "This link has expired." });
      return;
    }

    if (
      shareLink.maxDownloads !== null &&
      shareLink.downloadCount >= shareLink.maxDownloads
    ) {
      res.status(410).json({ success: false, message: "Download limit reached." });
      return;
    }

    // Verify Password if set
    if (shareLink.password) {
      if (!password) {
        res.status(401).json({ success: false, message: "This file is password protected." });
        return;
      }
      const isMatch = await bcrypt.compare(password.trim(), shareLink.password);
      if (!isMatch) {
        res.status(401).json({ success: false, message: "Invalid password." });
        return;
      }
    }

    // Verify file exists
    if (shareLink.resourceType !== "file") {
      res.status(400).json({ success: false, message: "Only files can be downloaded directly." });
      return;
    }

    const file = await File.findOne({ _id: shareLink.resourceId, isDeleted: false });
    if (!file) {
      res.status(404).json({ success: false, message: "File not found or deleted." });
      return;
    }

    if (!fs.existsSync(file.storagePath)) {
      res.status(404).json({ success: false, message: "Physical file is missing from storage." });
      return;
    }

    // Atomic increment and download limit check
    const updateCond: any = { token, isActive: true };
    if (shareLink.maxDownloads !== null) {
      updateCond.downloadCount = { $lt: shareLink.maxDownloads };
    }

    const updatedLink = await ShareLink.findOneAndUpdate(
      updateCond,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );

    if (!updatedLink) {
      res.status(410).json({ success: false, message: "Download limit reached during download request." });
      return;
    }

    const ipAddress =
      req.ip ||
      (Array.isArray(req.headers["x-forwarded-for"])
        ? req.headers["x-forwarded-for"][0]
        : req.headers["x-forwarded-for"]) ||
      req.socket.remoteAddress ||
      "unknown";


    // Create Download Log
    await DownloadLog.create({
      shareLinkId: shareLink._id,
      ipAddress , 
      userAgent: req.headers["user-agent"] || "unknown",
    });

    // Stream the file
    res.download(file.storagePath, file.originalName, (err) => {
      if (err) {
        if (!res.headersSent) {
          next(err);
        }
      }
    });
  } catch (error) {
    next(error);
  }
};