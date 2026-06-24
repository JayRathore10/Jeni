import { Router } from "express";
import {
  createDownloadLog,
  getAllDownloadLogs,
  getDownloadLogsByShareLink,
  deleteDownloadLog,
} from "../controllers/downloadLog.controller";

const router = Router();

router.post("/", createDownloadLog);
router.get("/", getAllDownloadLogs);
router.get("/share/:shareLinkId", getDownloadLogsByShareLink);
router.delete("/:id", deleteDownloadLog);

export default router;