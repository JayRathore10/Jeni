import { Request, Response } from "express";
import { DownloadLog } from "../models/downloadLog.model";

// Create a new download log
export const createDownloadLog = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { shareLinkId, ipAddress, userAgent } = req.body;

    const log = await DownloadLog.create({
      shareLinkId,
      ipAddress,
      userAgent,
    });

    res.status(201).json({
      success: true,
      message: "Download log created successfully.",
      data: log,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create download log.",
      error,
    });
  }
};

// Get all download logs
export const getAllDownloadLogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const logs = await DownloadLog.find()
      .populate("shareLinkId")
      .sort({ downloadedAt: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch download logs.",
      error,
    });
  }
};

// Get logs by ShareLink ID
export const getDownloadLogsByShareLink = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { shareLinkId } = req.params;

    const logs = await DownloadLog.find({ shareLinkId }).sort({
      downloadedAt: -1,
    });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch download logs.",
      error,
    });
  }
};

// Delete a download log
export const deleteDownloadLog = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const log = await DownloadLog.findByIdAndDelete(id);

    if (!log) {
      res.status(404).json({
        success: false,
        message: "Download log not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Download log deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete download log.",
      error,
    });
  }
};