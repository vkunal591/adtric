"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type DashboardStats = {
  enquiryCount: number;
  publishedNewsCount: number;
  draftCount: number;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${apiUrl}/api/admin/dashboard`, { credentials: "include" })
      .then(async (response) => {
        if (response.status === 401 || response.status === 403) {
          router.replace("/admin/login");
          return null;
        }

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Unable to load dashboard.");
        return result.data as DashboardStats;
      })
      .then((data) => data && setStats(data))
      .catch((dashboardError) => setError(dashboardError instanceof Error ? dashboardError.message : "Unable to load dashboard."));
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf9f2] text-[#062e5d] lg:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ed0b82]">Manthan School</p>
              <h1 className="mt-2 text-3xl font-semibold">Admin dashboard</h1>
            </div>
            <Link href="/admin/news-events" className="rounded-lg bg-[#ed0b82] px-4 py-3 text-sm font-semibold text-white hover:bg-[#c9086d]">Manage News & Events</Link>
          </header>

          {error && <p className="mt-8 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}

          <section className="mt-10 grid gap-5 sm:grid-cols-3">
            <Stat label="Enquiries" value={stats?.enquiryCount} />
            <Stat label="Published news" value={stats?.publishedNewsCount} />
            <Stat label="Drafts" value={stats?.draftCount} />
          </section>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value?: number }) {
  return (
    <div className="rounded-2xl border border-[#062e5d]/10 bg-white p-6 shadow-sm">
      <p className="text-sm text-[#0b77a8]">{label}</p>
      <p className="mt-3 text-4xl font-semibold">{value ?? "..."}</p>
    </div>
  );
}
