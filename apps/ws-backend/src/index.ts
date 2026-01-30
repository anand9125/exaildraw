import { WebSocket, WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';

const wss = new WebSocketServer({ port:Number(process.env.WS_PORT) || 8080 });


const userVerification = new Map<
   WebSocket,
   {verified:boolean;userId?:string}
  >();
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
        console.log("Received Message:", recevMessage);
        switch (recevMessage.type) {
            case "ping":
                socket.send(JSON.stringify({ type: "pong" }));
                break;
            default:
                break;
        }
        console.log("Message from user:", userStatus.userId);
    });

    socket.on("close", () => {
        userVerification.delete(socket);
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