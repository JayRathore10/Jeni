import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";

import {
  createFolder,
  getFolders,
  getFolderById,
  updateFolder,
  deleteFolder,
  getFolderContents,
} from "../controllers/folder.controller";

const router = Router();

/**
 * CREATE FOLDER
 */
router.post("/", authMiddleware, createFolder);

/**
 * GET ALL USER FOLDERS
 */
router.get("/", authMiddleware, getFolders);

/**
 * GET SINGLE FOLDER
 */
router.get("/:folderId", authMiddleware, getFolderById);

/**
 * GET FOLDER CONTENTS (FILES + SUBFOLDERS)
 */
router.get("/:folderId/contents", authMiddleware, getFolderContents);

/**
 * UPDATE FOLDER (rename / move)
 */
router.patch("/:folderId", authMiddleware, updateFolder);

/**
 * DELETE FOLDER
 */
router.delete("/:folderId", authMiddleware, deleteFolder);

export default router;