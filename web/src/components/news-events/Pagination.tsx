// components/news-events/Pagination.tsx
//
// Plain links (?page=N), so pagination works without client-side JS and
// each page is independently crawlable / linkable.

import Link from "next/link";

export function Pagination({ page, totalPages, query = "" }: { page: number; totalPages: number; query?: string }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
      <PageLink page={page - 1} disabled={page <= 1} query={query}>
        Previous
      </PageLink>

      <ul className="flex items-center gap-1">
        {pages.map((p) => (
          <li key={p}>
            <Link
              href={`/news-events?page=${p}${query}`}
              aria-current={p === page ? "page" : undefined}
              className={
                p === page
                  ? "flex h-9 w-9 items-center justify-center rounded-full bg-[#ed0b82] text-sm font-semibold text-white"
                  : "flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-[#062e5d] hover:bg-[#eef9fb]"
              }
            >
              {p}
            </Link>
          </li>
        ))}
      </ul>

      <PageLink page={page + 1} disabled={page >= totalPages} query={query}>
        Next
      </PageLink>
    </nav>
  );
}

function PageLink({
  page,
  disabled,
  query,
  children,
}: {
  page: number;
  disabled: boolean;
  query: string;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span className="rounded-full px-3 py-1.5 text-sm font-medium text-neutral-300">
        {children}
      </span>
    );
  }
  return (
    <Link
      href={`/news-events?page=${page}${query}`}
      className="rounded-full px-3 py-1.5 text-sm font-medium text-[#062e5d] hover:bg-[#eef9fb]"
    >
      {children}
    </Link>
  );
}
