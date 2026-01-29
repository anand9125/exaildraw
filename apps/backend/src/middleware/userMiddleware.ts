import type { NextFunction ,Request,Response} from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export async function authenticateUser(
    req:Request,
    res:Response,
    next:NextFunction
){
    let token = req.headers["authorization"];
    if(!token){
        res.status(401).json({
            error: "No token provided"
        });
        return;
    }
    if(token.startsWith("Bearer ")){
        token = token.slice(7, token.length);
    }
    const verifed = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret") as { userId: string } | null;
    if(!verifed){
        res.status(401).json({
            error: "Invalid token"
        });
        return;
    }
    req.userId = verifed.userId;
    next();

}