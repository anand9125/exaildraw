import  prisma from "@repo/db";
import type { Request, Response } from "express";
import { JoinRoomSchema } from "../types/schema";

export const createRoomController = async (req: Request, res: Response) => {
    try{
        const userId = req.body.userId;
        const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        if (!userId){
            res.status(400).json({
                error: "User ID is required"
            });
            return;
        }

        const newRoom = await prisma.room.create({
            data : {
                title: req.body.title,
                joinCode,
                adminId: userId,
                participants: {
                    connect: { id: userId }
                }
            }
        })
        res.status(201).json({  
            message: "Room created successfully",
            roomId: newRoom.id,
            joinCode: newRoom.joinCode
        });
        
    }catch(err){
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

export async function joinRoomController(req: Request, res: Response) {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({
      message: "User Id not found",
    });
    return;
  }

  const validInputs = JoinRoomSchema.safeParse(req.body);
  if (!validInputs.success) {
    res.status(411).json({
      message: "Invalid Input",
    });
    return;
  }

  try {
    const joinCode = validInputs.data.joinCode;
    const room = await prisma.room.update({
      where: {
        joinCode: joinCode,
      },
      data: {
        participants: {
          connect: {
            id: userId,
          },
        },
      },
    });
    res.json({
      message: "Room Joined Successfully",
      room,
    });
    return;
  } catch (e) {
    console.log(e);
    res.status(400).json({
      message: "Faced error joining room, please try again",
    });
    return;
  }
}

export async function featchAllRoomsController(req: Request, res: Response) {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({
      message: "User Id not found",
    });
    return;
  }
  try {
    const rooms = await prisma.room.findMany({
      where: {
        participants: {
          some: { id: userId },
        },
      },
      select: {
        id: true,
        title: true,
        joinCode: true,
        createdAt: true,
        admin: {
          select: {
            username: true,
          },
        },
        adminId: true,
        Chat: {
          take: 1,
          orderBy: {
            serialNumber: "desc",
          },
          select: {
            user: {
              select: {
                username: true,
              },
            },
            content: true,
            createdAt: true,
          },
        },
        Draw: {
          take: 10,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
     const sortedRooms = rooms.sort((a: any, b: any) => {
      const aLatestChat = a.Chat[0]?.createdAt || a.createdAt;
      const bLatestChat = b.Chat[0]?.createdAt || b.createdAt;
      return new Date(bLatestChat).getTime() - new Date(aLatestChat).getTime();
    });
      res.json({
      message: "Rooms fetched successfully",
      rooms: sortedRooms,
    });
  } catch (e) { 
    console.log(e);
    res.status(500).json({
      message: "Error fetching rooms, please try again",
    });
  }

}