// components/news-events/EventCard.tsx
import Link from "next/link";
import type { NewsEventItem } from "@/lib/types";

export function EventCard({ item }: { item: NewsEventItem }) {
  return (
    <Link
      href={`/news-events/${item.slug}`}
      className="group relative block overflow-hidden rounded-2xl bg-neutral-900 outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      <div className="relative aspect-[4/3] w-full">
        {item.coverImage.src ? (
          <img
            src={item.coverImage.src}
            alt={item.coverImage.alt}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center bg-[#0b487f] text-5xl text-cyan-200">✦</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="text-sm font-medium text-white">{item.title}</p>
      </div>
    </Link>
  );
}
