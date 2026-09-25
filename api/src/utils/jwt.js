import jwt from "jsonwebtoken";

export const generateToken = (adminId) => {
  return jwt.sign(
    {
      adminId,
      role: "admin"
    },
    getJwtSecret(),
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    }
  );
};

export const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return process.env.JWT_SECRET;
};
