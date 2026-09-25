import Enquiry from "../models/Enquiry.js";
import NewsEvent from "../models/NewsEvent.js";
import { createSlug } from "../utils/slug.js";
import fs from "node:fs/promises";
import path from "node:path";
import { uploadDirectory } from "../middleware/upload.middleware.js";

const getUploadedImagePath = (file) => (file ? `/uploads/${file.filename}` : undefined);

const removeLocalImage = async (image) => {
  if (!image || !image.startsWith("/uploads/")) return;

  const filePath = path.join(uploadDirectory, path.basename(image));
  await fs.unlink(filePath).catch(() => {});
};

const normalizePublishedValue = (value) => {
  if (typeof value === "boolean") return value;

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "yes", "y", "1"].includes(normalized)) return true;
    if (["false", "no", "n", "0"].includes(normalized)) return false;
  }

  return Boolean(value);
};

const buildUniqueSlug = async (title, excludeId = null) => {
  const base = createSlug(title || "");
  const safeBase = base || "news-event";

  let slug = safeBase;
  let counter = 2;

  while (await NewsEvent.exists({ slug, _id: { $ne: excludeId } })) {
    slug = `${safeBase}-${counter}`;
    counter += 1;
  }

  return slug;
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const [enquiryCount, publishedNewsCount, draftCount] = await Promise.all([
      Enquiry.countDocuments(),
      NewsEvent.countDocuments({ published: true }),
      NewsEvent.countDocuments({ published: false })
    ]);

    res.json({
      success: true,
      data: {
        enquiryCount,
        publishedNewsCount,
        draftCount
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEnquiries = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const filter = status ? { status } : {};

    const [items, total] = await Promise.all([
      Enquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Enquiry.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).lean();

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found."
      });
    }

    res.json({
      success: true,
      message: "Enquiry status updated successfully.",
      data: enquiry
    });
  } catch (error) {
    next(error);
  }
};

export const getAllNewsEvents = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      NewsEvent.find()
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      NewsEvent.countDocuments()
    ]);

    res.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createNewsEvent = async (req, res, next) => {
  try {
    const { title, category, date, shortDescription, content, image, published } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "An image file is required."
      });
    }

    const slug = await buildUniqueSlug(title);

    const article = await NewsEvent.create({
      title,
      slug,
      category,
      date: new Date(date),
      shortDescription,
      content,
      image: getUploadedImagePath(req.file),
      published: normalizePublishedValue(published)
    });

    res.status(201).json({
      success: true,
      message: "News item created successfully.",
      data: article
    });
  } catch (error) {
    next(error);
  }
};

export const updateNewsEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    if (payload.image && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Upload a JPG, PNG, or WebP image file when changing the image."
      });
    }

    if (payload.title) {
      payload.slug = await buildUniqueSlug(payload.title, id);
    }

    if (payload.published !== undefined) {
      payload.published = normalizePublishedValue(payload.published);
    }

    if (payload.date) {
      payload.date = new Date(payload.date);
    }

    if (req.file) {
      payload.image = getUploadedImagePath(req.file);
    }

    const existingArticle = await NewsEvent.findById(id).select("image").lean();

    const article = await NewsEvent.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    });

    if (!article) {
      await removeLocalImage(payload.image);
      return res.status(404).json({
        success: false,
        message: "News item not found."
      });
    }

    if (req.file && existingArticle?.image !== article.image) {
      await removeLocalImage(existingArticle?.image);
    }

    res.json({
      success: true,
      message: "News item updated successfully.",
      data: article
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNewsEvent = async (req, res, next) => {
  try {
    const article = await NewsEvent.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "News item not found."
      });
    }

    await removeLocalImage(article.image);

    res.json({
      success: true,
      message: "News item deleted successfully."
    });
  } catch (error) {
    next(error);
  }
};
