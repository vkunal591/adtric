// lib/types.ts

export type NewsEventItem = {
  slug: string;
  title: string;
  /** Short line shown on cards (e.g. "Diwali celebration") */
  excerpt: string;
  /** Full body for the detail page. Plain text paragraphs, split on \n\n. */
  body: string;
  coverImage: {
    src: string;
    alt: string;
  };
  /** ISO date string. Used for sorting and for the detail page's byline. */
  publishedAt: string;
  status: "published" | "draft";
  /** Used to build the detail page's <meta name="description">. */
  metaDescription: string;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export const PROGRAMMES = [
  "Playgroup",
  "Nursery",
  "LKG",
  "UKG",
  "Grade 1",
  "Grade 2",
] as const;

export type Programme = (typeof PROGRAMMES)[number];

export type EnquiryInput = {
  parentName: string;
  studentName: string;
  classApplyingFor: Programme | "";
  mobile: string;
  email?: string;
  message?: string;
};

export type FieldErrors = Partial<Record<keyof EnquiryInput, string>>;
