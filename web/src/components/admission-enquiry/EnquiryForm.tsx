"use client";

// components/admission-enquiry/EnquiryForm.tsx
//
// Client Component (needs state + event handlers). Validates inline with
// the shared zod schema, then POSTs to the Express enquiries endpoint via fetch so the page
// never reloads. Server-side errors from the API (if validation is bypassed,
// or a future backend rejects the input) render the same way as client ones.

import { useId, useState, type FormEvent } from "react";
import { PROGRAMMES, type EnquiryInput, type FieldErrors } from "@/lib/types";
import { enquirySchema } from "@/lib/validation";

const EMPTY_FORM: EnquiryInput = {
  parentName: "",
  studentName: "",
  classApplyingFor: "",
  mobile: "",
  email: "",
  message: "",
};

type Status = "idle" | "submitting" | "success" | "error";

export function EnquiryForm() {
  const [values, setValues] = useState<EnquiryInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const formTitleId = useId();

  function setField<K extends keyof EnquiryInput>(field: K, value: EnquiryInput[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear that field's error as soon as the person starts fixing it.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const result = enquirySchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof EnquiryInput;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setStatus("submitting");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const body = await res.json();

      if (!res.ok) {
        if (body?.errors) setErrors(body.errors as FieldErrors);
        setFormError(body?.message ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setValues(EMPTY_FORM);
      setErrors({});
    } catch {
      setFormError("We couldn't reach the server. Check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center"
      >
        <p className="text-lg font-semibold text-emerald-900">Thanks — we've got your enquiry.</p>
        <p className="mt-1 text-sm text-emerald-700">
          Our admissions team will call you shortly to schedule a visit.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-emerald-800 underline underline-offset-2"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} aria-labelledby={formTitleId} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Parent name"
          error={errors.parentName}
          input={
            <input
              id="parentName"
              name="parentName"
              type="text"
              autoComplete="name"
              value={values.parentName}
              onChange={(e) => setField("parentName", e.target.value)}
              aria-invalid={!!errors.parentName}
              aria-describedby={errors.parentName ? "parentName-error" : undefined}
              className={inputClass(!!errors.parentName)}
            />
          }
          errorId="parentName-error"
        />

        <Field
          label="Mobile number"
          error={errors.mobile}
          input={
            <input
              id="mobile"
              name="mobile"
              type="tel"
              autoComplete="tel"
              value={values.mobile}
              onChange={(e) => setField("mobile", e.target.value)}
              aria-invalid={!!errors.mobile}
              aria-describedby={errors.mobile ? "mobile-error" : undefined}
              className={inputClass(!!errors.mobile)}
            />
          }
          errorId="mobile-error"
        />

        <Field
          label="Student name"
          error={errors.studentName}
          input={
            <input
              id="studentName"
              name="studentName"
              type="text"
              value={values.studentName}
              onChange={(e) => setField("studentName", e.target.value)}
              aria-invalid={!!errors.studentName}
              aria-describedby={errors.studentName ? "studentName-error" : undefined}
              className={inputClass(!!errors.studentName)}
            />
          }
          errorId="studentName-error"
        />

        <Field
          label="Class applying for"
          error={errors.classApplyingFor}
          input={
            <select
              id="classApplyingFor"
              name="classApplyingFor"
              value={values.classApplyingFor}
              onChange={(e) => setField("classApplyingFor", e.target.value as EnquiryInput["classApplyingFor"])}
              aria-invalid={!!errors.classApplyingFor}
              aria-describedby={errors.classApplyingFor ? "classApplyingFor-error" : undefined}
              className={inputClass(!!errors.classApplyingFor)}
            >
              <option value="" disabled>
                Select a programme
              </option>
              {PROGRAMMES.map((programme) => (
                <option key={programme} value={programme}>
                  {programme}
                </option>
              ))}
            </select>
          }
          errorId="classApplyingFor-error"
        />

        <Field
          label="Email address (optional)"
          error={errors.email}
          input={
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={inputClass(!!errors.email)}
            />
          }
          errorId="email-error"
        />
      </div>

      <Field
        label="Message (optional)"
        error={errors.message}
        input={
          <textarea
            id="message"
            name="message"
            rows={3}
            value={values.message}
            onChange={(e) => setField("message", e.target.value)}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={inputClass(!!errors.message)}
          />
        }
        errorId="message-error"
      />

      {formError && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-[#ed0b82] py-3 text-sm font-semibold text-white transition hover:bg-[#c9086d] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Book my visit"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  input,
  errorId,
}: {
  label: string;
  error?: string;
  input: React.ReactNode;
  errorId: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-neutral-700">{label}</span>
      {input}
      {error && (
        <span id={errorId} role="alert" className="mt-1 block text-xs font-medium text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}

function inputClass(hasError: boolean) {
  return [
  "w-full rounded-xl border bg-white px-3 py-3 text-sm text-neutral-900 outline-none transition",
  "focus:ring-2 focus:ring-[#ed0b82]/30",
    hasError ? "border-red-400" : "border-neutral-300 focus:border-[#ed0b82]",
  ].join(" ");
}
