import {Router} from "express";

const router = Router();

router.post("/sign-in");
router.post("/sign-up");
router.get("/logout");


export default router;