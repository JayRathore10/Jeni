import {Router}  from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createFile, deleteFile, getFileById, getFiles, updateFile } from "../controllers/file.controller";
import { upload } from "../middleware/multer.middleware";

const router = Router();

router.get("/"  , authMiddleware , getFiles);
router.get("/:fileId" , authMiddleware , getFileById);
router.post("/" , authMiddleware , upload.single("file") , createFile);
router.patch("/:fileId", authMiddleware, updateFile);
router.delete("/:fileId", authMiddleware, deleteFile);

// have to check all the controller 


export default router;  