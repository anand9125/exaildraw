import prisma from "@repo/db";
import type { Request, Response } from "express";


export async function fetchHomeInfo(req: Request, res: Response) {
    const {title} = req.query;
    const userId = req.userId;
    
    if (!userId) {
        res.status(401).json({
            message: "User Id not found",
        });
        return;
    }
    if(title){
        try {
        const rooms = await prisma.room.findMany({
            where: {
                title: {
                    contains: title as string,
                },
                participants: {
                    some: { id: userId },
                },
            },
            select: {
                id: true,
                title: true,
                joinCode: true,
                Chat: {
                    take: 1,
                    orderBy: {
                    serialNumber: "desc",
                    },
                    select: {
                    user: {
                        select: {
                        name: true,
                        },
                    },
                    content: true,
                    },
                },
            },
        });

        res.json({
            rooms,
        });
        }
        catch(err:any){
            console.log(err);
            res.status(401).json({
                message: "Could not fetch rooms",
            });
        }
    }
    try {
    const rooms = await prisma.room.findMany({
        where: {
            participants: {
              some:{ id: userId },
            },
        },
        select: {
            id: true,
            title: true,
            joinCode: true,
            Chat: {
            take: 1,
            orderBy: {
                serialNumber: "desc",
            },
            select: {
                user: {
                select: {
                    name: true,
                },
                },
                content: true,
            },
            },
        },
    });
    res.json({
      rooms,
    });
  } catch (e) {
    console.log(e);
    res.status(401).json({
      message: "Could not fetch rooms",
    });
  }
}

export async function fetchAllChatMessages(req: Request, res: Response) {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({
      message: "User Id not found",
    });
    return;
  }

  const { roomId } = req.params as any;
  const { lastSrNo } = req.query;

  try {
    const userExists = await prisma.room.findFirst({
      where: {
        id: roomId,
        participants: {
          some: { id: userId },
        },
      },
      select: {
        id: true,
        title: true,
        joinCode: true,
      },
    });

    if (!userExists?.id) {
      res.status(401).json({
        message: "User not part of the room",
      });
      return;
    }

    let messages;

    if (lastSrNo !== undefined) {
      messages = await prisma.chat.findMany({
        where: {
          roomId: roomId,
          serialNumber: {
            lt: parseInt(lastSrNo as string),
          },
        },
        select: {
          id: true,
          content: true,
          serialNumber: true,
          createdAt: true,
          userId: true,
          user: {
            select: {
              username: true,
            },
          },
          roomId: true,
        },
        take: 25,
        orderBy: {
          serialNumber: "desc",
        },
      });
    } else {
      messages = await prisma.chat.findMany({
        where: {
          roomId: roomId,
        },
        select: {
          id: true,
          content: true,
          serialNumber: true,
          createdAt: true,
          userId: true,
          user: {
            select: {
              username: true,
            },
          },
          roomId: true,
        },
        take: 25,
        orderBy: {
          serialNumber: "desc",
        },
      });
    }

    res.json({
      messages: messages.reverse(),
    });
  } catch (e) {
    console.log(e);
    res.status(401).json({
      message: "Could not fetch messages",
    });
  }
}

export async function fetchAllDraws(req: Request, res: Response) {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({
      message: "User Id not found",
    });
    return;
  }

  const { roomId } = req.params as any;

  try {
    const draws = await prisma.draw.findMany({
      where: {
        roomId: roomId,
      },
    });

    res.json({
      draws,
    });
  } catch (e) {
    console.log(e);
    res.status(401).json({
      message: "Could not fetch draws",
    });
  }
}