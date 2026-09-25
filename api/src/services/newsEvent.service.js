import NewsEvent from "../models/NewsEvent.js";
import { createSlug } from "../utils/slug.js";

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

const normalizeImageValue = (image) => {
  if (!image || image === "") return null;

  if (typeof image === "object") {
    const fileName = image.originalname || "";
    const size = Number(image.size || 0);

    if (!/\.(jpg|jpeg|png|webp)$/i.test(fileName)) {
      throw new Error("Image must be in JPG, PNG, or WebP format.");
    }

    if (size > 2 * 1024 * 1024) {
      throw new Error("Image must be 2 MB or smaller.");
    }

    return image.path || fileName;
  }

  const value = String(image).trim();
  if (!value) return null;

  if (!/\.(jpg|jpeg|png|webp)$/i.test(value)) {
    throw new Error("Image must be in JPG, PNG, or WebP format.");
  }

  return value;
};

export const createNewsEvent = async (req, res, next) => {
  try {
    const { title, category, date, shortDescription, content, published, image } = req.body;

    const payload = {
      title,
      category,
      date,
      shortDescription,
      content,
      published: normalizePublishedValue(published),
      image: normalizeImageValue(image),
      slug: await buildUniqueSlug(title)
    };

    const newItem = new NewsEvent(payload);
    await newItem.save();

    return res.status(201).json({
      success: true,
      message: "News item created successfully.",
      data: newItem
    });
  } catch (error) {
    next(error);
  }
};

export const updateNewsEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    if (payload.title) {
      payload.slug = await buildUniqueSlug(payload.title, id);
    }

    if (payload.published !== undefined) {
      payload.published = normalizePublishedValue(payload.published);
    }

    if (payload.image !== undefined) {
      payload.image = normalizeImageValue(payload.image);
    }

    if (payload.date) {
      payload.date = new Date(payload.date);
    }

    const updatedItem = await NewsEvent.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    });

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "News item not found."
      });
    }

    return res.json({
      success: true,
      message: "News item updated successfully.",
      data: updatedItem
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNewsEvent = async (req, res, next) => {
  try {
    const deletedItem = await NewsEvent.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "News item not found."
      });
    }

    return res.json({
      success: true,
      message: "News item deleted successfully."
    });
  } catch (error) {
    next(error);
  }
};






export const getPublishedNewsEvents = async (req, res, next) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(
            Math.max(Number(req.query.limit) || 10, 1),
            50
        );
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            NewsEvent.find({ published: true })
                .sort({ date: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            NewsEvent.countDocuments({
                published: true
            })
        ]);

        return res.json({
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

export const getPublishedNewsEventBySlug = async (req, res, next) => {
    try {
        const item = await NewsEvent.findOne({
            slug: req.params.slug,
            published: true
        }).lean();

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "News or event not found."
            });
        }

        return res.json({
            success: true,
            data: item
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

    return res.json({
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


export const getNewsEventById = async (req, res, next) => {
    try {
        const item = await NewsEvent.findById(req.params.id).lean();

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "News or event not found."
            });
        }

        return res.json({
            success: true,
            data: item
        });
    } catch (error) {
        next(error);
    }
};

