import express from "express";
import { feedCreate, feedFetch } from "../controllers/feedControllers.js";

const feedRouter = express.Router();

feedRouter.post("/create", feedCreate);

feedRouter.get("/fetch", feedFetch);

export default feedRouter;
