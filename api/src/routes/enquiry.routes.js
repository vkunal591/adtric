import express from "express";
import rateLimit from "express-rate-limit";

import { createEnquiry } from "../controllers/enquiry.controller.js";
import validate from "../middleware/validate.middleware.js";
import { enquirySchema } from "../validators/enquiry.validator.js";

const router = express.Router();

const enquiryRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,

  message: {
    success: false,
    message: "Too many requests. Please try again later."
  },

  standardHeaders: true,
  legacyHeaders: false
});

router.post(
  "/",
  enquiryRateLimiter,
  validate(enquirySchema),
  createEnquiry
);

export default router;
