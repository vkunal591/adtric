import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    if (!process.env.MONGODB_URI || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error("MONGODB_URI, ADMIN_EMAIL, and ADMIN_PASSWORD are required.");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const existingAdmin = await User.findOne({
      email: process.env.ADMIN_EMAIL
    });

    const passwordMatches = existingAdmin
      ? await bcrypt.compare(process.env.ADMIN_PASSWORD, existingAdmin.password)
      : false;

    const update = {
      email: process.env.ADMIN_EMAIL.toLowerCase(),
      role: "admin"
    };

    if (!passwordMatches) {
      update.password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    }

    if (existingAdmin) {
      await User.findByIdAndUpdate(existingAdmin._id, update, { runValidators: true });
      console.log("Admin account updated successfully.");
    } else {
      await User.create({
        ...update,
        password: update.password
      });
      console.log("Admin account created successfully.");
    }
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();
