import express from "express";
import {
  feedCreate,
  feedFetch,
  suggAI,
} from "../controllers/feedControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const feedRouter = express.Router();

feedRouter.post("/create", authMiddleware, feedCreate);

feedRouter.post("/ai", authMiddleware, suggAI);

feedRouter.get("/fetch", authMiddleware, feedFetch);

export default feedRouter;
