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

dotenv.config();

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

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

app.use("/user", userRouter);

app.use("/request", requestRouter);

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const users = {};

io.on("connection", (socket) => {
  socket.on("login-user", (userId) => {
    users[userId] = socket.id;
  });

  socket.on("chat-message", (msg) => {
    const { recevierId } = msg;

    let receiverSocketId = users[recevierId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("chat-message", msg);
    }
  });

  socket.on("disconnect", () => {
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        console.log("User disconnected:", userId);
        break;
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.listen(8000, () => {
  console.log(`Socket Server running on port ${PORT}`);
});
