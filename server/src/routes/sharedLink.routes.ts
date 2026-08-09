import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createShareLink,
  getShareLink,
  getMyShareLinks,
  updateShareLink,
  deleteShareLink,
  getShareLinkStats,
  downloadShareFile,
} from "../controllers/sharedLink.controller";

const router = Router();

// Protected routes
router.post("/", authMiddleware, createShareLink);
router.get("/my", authMiddleware, getMyShareLinks);
router.patch("/:id", authMiddleware, updateShareLink);
router.delete("/:id", authMiddleware, deleteShareLink);
router.get("/:id/stats", authMiddleware, getShareLinkStats);

// Public routes
router.get("/:token", getShareLink);
router.post("/download/:token", downloadShareFile);

export default router;