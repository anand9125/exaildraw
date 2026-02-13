import express from "express";
import prisma from "@repo/db";
import { authRouter } from "./routes/authRouter";
import { roomRouter } from "./routes/roomRouter";
import { contentRouter } from "./routes/contentRouter";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
  origin:process.env.FRONTEND_URL || "http://localhost:3000",
    credentials:true,
  })
)

app.use("/api/v1/user",authRouter);

app.use("/api/v1/room",roomRouter)

app.use("/api/v1/content",contentRouter)


app.get("/health", async(req, res) => {
    const userCount = await prisma.user.count();
    console.log(`User count: ${userCount}`);
  res.json({ ok: true });
});

const PORT = process.env.PORT ?? 3001;

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
