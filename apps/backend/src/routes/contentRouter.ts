import { Router } from "express";
import { fetchAllChatMessages, fetchAllDraws, fetchHomeInfo } from "../controller/contentController";

const router = Router();

router.get("/home",fetchHomeInfo);

router.get("/chat/:roomId",fetchAllChatMessages);

router.get("/draws/:roomId",fetchAllDraws);

export const contentRouter = router;