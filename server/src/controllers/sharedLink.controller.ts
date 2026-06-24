import { Request, Response } from "express";
import crypto from "crypto";
import { ShareLink } from "../models/shareLink.model";
// Create Share Link
export const createShareLink = async (req: Request, res: Response) => {
  try {
    const {
      resourceType,
      resourceId,
      expiresAt,
      password,
      maxDownloads,
    } = req.body;

    const owner = (req as any).user.id;

    const token = crypto.randomBytes(32).toString("hex");

    const shareLink = await ShareLink.create({
      token,
      owner,
      resourceType,
      resourceId,
      expiresAt,
      password: password || null,
      maxDownloads: maxDownloads || null,
    });

    res.status(201).json({
      success: true,
      data: shareLink,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create share link",
      error,
    });
  }
};

// Get Share Link by Token
export const getShareLink = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const shareLink = await ShareLink.findOne({ token });

    if (!shareLink) {
      return res.status(404).json({
        success: false,
        message: "Share link not found",
      });
    }

    if (shareLink.expiresAt < new Date()) {
      return res.status(410).json({
        success: false,
        message: "Share link has expired",
      });
    }

    if (
      shareLink.maxDownloads !== null &&
      shareLink.downloadCount >= shareLink.maxDownloads
    ) {
      return res.status(410).json({
        success: false,
        message: "Maximum downloads reached",
      });
    }

    res.json({
      success: true,
      data: shareLink,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching share link",
      error,
    });
  }
};

// List Current User's Share Links
export const getMyShareLinks = async (req: Request, res: Response) => {
  try {
    const owner = (req as any).user.id;

    const links = await ShareLink.find({ owner }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: links,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching share links",
      error,
    });
  }
};

// Delete Share Link
export const deleteShareLink = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const owner = (req as any).user.id;

    const deleted = await ShareLink.findOneAndDelete({
      _id: id,
      owner,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Share link not found",
      });
    }

    res.json({
      success: true,
      message: "Share link deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting share link",
      error,
    });
  }
};

// Increment Download Count
export const incrementDownloadCount = async (
  req: Request,
  res: Response
) => {
  try {
    const { token } = req.params;

    const shareLink = await ShareLink.findOne({ token });

    if (!shareLink) {
      return res.status(404).json({
        success: false,
        message: "Share link not found",
      });
    }

    if (
      shareLink.maxDownloads !== null &&
      shareLink.downloadCount >= shareLink.maxDownloads
    ) {
      return res.status(400).json({
        success: false,
        message: "Download limit reached",
      });
    }

    shareLink.downloadCount += 1;
    await shareLink.save();

    res.json({
      success: true,
      downloadCount: shareLink.downloadCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating download count",
      error,
    });
  }
};