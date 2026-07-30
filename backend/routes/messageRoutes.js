import express from "express";
import { getMessages } from "../controllers/messageController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:otherUserId", authMiddleware, getMessages);

export default router;