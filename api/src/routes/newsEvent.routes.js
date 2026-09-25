import express from "express";

import {
  getPublishedNewsEvents,
  getPublishedNewsEventBySlug
} from "../controllers/newsEvent.controller.js";

const router = express.Router();

router.get("/", getPublishedNewsEvents);

router.get("/:slug", getPublishedNewsEventBySlug);

export default router;
