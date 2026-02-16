
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
        const user = {
            id: newUser.id,
            username: newUser.username,
            name: newUser.name,
            photo: newUser.photo
        };
        const token = jwt.sign(
            user,
            "defaultsecret" 
        );

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,          // REQUIRED in production (HTTPS)
            sameSite: "none",      // REQUIRED if frontend & backend are different domains
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        res.json({
            message: "User Signed Up",
            user,
            token,
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
      
        const userObj = {
            id: user.id,
            username: user.username,
            name: user.name,
            photo: user.photo
        };
        const token = jwt.sign(
            userObj,
            process.env.JWT_SECRET || "kjhytfrde45678iuytrfdcfgy6tr"
        );
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            message: "Login successful",
            user: userObj,
            token
        });
    }catch(err){
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

export async function signoutController(req: Request, res: Response) {
  res.clearCookie("jwt");
  res.json({
    message: "User logged out",
  });
}
export async function infoController(req: Request, res: Response) {
  const userId = req.userId;
  console.log("Fetching info for user ID:", userId);

  try {
    const userFound = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const user = {
      id: userFound?.id,
      username: userFound?.username,
      name: userFound?.name,
    };

    res.status(200).json({
      message: "User info",
      user,
    });
  } catch (e) {
    console.log(e);
    res.status(401).json({
      message: "Error faced while getting user info, try again",
    });
  }
}