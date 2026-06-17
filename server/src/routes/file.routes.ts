import {Router}  from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createFile, getFileById, getFiles } from "../controllers/file.controller";
import { upload } from "../middleware/multer.middleware";

const router = Router();

router.get("/"  , authMiddleware , getFiles);
router.get("/:fileId" , authMiddleware , getFileById);
router.post("/" , authMiddleware , upload.single("file") , createFile);

export default router;