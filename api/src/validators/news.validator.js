import { z } from "zod";

const imageSchema = z
  .union([
    z.string().trim().optional().or(z.literal("")),
    z.object({
      originalname: z.string().optional(),
      size: z.number().optional()
    }).passthrough()
  ])
  .refine((value) => {
    if (!value || value === "") return true;

    if (typeof value === "string") {
      return /\.(jpg|jpeg|png|webp)$/i.test(value.trim());
    }

    const fileName = value.originalname || "";
    const size = Number(value.size || 0);
    return /\.(jpg|jpeg|png|webp)$/i.test(fileName) && size <= 2 * 1024 * 1024;
  }, "Image must be a JPG, PNG, or WebP file up to 2 MB.");

const publishedSchema = z
  .union([
    z.boolean(),
    z.enum(["yes", "no", "true", "false", "1", "0"])
  ])
  .transform((value) => {
    if (typeof value === "boolean") return value;
    const normalized = value.toLowerCase();
    return ["yes", "true", "1"].includes(normalized);
  });

export const newsSchema = z.object({
  title: z.string().trim().min(3, "Title is required."),
  slug: z.string().trim().min(3, "Slug is required.").optional(),
  category: z.enum(["News", "Event", "Achievement"]),
  date: z.string().or(z.date()).refine((value) => {
    const parsed = new Date(value);
    return !Number.isNaN(parsed.getTime());
  }, "Please provide a valid date."),
  image: imageSchema,
  shortDescription: z.string().trim().min(10, "Short description is required."),
  content: z.string().trim().min(20, "Content is required."),
  published: publishedSchema.optional().default(false)
});

export const updateNewsSchema = newsSchema.partial();
