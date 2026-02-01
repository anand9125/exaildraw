import { Router } from "express";
import { infoController, loginHandler, registerHandler, signoutController } from "../controller/authRouter";
import { authenticateUser } from "../middleware/userMiddleware";
const router = Router();


router.post("/register",registerHandler);

router.post("/login",loginHandler);

router.post("/logout",signoutController)

router.get("/info",authenticateUser,infoController)

export const authRouter = router;