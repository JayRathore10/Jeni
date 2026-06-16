import { Router } from "express";
import { changePassword, getProfile, updateProfile } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router =  Router();

router.get("/me", authMiddleware, getProfile);

router.patch("/me", authMiddleware, updateProfile);

router.patch("/change-password", authMiddleware, changePassword);;

export default router;
