export interface Draw {
  id: string;
  shape:
    | "rectangle"
    | "diamond"
    | "circle"
    | "line"
    | "arrow"
    | "text"
    | "freeHand";
  strokeStyle: string;
  fillStyle: string;
  lineWidth: number;
  font: string;
  fontSize: string;
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  text: string;
  points: { x: number; y: number }[];
}

export interface Message {
  id: string;
  content: string;
  serialNumber: number;
  userId: string;
  roomId: string;
  createdAt: Date;
  user: { username: string };
}

export interface Action {
  type: "create" | "move" | "resize" | "erase" | "edit";
  originalDraw: Draw | null;
  modifiedDraw: Draw | null;
}

export interface User {
  id: string;
  name: string;
  username: string;
}

export interface Room {
  id: string;
  title: string;
  joinCode: string;
  adminId: string;
  Chat: {
    user: {
      username: string;
    };
    content: string;
  }[];
  Draw: Draw[];
  admin: {
    username: string;
  };
  createdAt: string;
}



import { z } from "zod";

export const UserSignupSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
  name: z.string(),
});

export const UserSigninSchema = z.object({
  // (for http - server)
  username: z.string(),
  password: z.string().min(8),
});

export const CreateRoomSchema = z.object({
  title: z.string(),
});

export const JoinRoomSchema = z.object({
  // (for http - server)
  joinCode: z.string().length(6),
});

export const WebSocketMessageSchema = z.object({
  // Messages shared via WebSocket (for frontend and ws - server)
  type: z.enum([
    "ping",
    "connect_room",
    "disconnect_room",
    "chat_message",
    "draw",
    "error_message",
  ]),
  roomId: z.string(),
  userId: z.string(),
  content: z.string().optional(),
});

export type WebSocketMessage = z.infer<typeof WebSocketMessageSchema>;
