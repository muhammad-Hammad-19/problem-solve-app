import express from "express";
import { requestSend, requestFetch } from "../controllers/requestControlers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const requestRouter = express.Router();

requestRouter.post("/send/:postId", authMiddleware, requestSend);
requestRouter.get("/fetch", authMiddleware, requestFetch);

export default requestRouter;
