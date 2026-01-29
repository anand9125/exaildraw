import Router from "express";
import { createRoomController, featchAllRoomsController, joinRoomController } from "../controller/roomRouter";
import { authenticateUser } from "../middleware/userMiddleware";

const router =  Router();

router.post("/create",authenticateUser,createRoomController);

router.post("/join",authenticateUser,joinRoomController)

router.get("/all", authenticateUser, featchAllRoomsController);

export const roomRouter = router;
