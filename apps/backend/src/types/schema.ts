import { password } from "bun";
import z from "zod";

export const userSignupSchema = z.object({
    username: z.string().min(3).max(30),
    password : z.string().min(8),
    name : z.string().min(1).max(100),
    photoUrl : z.string().url().optional()
})

export const userSigninSchema = z.object({
    username : z.string().min(3).max(30),
    password : z.string().min(8)
})

export const JoinRoomSchema = z.object({
  joinCode: z.string().length(6),
});

