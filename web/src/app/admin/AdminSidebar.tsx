"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch(`${apiUrl}/api/auth/logout`, {
      method: "POST",
      credentials: "include"
    });
    router.replace("/admin/login");
  };

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-[#0b487f] bg-[#062e5d] text-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Manthan School</p>
        <p className="mt-2 text-xl font-semibold">Admin workspace</p>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:block lg:flex-1 lg:space-y-2 lg:px-4 lg:pb-0">
        <NavItem href="/admin" label="Dashboard" active={pathname === "/admin"} />
        <NavItem href="/admin/news-events" label="News & Events" active={pathname.startsWith("/admin/news-events")} />
        <NavItem href="/admin/enquiries" label="Enquiries" active={pathname.startsWith("/admin/enquiries")} />
      </nav>
      <button onClick={handleLogout} className="mx-4 mb-5 rounded-lg border border-white/25 px-4 py-2 text-left text-sm font-semibold text-white hover:bg-[#0b487f] lg:mx-4">
        Sign out
      </button>
    </aside>
  );
}

function NavItem({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link href={href} className={`block whitespace-nowrap rounded-lg px-4 py-3 text-sm font-semibold transition ${active ? "bg-[#ed0b82] text-white" : "text-blue-100 hover:bg-[#0b487f] hover:text-white"}`}>
      {label}
    </Link>
  );
}
