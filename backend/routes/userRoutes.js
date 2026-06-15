import express from "express";

import { getAllUsers } from "../controllers/userControllers.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/", authMiddleware, getAllUsers);

export default userRouter;
