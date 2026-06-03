import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db/db.js";
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import feedRouter from "./routes/feedRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cookieParser());


app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),

);

app.use(express.json());

app.use("/auth", authRouter);

app.use("/feed", feedRouter);
connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
