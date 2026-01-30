import { z } from "zod";
export const WebSocketMessageSchema = z.object({
  type: z.enum([
    "ping",
    "connect_room",
    "disconnect_room",
    "chat_message",
    "draw",
    "error_message",
  ]),
  roomId: z.string().optional(),
  userId: z.string().optional(),
  content: z.string().optional(),
});