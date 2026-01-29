import { Router } from "express";
import { loginHandler, registerHandler } from "../controller/authRouter";
const router = Router();


router.post("/register",registerHandler);


router.post("/login",loginHandler);


export const authRouter = router;