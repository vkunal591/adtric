import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/User.js";
import NewsEvent from "../src/models/NewsEvent.js";
import Enquiry from "../src/models/Enquiry.js";

dotenv.config();

const seed = async () => {
  try {
    if (!process.env.MONGODB_URI || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error("MONGODB_URI, ADMIN_EMAIL, and ADMIN_PASSWORD are required.");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await User.findOneAndUpdate(
      { email: process.env.ADMIN_EMAIL.toLowerCase() },
      {
        email: process.env.ADMIN_EMAIL.toLowerCase(),
        password,
        role: "admin"
      },
      { upsert: true, returnDocument: "after", runValidators: true }
    );

    const newsEvents = [
      {
        title: "Admissions Open 2026-27",
        slug: "admissions-open-2026-27",
        category: "News",
        date: new Date("2026-08-15"),
        image: "/uploads/whatsapp-image-2026-09-24-at-3-54-13-pm-1790334422599.jpeg",
        shortDescription: "Applications are now open for the 2026-27 academic year.",
        content: "Our admissions team is ready to welcome new families and help them discover the Manthan learning experience.",
        published: true
      },
      {
        title: "Science Expo and Innovation Week",
        slug: "science-expo-and-innovation-week",
        category: "Event",
        date: new Date("2026-09-02"),
        image: "/uploads/whatsapp-image-2026-09-24-at-3-54-14-pm-1-1790326356256.jpeg",
        shortDescription: "Students share experiments, inventions, and ideas with the school community.",
        content: "From working models to thoughtful investigations, Innovation Week celebrates the questions and discoveries that drive learning.",
        published: true
      },
      {
        title: "Young Achievers Celebration",
        slug: "young-achievers-celebration",
        category: "Achievement",
        date: new Date("2026-09-18"),
        image: "/uploads/whatsapp-image-2026-09-24-at-3-54-14-pm-1790334435755.jpeg",
        shortDescription: "A celebration of student effort, creativity, and community spirit.",
        content: "We celebrate the persistence and imagination our students bring to every project, performance, competition, and classroom challenge.",
        published: true
      }
    ];

    await NewsEvent.bulkWrite(
      newsEvents.map((item) => ({
        updateOne: {
          filter: { slug: item.slug },
          update: { $set: item },
          upsert: true
        }
      }))
    );

    const enquiries = [
      {
        parentName: "Aarav Sharma",
        studentName: "Anaya Sharma",
        classApplyingFor: "Grade 1",
        mobile: "9876543210",
        email: "aarav.sharma@example.com",
        message: "We would like to schedule a campus visit.",
        status: "New",
        crmStatus: "Sent",
        crmResponse: "CRM returned HTTP 200",
        crmSentAt: new Date()
      },
      {
        parentName: "Meera Iyer",
        studentName: "Rohan Iyer",
        classApplyingFor: "LKG",
        mobile: "8765432109",
        email: "meera.iyer@example.com",
        message: "Please share the admissions process and fee details.",
        status: "Contacted",
        crmStatus: "Sent",
        crmResponse: "CRM returned HTTP 200",
        crmSentAt: new Date()
      },
      {
        parentName: "Kabir Verma",
        studentName: "Ishaan Verma",
        classApplyingFor: "Grade 2",
        mobile: "7654321098",
        email: "kabir.verma@example.com",
        message: "We are interested in the upcoming academic year.",
        status: "Closed",
        crmStatus: "Failed",
        crmResponse: "CRM request timed out.",
        crmSentAt: null
      }
    ];

    await Enquiry.bulkWrite(
      enquiries.map((item) => ({
        updateOne: {
          filter: { mobile: item.mobile, classApplyingFor: item.classApplyingFor },
          update: { $set: item },
          upsert: true
        }
      }))
    );

    console.log("Seed complete: 1 admin, 3 news/events, and 3 enquiries.");
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seed();
