import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let token = req.cookies["jwt"];
  console.log("Authenticating with token from cookie:", token);

  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    res.status(401).json({
      message: "The user is not logged in",
    });
    return;
  }
  console.log("Verifying token:", token);

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || "kjhytfrde45678iuytrfdcfgy6tr"
    ) as { id: string };

    if (!verified?.id) {
      res.status(401).json({
        message: "User not registered, Invalid token",
      });
      return;
    }
    console.log("Token verified for user ID:", verified.id);

    req.userId = verified.id;
    console.log("User ID set in request:", req.userId);
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
}
