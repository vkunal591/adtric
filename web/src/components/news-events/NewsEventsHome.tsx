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

  return (
    <section className="bg-[#ed0b82] px-5 py-16 text-white sm:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyan-100">The event diary</p>
            <h2 className="mt-3 text-4xl font-black uppercase leading-none sm:text-5xl">Latest News &amp; Events</h2>
            <p className="mt-2 text-white/80">Events and celebrations that create joyful moments throughout the year.</p>
          </div>
          <Link
            href="/news-events"
            className="rounded-full border border-white/70 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-[#ed0b82]"
          >
            All events &amp; competitions &rarr;
          </Link>
        </div>

        {items.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-white/25 bg-white/10 p-6 text-white/80">
            New events are coming soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.slice(0, 3).map((item) => (
              <EventCard key={item.slug} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
