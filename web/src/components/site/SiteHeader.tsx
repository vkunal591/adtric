import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b-4 border-[#ed0b82] bg-[#062e5d] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#ed0b82] text-xl font-black">M</span>
          <span className="min-w-0">
            <strong className="block truncate text-lg leading-none">THE MANTHAN</strong>
            <small className="text-xs uppercase tracking-[0.22em] text-cyan-200">School</small>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
          <Link href="/news-events" className="hover:text-cyan-300">News & Events</Link>
          <Link href="/#enquiry" className="hover:text-cyan-300">Admissions</Link>
        </nav>
        <Link href="/#enquiry" className="shrink-0 rounded-full bg-[#ed0b82] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#c9086d]">Enquire now <span aria-hidden="true">→</span></Link>
      </div>
    </header>
  );
}
