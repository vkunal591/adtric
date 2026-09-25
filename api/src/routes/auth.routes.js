import express from "express";
import { login, logout } from "../controllers/auth.controller.js";
import validate from "../middleware/validate.middleware.js";
import { loginSchema } from "../validators/auth.validator.js";

const router = express.Router();

router.post(
  "/login",
  validate(loginSchema),
  login
);

router.post("/logout", logout);

export default router;
