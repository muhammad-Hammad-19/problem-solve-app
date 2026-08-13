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
import messageRouter from "./routes/messageRoutes.js";
import Message from "./models/message.model.js";
import notificationRouter from "./routes/notificationRoutes.js";

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

app.use("/notifications", notificationRouter);
app.use("/auth", authRouter);
app.use("/feed", feedRouter);
app.use("/user", userRouter);
app.use("/request", requestRouter);
app.use("/helper", helperRouter);
app.use("/message", messageRouter);

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

  socket.on("chat-message", async (msg) => {
    const { senderId, receiverId, content } = msg;

    // 1. Pehle validate karo
    if (!senderId || !receiverId || !content) {
      socket.emit("chat-message-error", { error: "Missing fields" });
      return;
    }
    // 2. DB mein save karo
    const savedMessage = await Message.create({
      senderId,
      receiverId,
      content,
    });

    // 3. Receiver online hai to usay bhejo
    const receiverSocketId = users[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("chat-message", savedMessage);
    }

    // 4. Sender ko confirmation bhejo (saved message with _id, createdAt waghera)
    socket.emit("chat-message-sent", savedMessage);
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
