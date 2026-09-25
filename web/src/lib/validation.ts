// lib/validation.ts
//
// Single source of truth for enquiry-form validation. The client uses this
// to show inline errors before submitting; the API route uses it again so
// the server never trusts unvalidated input, even if the client is bypassed.

import { z } from "zod";
import { PROGRAMMES } from "./types";

const MOBILE_REGEX = /^[6-9]\d{9}$/;

export const enquirySchema = z.object({
  parentName: z
    .string()
    .trim()
    .min(2, "Enter the parent's full name")
    .max(80, "Keep this under 80 characters"),
  studentName: z
    .string()
    .trim()
    .min(2, "Enter the child's full name")
    .max(80, "Keep this under 80 characters"),
  classApplyingFor: z.enum(PROGRAMMES, {
    error: "Select the class you're applying for",
  }),
  mobile: z
    .string()
    .trim()
    .regex(MOBILE_REGEX, "Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().max(500, "Keep this under 500 characters").optional().or(z.literal("")),
});

export type EnquiryFormValues = z.infer<typeof enquirySchema>;

/** Runs the schema and returns a field -> message map instead of throwing. */
export function validateEnquiry(values: unknown) {
  const result = enquirySchema.safeParse(values);
  if (result.success) {
    return { success: true as const, data: result.data };
  }

  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return { success: false as const, errors: fieldErrors };
}
