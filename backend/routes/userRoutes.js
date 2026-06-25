import express from "express";

import { getAllUsers, getUser } from "../controllers/userControllers.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/", authMiddleware, getAllUsers);

userRouter.get("/getUser", authMiddleware, getUser);

export default userRouter;
