import {Router} from "express";
import { logout, signin, signup } from "../controllers/auth.controller";
const router = Router();

router.post("/sign-in" , signin);
router.post("/sign-up" , signup);
router.get("/logout" , logout);


export default router;