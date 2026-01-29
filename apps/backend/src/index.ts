import express from "express";
import prisma from "@repo/db";
import { authRouter } from "./routes/authRouter";
const app = express();

app.use(express.json());


app.use("api/v1/user",authRouter);
app.use("/api/v1/room",roomRouter)


app.get("/health", async(req, res) => {
    const userCount = await prisma.user.count();
    console.log(`User count: ${userCount}`);
  res.json({ ok: true });
});

const PORT = process.env.PORT ?? 3001;

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
