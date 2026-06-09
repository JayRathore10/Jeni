import {Router} from "express";
import { test } from "../controllers/auth.controller";

const router = Router();

router.get("/test" , test);

router.post("/sign-in");
router.post("/sign-up");
router.get("/logout");


export default router;