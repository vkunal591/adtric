import { z } from "zod";

export const enquirySchema = z.object({
  parentName: z
    .string()
    .trim()
    .min(2, "Parent name is required"),

  studentName: z
    .string()
    .trim()
    .min(2, "Student name is required"),

  classApplyingFor: z
    .string()
    .trim()
    .min(1, "Class applying for is required"),

  mobile: z
    .string()
    .trim()
    .regex(
      /^[6-9]\d{9}$/,
      "Mobile must be a valid 10-digit Indian number"
    ),

  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),

  message: z
    .string()
    .trim()
    .max(2000, "Message cannot exceed 2000 characters")
    .optional()
    .or(z.literal(""))
});

export const enquiryStatusSchema = z.object({
  status: z.enum(["New", "Contacted", "Closed"], {
    error: "Status must be one of: New, Contacted, Closed"
  })
});
