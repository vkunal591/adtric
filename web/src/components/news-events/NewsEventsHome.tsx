// components/news-events/NewsEventsHome.tsx
//
// Homepage section. This is a Server Component: it fetches on the server
// (see lib/news-events-data.ts) and streams pre-rendered HTML, so no news
// data or fetching logic ever ships to the browser for this section.

import Link from "next/link";
import { getLatestPublishedNewsEvents } from "@/lib/news-events-data";
import { EventCard } from "./EventCard";

export async function NewsEventsHome() {
  const items = await getLatestPublishedNewsEvents(3);

  if (items.length === 0) return null;

  return (
    <section className="bg-[#E6165C] px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">The Event Diary</h2>
            <p className="mt-2 text-white/80">Events and celebrations that create joyful moments throughout the year.</p>
          </div>
          <Link
            href="/news-events"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#E6165C] transition hover:bg-white/90"
          >
            All events &amp; competitions &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map((item) => (
            <EventCard key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
