import express from "express";
import prisma from "@repo/db";
import { authRouter } from "./routes/authRouter";
import { roomRouter } from "./routes/roomRouter";
import { contentRouter } from "./routes/contentRouter";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const allowedOrigin =
  process.env.FRONTEND_URL || "http://localhost:3003";


app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (origin === allowedOrigin) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);


app.use("/api/v1/user", authRouter);
app.use("/api/v1/room", roomRouter);
app.use("/api/v1/content", contentRouter);

app.get("/health", async (_req, res) => {
  try {
    const userCount = await prisma.user.count();
    console.log(`User count: ${userCount}`);
    res.json({ ok: true });
  } catch (err) {
    console.error("Health check failed:", err);
    res.status(500).json({ ok: false });
  }
});


const PORT = process.env.PORT ?? 3001;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
  console.log(`Allowed origin: ${allowedOrigin}`);
});
