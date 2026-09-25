import { createSlug } from "../utils/slug.js";

const normalizeNewsPayload = (req, res, next) => {
  const { title, slug, date, ...rest } = req.body || {};

  if (!title) {
    return next();
  }

  req.body = {
    ...rest,
    title,
    slug: (slug || createSlug(title)).trim(),
    date: date ? new Date(date) : undefined
  };

  next();
};

export default normalizeNewsPayload;
