// lib/news-events-data.ts
//
// Server-only data access for News & Events. Every function here is meant to
// be called from Server Components / Route Handlers, never from the client.
//
import "server-only";
import type { NewsEventItem, Paginated } from "./types";

const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

type ApiNewsEvent = {
  slug: string;
  title: string;
  date: string;
  image: string | null;
  shortDescription: string;
  content: string;
};

type ApiPage = {
  data: ApiNewsEvent[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export type NewsEventFilters = {
  search?: string;
  category?: "News" | "Event" | "Achievement";
};

function mapItem(item: ApiNewsEvent): NewsEventItem {
  const image = item.image?.startsWith("http")
    ? item.image
    : item.image
      ? `${apiUrl}${item.image.startsWith("/") ? item.image : `/${item.image}`}`
      : "";

  return {
    slug: item.slug,
    title: item.title,
    excerpt: item.shortDescription,
    body: item.content,
    coverImage: { src: image, alt: item.title },
    publishedAt: item.date,
    status: "published",
    metaDescription: item.shortDescription,
  };
}

/** Latest N published items, newest first. Used on the homepage widget. */
export async function getLatestPublishedNewsEvents(limit = 3): Promise<NewsEventItem[]> {
  try {
    const response = await fetch(`${apiUrl}/api/news-events?page=1&limit=${limit}`, { cache: "no-store" });
    if (!response.ok) return [];
    const result = (await response.json()) as ApiPage;
    return result.data.map(mapItem);
  } catch {
    return [];
  }
}

/** Paginated published items, newest first. Used on the "View all" page. */
export async function getPublishedNewsEventsPage(
  page: number,
  pageSize = 9,
  filters: NewsEventFilters = {}
): Promise<Paginated<NewsEventItem>> {
  try {
    const safePage = Math.max(1, page);
    const query = new URLSearchParams({ page: String(safePage), limit: String(pageSize) });
    if (filters.search) query.set("search", filters.search);
    if (filters.category) query.set("category", filters.category);
    const response = await fetch(`${apiUrl}/api/news-events?${query}`, { cache: "no-store" });
    if (!response.ok) return { items: [], page: safePage, pageSize, totalItems: 0, totalPages: 1 };
    const result = (await response.json()) as ApiPage;
    return {
      items: result.data.map(mapItem),
      page: result.pagination.page,
      pageSize: result.pagination.limit,
      totalItems: result.pagination.total,
      totalPages: Math.max(1, result.pagination.totalPages),
    };
  } catch {
    return { items: [], page: Math.max(1, page), pageSize, totalItems: 0, totalPages: 1 };
  }
}

/** A single published item by slug, or null if it doesn't exist / isn't published. */
export async function getPublishedNewsEventBySlug(slug: string): Promise<NewsEventItem | null> {
  try {
    const response = await fetch(`${apiUrl}/api/news-events/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (!response.ok) return null;
    const result = (await response.json()) as { data: ApiNewsEvent };
    return mapItem(result.data);
  } catch {
    return null;
  }
}
