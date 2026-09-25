import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { getJwtSecret } from "../utils/jwt.js";

const getCookieToken = (cookieHeader) => {
  const token = cookieHeader
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("admin_token="))
    ?.split("=")[1];

  return token ? decodeURIComponent(token) : null;
};

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : getCookieToken(req.headers.cookie);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required."
      });
    }

    const decoded = jwt.verify(token, getJwtSecret());

    if (decoded.role !== "admin" || !decoded.adminId) {
      return res.status(403).json({
        success: false,
        message: "Admin access required."
      });
    }

    const admin = await User.findOne({
      _id: decoded.adminId,
      role: "admin"
    }).select("_id email role").lean();

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin account is no longer active."
      });
    }

    req.adminId = decoded.adminId;
    req.admin = admin;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token."
    });
  }
};

export default protect;
