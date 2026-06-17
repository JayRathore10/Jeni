import {Router}  from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getFiles } from "../controllers/file.controller";

const router = Router();

router.get("/"  , authMiddleware , getFiles);


export default router;