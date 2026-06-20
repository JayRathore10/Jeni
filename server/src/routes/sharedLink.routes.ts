import { Router } from "express";
import {
  createShareLink,
  getShareLink,
  getMyShareLinks,
  deleteShareLink,
  incrementDownloadCount,
} from "../controllers/shareLink.controller";

const router = Router();

// Protected routes (attach your auth middleware if needed)
router.post("/", createShareLink);
router.get("/my", getMyShareLinks);
router.delete("/:id", deleteShareLink);

// Public routes
router.get("/:token", getShareLink);
router.patch("/:token/download", incrementDownloadCount);

export default router;