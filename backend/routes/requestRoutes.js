import express from "express";
import { requestSend } from "../controllers/requestControlers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const requestRouter = express.Router();

requestRouter.post("/send/:postId", authMiddleware, requestSend);

export default requestRouter;
