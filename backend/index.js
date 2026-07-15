import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db/db.js";
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import feedRouter from "./routes/feedRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { createServer } from "node:http";
import { Server } from "socket.io";
import requestRouter from "./routes/requestRoutes.js";
import helperRouter from "./routes/helperRoutes.js";

dotenv.config();

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 5000;

app.use(cookieParser());

app.use(
  cors({
    origin: ["https://problem-solve-app.vercel.app", "http://localhost:3000"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/auth", authRouter);
app.use("/feed", feedRouter);
app.use("/user", userRouter);
app.use("/request", requestRouter);
app.use("/helper", helperRouter);

connectDB();

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

const io = new Server(server, {
  cors: {
    origin: ["https://problem-solve-app.vercel.app", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

const users = {};

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("login-user", (userId) => {
    users[userId] = socket.id;
    console.log("Logged In:", userId);
  });

  socket.on("chat-message", (msg) => {
    const { recevierId } = msg;

    const receiverSocketId = users[recevierId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("chat-message", msg);
    }
  });

  socket.on("disconnect", () => {
    for (const userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        console.log("Disconnected:", userId);
        break;
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
