import {Router} from "express";
import { logout, signin, signup } from "../controllers/auth.controller";
import { signinSchema , signupSchema} from "../validators/auth.validator";

import { validate } from "../middleware/validation.middleware";

const router = Router();

router.post("/sign-in"  ,validate(signinSchema) , signin);
router.post("/sign-up"  , validate(signupSchema) , signup);
router.get("/logout" , logout);

export default router;