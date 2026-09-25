import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="bg-[#041f42] px-5 py-10 text-blue-200 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/" className="font-black uppercase tracking-[0.2em] text-white">The Manthan School</Link>
          <p className="mt-2 text-sm">Learning with purpose, growing with wonder.</p>
        </div>
        <nav className="flex gap-5 text-sm font-semibold">
          <Link href="/news-events" className="hover:text-white">News & Events</Link>
          <Link href="/#enquiry" className="hover:text-white">Admissions</Link>
        </nav>
      </div>
    </footer>
  );
}
