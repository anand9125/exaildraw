import { Router } from "express";

const router = Router();

router.get("/home",fetchHomeInfo);

router.get("/chat/:roomId",fetchChatMessages);

router.get("/draws/:roomId",fetchDraws);

export const contentRouter = router;