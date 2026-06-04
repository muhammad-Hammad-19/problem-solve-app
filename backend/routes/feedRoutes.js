import express from "express";
import {
  feedCreate,
  feedFetch,
  suggAI,
} from "../controllers/feedControllers.js";

const feedRouter = express.Router();

feedRouter.post("/create", feedCreate);

feedRouter.post("/ai", suggAI);

feedRouter.get("/fetch", feedFetch);

export default feedRouter;
