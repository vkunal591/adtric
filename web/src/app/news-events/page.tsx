// app/news-events/page.tsx
//
// Server Component: data for this page is fetched on the server (see
// lib/news-events-data.ts) before any HTML reaches the browser.

import type { Metadata } from "next";
import { getPublishedNewsEventsPage, type NewsEventFilters } from "@/lib/news-events-data";
import { EventCard } from "@/components/news-events/EventCard";
import { Pagination } from "@/components/news-events/Pagination";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "News & Events",
  description:
    "All published news, celebrations and competitions from across the school year.",
};

export default async function NewsEventsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; category?: string }>;
}) {
  const params = await searchParams;
  const requestedPage = Number(params.page ?? "1");
  const page =
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const category = ["News", "Event", "Achievement"].includes(params.category || "")
    ? params.category as NewsEventFilters["category"]
    : undefined;
  const filters = { search: params.search?.trim(), category };

  const {
    items,
    totalPages,
    page: currentPage,
    totalItems,
  } = await getPublishedNewsEventsPage(page, 9, filters);
  const query = `${params.search ? `&search=${encodeURIComponent(params.search)}` : ""}${category ? `&category=${category}` : ""}`;

  return (
    <><SiteHeader /><main className="min-h-screen bg-[#fdf9f2] px-5 py-12 text-[#062e5d] sm:px-8 sm:py-16 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ed0b82]">
          The event diary
        </p>
        <h1 className="mt-3 text-4xl font-black uppercase sm:text-6xl">
          News &amp; Events
        </h1>
        <p className="mt-3 max-w-xl text-[#062e5d]/70">
          Everything we&apos;ve celebrated, competed in and gotten up to.
        </p>

        <form action="/news-events" method="get" className="mt-8 grid gap-3 rounded-2xl border border-[#062e5d]/10 bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto_auto]">
          <input name="search" defaultValue={params.search || ""} placeholder="Search news and events" className="rounded-xl border border-[#062e5d]/20 px-4 py-3 outline-none focus:border-[#ed0b82]" />
          <select name="category" defaultValue={category || ""} className="rounded-xl border border-[#062e5d]/20 px-4 py-3 outline-none focus:border-[#ed0b82]"><option value="">All categories</option><option value="News">News</option><option value="Event">Event</option><option value="Achievement">Achievement</option></select>
          <button type="submit" className="rounded-xl bg-[#ed0b82] px-5 py-3 font-bold text-white hover:bg-[#c9086d]">Filter</button>
        </form>
        <p className="mt-5 text-sm text-[#062e5d]/60">{totalItems} published {totalItems === 1 ? "item" : "items"}</p>

        {items.length === 0 ? (
          <p className="mt-12 text-[#062e5d]/60">
            No events have been published yet.
          </p>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => (
                <EventCard key={item.slug} item={item} />
              ))}
            </div>
            <Pagination page={currentPage} totalPages={totalPages} query={query} />
          </>
        )}
      </div>
    </main><SiteFooter /></>
  );
}
