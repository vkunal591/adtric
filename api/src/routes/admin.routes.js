import express from "express";

import protect from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import upload from "../middleware/upload.middleware.js";
import {
  createNewsEvent,
  deleteNewsEvent,
  getAllEnquiries,
  getAllNewsEvents,
  getDashboardStats,
  updateEnquiryStatus,
  updateNewsEvent
} from "../controllers/admin.controller.js";
import { enquiryStatusSchema } from "../validators/enquiry.validator.js";
import { newsSchema, updateNewsSchema } from "../validators/news.validator.js";

const router = express.Router();

router.use(protect);

router.get("/dashboard", getDashboardStats);
router.get("/enquiries", getAllEnquiries);
router.patch("/enquiries/:id/status", validate(enquiryStatusSchema), updateEnquiryStatus);
router.get("/news", getAllNewsEvents);
router.post("/news", upload.single("image"), validate(newsSchema), createNewsEvent);
router.patch("/news/:id", upload.single("image"), validate(updateNewsSchema), updateNewsEvent);
router.delete("/news/:id", deleteNewsEvent);

export default router;
