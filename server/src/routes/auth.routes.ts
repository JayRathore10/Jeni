import {Router} from "express";
import { test } from "../controllers/auth.controller";

const router = Router();

router.get("/test" , test);

// Have to add there logic here 

router.post("/sign-in");
router.post("/sign-up");
router.get("/logout");


export default router;