import NewsEvent from "../models/NewsEvent.js";

export const getPublishedNewsEvents = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      50
    );

    const skip = (page - 1) * limit;
    const search = String(req.query.search || "").trim();
    const category = ["News", "Event", "Achievement"].includes(req.query.category)
      ? req.query.category
      : null;
    const filter = { published: true };

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: escapedSearch, $options: "i" } },
        { shortDescription: { $regex: escapedSearch, $options: "i" } },
        { content: { $regex: escapedSearch, $options: "i" } }
      ];
    }

    if (category) filter.category = category;

    const [items, total] = await Promise.all([
      NewsEvent.find(filter)
        .sort({ date: -1, createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      NewsEvent.countDocuments(filter)
    ]);

    return res.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: skip + items.length < total,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPublishedNewsEventBySlug = async (
  req,
  res,
  next
) => {
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
