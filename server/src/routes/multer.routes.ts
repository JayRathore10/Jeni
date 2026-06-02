import { Router } from "express";
import multer from "multer";
import { upload } from "../controllers/multer.controller";

export const multerRouter = Router();

const uploadDes = multer({
  dest : "/upload"
});

multerRouter.post("/upload"  , uploadDes.array("files") , upload);