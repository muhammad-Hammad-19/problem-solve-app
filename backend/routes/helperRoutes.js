import express from "express";
import { getHelper } from "../controllers/helperCotrollers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const helperRouter = express.Router();

helperRouter.get("/allHelperFetch", authMiddleware, getHelper);

export default helperRouter;
