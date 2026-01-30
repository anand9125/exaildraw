import { WebSocket, WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { WebSocketMessageSchema } from './types';
import prisma from "@repo/db";

const wss = new WebSocketServer({ port:Number(process.env.WS_PORT) || 8080 });

interface WSConnection {
    socket: WebSocket;
    userId: string;
}
const userVerification = new Map<
   WebSocket,
   {verified:boolean;userId?:string}
  >();

const activeRooms = new Map<string,WSConnection[]>();

wss.on("connection", async (socket: WebSocket, req: Request) => {
    console.log("New connection established");
    const searchParams = new URLSearchParams(req.url?.split("?")[1]);
    const token = searchParams.get("token");
    if (!token) {
        socket.close();
        return;
    }
    const userId = verifyToken(token);

    if (!userId) {
        socket.close();
        return;
    }
    userVerification.set(socket, {
        verified: true,
        userId,
    });

    socket.on("message", async (data) => {
        const userStatus = userVerification.get(socket);

        if (!userStatus?.verified) {
           socket.close();
           return;
        }
        console.log("this is data",data)
        const recevMessage = JSON.parse(data.toString());
        const verifiedMessage = WebSocketMessageSchema.safeParse(recevMessage);

        if (!verifiedMessage.success) {
            socket.send(JSON.stringify({
                type: "error_message",
                content: "Invalid message format"
            }));
            return;
        }

        console.log("Received Message:", verifiedMessage.data);
        switch (verifiedMessage.data.type) {
            case "ping":
                socket.send(JSON.stringify({ type: "pong" }));
                break;
            case "connect_room":
                const getRoom = activeRooms.get(verifiedMessage.data.roomId || "");
                if(getRoom){
                    getRoom.push({socket,userId:userStatus.userId!});
                }else{
                    activeRooms.set(verifiedMessage.data.roomId || "",[{socket,userId:userStatus.userId!}])
                }
                socket.send(JSON.stringify({
                    type: "connect_room",
                    content: `Connected to room ${verifiedMessage.data.roomId}`
                }));
                break;
            case "disconnect_room":
                const room = activeRooms.get(verifiedMessage.data.roomId || "");
                if (room) {
                    const filteredRoom = room.filter(conn => conn.socket !== socket);
                    if (filteredRoom.length === 0) {
                        activeRooms.delete(verifiedMessage.data.roomId || "");
                    } else {
                        activeRooms.set(verifiedMessage.data.roomId || "", filteredRoom);
                    }
                }
                socket.send(JSON.stringify({
                    type: "disconnect_room",
                    content: `Disconnected from room ${verifiedMessage.data.roomId}`
                }));
                break;
            case "chat_message":
                const socketList = activeRooms.get(verifiedMessage.data.roomId || "");

                if (!socketList?.some(s => s.socket === socket)) {
                    socket.send(JSON.stringify({
                        type: "error_message",
                        content: "You are not in this room"
                    }));
                    return;
                }
                try{
                    const addChatMessage = await prisma.chat.create({
                        data:{
                            userId:verifiedMessage.data.userId!,
                            roomId:verifiedMessage.data.roomId!,
                            content:verifiedMessage.data.content || ""
                        },
                        select:{
                            id:true,
                            content:true,
                            serialNumber:true,
                            createdAt:true,
                            userId:true,
                            user:{
                                select:{
                                    username:true
                                }
                            },
                            roomId:true
                        }
                    });
                    // Broadcast to all in room
                    socketList.forEach(({socket:clientSocket})=>{
                        clientSocket.send(JSON.stringify({
                            type: "chat_message",
                            roomId: verifiedMessage.data.roomId,
                            content: JSON.stringify(addChatMessage)
                        }));
                    });
                }catch(e){
                    console.log("Error adding chat message:",e);
                    socket.send(JSON.stringify({
                        type: "error_message",
                        content: "Failed to add chat message"
                    }));
                }
                break;
            case "draw":
                // Handle draw logic
                const drawSocketList = activeRooms.get(verifiedMessage.data.roomId || "");

                if (!drawSocketList?.some(s => s.socket === socket)) {
                    socket.send(JSON.stringify({
                        type: "error_message",
                        content: "You are not in this room"
                    }));
                    return;
                }
                const drawData = JSON.parse(verifiedMessage.data.content || "{}");
                try{
                    let draw;
                    let addedDraw;
                    switch (drawData.type) {
                        case "create":
                            draw = drawData.modifiedDraw;
                                addedDraw = await prisma.draw.create({
                                    data: {
                                        id: draw.id,
                                        shape: draw.shape,
                                        strokeStyle: draw.strokeStyle,
                                        fillStyle: draw.fillStyle,
                                        lineWidth: draw.lineWidth,
                                        font: draw.font,
                                        fontSize: draw.fontSize,
                                        startX: draw.startX,
                                        startY: draw.startY,
                                        endX: draw.endX,
                                        endY: draw.endY,
                                        text: draw.text,
                                        points: draw.points,
                                        roomId: verifiedMessage.data.roomId!,
                                    },
                                });
                            break;
                        case "move":
                        case "edit":
                        case "resize":
                            draw = drawData.modifiedDraw;
                                addedDraw = await prisma.draw.update({
                                    where: { id: draw.id },
                                    data: {
                                        startX: draw.startX,
                                        startY: draw.startY,
                                        endX: draw.endX,
                                        endY: draw.endY,
                                        text: draw.text,
                                        points: draw.points,
                                        shape: draw.shape,
                                        strokeStyle: draw.strokeStyle,
                                        fillStyle: draw.fillStyle,
                                        lineWidth: draw.lineWidth,
                                        font: draw.font,
                                        fontSize: draw.fontSize,
                                    },
                                });
                            break;
                        case "erase":
                            draw = drawData.originalDraw;
                                addedDraw = await prisma.draw.delete({
                                    where: { 
                                        id: draw.id 
                                    },
                                });
                            break;
                        default:
                    }
                    drawSocketList.forEach(({socket:clientSocket})=>{
                        clientSocket.send(JSON.stringify({
                            type: "draw",
                            roomId: verifiedMessage.data.roomId,
                            userId:verifiedMessage.data.roomId,
                            content:verifiedMessage.data.content
                        }));
                    });
                }catch(e){
                    console.log("Error handling draw action:",e);
                    socket.send(JSON.stringify({
                        type: "error_message",
                        content: "Failed to process draw action"
                    }));
                }
                break;
            default:
                break;
        }
        console.log("Message from user:", userStatus.userId);
    });
    socket.on("close", () => {
        userVerification.delete(socket);
        activeRooms.forEach((connections, roomId) => {
            const filteredConnections = connections.filter(conn => conn.socket !== socket);
            if (filteredConnections.length === 0) {
                activeRooms.delete(roomId);
            } else {
                activeRooms.set(roomId, filteredConnections);
            }
        });
        console.log("Connection closed");
    });
});



function verifyToken(token: string): string | null {
    try {
        const userId = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret') as { userId: string };
        return userId.userId;
    } catch (err) {
        return null;
    }
}