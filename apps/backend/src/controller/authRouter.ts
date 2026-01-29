
import type { Request,Response } from "express";
import { userSigninSchema, userSignupSchema } from "../types/schema";
import prisma from "@repo/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerHandler = async (req: Request, res: Response) => {
    const parseData = userSignupSchema.safeParse(req.body);
    if(parseData.error){
        res.status(400).json({ 
            error: parseData.error
        });
        return;
    }
    try{
        const { username, password, name,  } = parseData.data;
        const userExist = await prisma.user.findUnique({
            where:{
                username
            }
        })
        if(userExist){
            res.status(400).json({
                error: "Username already taken"
            });
            return;
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data:{
                username,
                password:hashPassword,
                name,
                photo:parseData.data?.photoUrl
            }
        });
        res.status(201).json({
            message: "User registered successfully",
            userId: newUser.id
        });
    }catch(err){
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

export const loginHandler = async (req: Request, res: Response) => {
    const parseData = userSigninSchema.safeParse(req.body);
    if(parseData.error){
        res.status(400).json({ 
            error: parseData.error
        });
        return;
    }
    try{
        const { username, password } = parseData.data;
        const user = await prisma.user.findUnique({
            where:{
                username
            }
        });

        if(!user || !await bcrypt.compare(password, user.password)){
            res.status(401).json({
                error: "Invalid username or password"
            });
            return;
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "defaultsecret", {
            expiresIn: "1h"
        });
        res.status(200).json({
            message: "Login successful",
            userId: user.id,
            token
        });
    }catch(err){
        res.status(500).json({
            error: "Internal server error"
        });
    }
}