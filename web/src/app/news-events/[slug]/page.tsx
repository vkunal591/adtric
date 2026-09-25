// app/news-events/[slug]/page.tsx
//
// Server Component. Data (including the title/description used for
// generateMetadata) is fetched on the server via lib/news-events-data.ts —
// nothing here runs in the browser.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedNewsEventBySlug } from "@/lib/news-events-data";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublishedNewsEventBySlug(slug);

  if (!item) {
    return { title: "News & Events" };
  }

  return {
    title: item.title,
    description: item.metaDescription,
    openGraph: {
      title: item.title,
      description: item.metaDescription,
      images: [{ url: item.coverImage.src }],
    },
  };
}

export default async function NewsEventDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getPublishedNewsEventBySlug(slug);

  if (!item) notFound();

  const publishedDate = new Date(item.publishedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <><SiteHeader /><main className="min-h-screen bg-[#fdf9f2] px-5 py-12 text-[#062e5d] sm:px-8 sm:py-16">
      <article className="mx-auto max-w-3xl">
      <Link href="/news-events" className="text-sm font-semibold text-[#ed0b82] hover:underline">
        &larr; All news &amp; events
      </Link>

      <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-[#0b77a8]">Published {publishedDate}</p>
      <h1 className="mt-3 text-4xl font-black uppercase sm:text-6xl">{item.title}</h1>

      {item.coverImage.src && <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-3xl bg-[#0b487f]"><img src={item.coverImage.src} alt={item.coverImage.alt} className="h-full w-full object-cover" /></div>}

      <div className="prose prose-neutral mt-8 max-w-none text-[#062e5d]/80">
        {item.body.split("\n\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      </article>
    </main><SiteFooter /></>
  );
}
