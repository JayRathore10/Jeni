import { Router } from "express";
import { changePassword, getProfile, updateProfile } from "../controllers/user.controller";

const router =  Router();

// protected routes

router.get("/profile/:userId" , getProfile );

router.patch("/me" , updateProfile );

router.patch("/change-password"  , changePassword);

export default router;
