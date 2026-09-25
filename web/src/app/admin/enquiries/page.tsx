"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../AdminSidebar";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const statuses = ["New", "Contacted", "Closed"] as const;
type Status = (typeof statuses)[number];

type Enquiry = {
  _id: string;
  parentName: string;
  studentName: string;
  classApplyingFor: string;
  mobile: string;
  email: string | null;
  message: string | null;
  status: Status;
  crmStatus: "Sent" | "Failed" | null;
  crmResponse: string | null;
  crmSentAt: string | null;
  createdAt: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export default function EnquiriesPage() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [statusFilter, setStatusFilter] = useState<"All" | Status>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEnquiries = async (page: number, filter: "All" | Status) => {
    setIsLoading(true);
    setError("");

    try {
      const query = new URLSearchParams({ page: String(page), limit: "20" });
      if (filter !== "All") query.set("status", filter);

      const response = await fetch(`${apiUrl}/api/admin/enquiries?${query}`, {
        credentials: "include"
      });

      if (response.status === 401 || response.status === 403) {
        router.replace("/admin/login");
        return;
      }

      const result = await response.json();
      if (!response.ok) {
        setError(result.message || "Unable to load enquiries.");
        return;
      }

      setEnquiries(result.data);
      setPagination(result.pagination);
    } catch {
      setError("Unable to load enquiries.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries(1, statusFilter);
  }, [statusFilter]);

  const updateStatus = async (id: string, status: Status) => {
    const response = await fetch(`${apiUrl}/api/admin/enquiries/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status })
    });

    if (response.status === 401 || response.status === 403) {
      router.replace("/admin/login");
      return;
    }

    const result = await response.json();
    if (!response.ok) {
      setError(result.message || "Unable to update enquiry status.");
      return;
    }

    setEnquiries((current) => current.map((item) => item._id === id ? result.data : item));
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf9f2] text-[#062e5d] lg:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ed0b82]">Admissions</p>
              <h1 className="mt-2 text-3xl font-semibold">Enquiries</h1>
              <p className="mt-2 text-[#062e5d]/65">Newest enquiries appear first.</p>
            </div>
            <label className="text-sm font-semibold">Filter by status<select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "All" | Status)} className="mt-2 block rounded-xl border border-[#062e5d]/20 bg-white px-3 py-2 font-normal outline-none focus:border-[#ed0b82]"><option>All</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          </header>

          {error && <p className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}

          <section className="mt-8 overflow-hidden rounded-2xl border border-[#062e5d]/10 bg-white shadow-sm">
            {isLoading ? <p className="p-6 text-slate-500">Loading enquiries...</p> : enquiries.length === 0 ? <p className="p-6 text-slate-500">No enquiries found.</p> : <div className="divide-y divide-slate-200">{enquiries.map((enquiry) => <EnquiryRow key={enquiry._id} enquiry={enquiry} onStatusChange={updateStatus} />)}</div>}
          </section>

          <footer className="mt-5 flex items-center justify-between gap-4 text-sm text-[#062e5d]/70">
            <span>{pagination.total} total enquiries</span>
            <div className="flex items-center gap-2"><button disabled={pagination.page <= 1 || isLoading} onClick={() => loadEnquiries(pagination.page - 1, statusFilter)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40">Previous</button><span>Page {pagination.page} of {Math.max(pagination.totalPages, 1)}</span><button disabled={pagination.page >= pagination.totalPages || isLoading} onClick={() => loadEnquiries(pagination.page + 1, statusFilter)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40">Next</button></div>
          </footer>
        </div>
      </main>
    </div>
  );
}

function EnquiryRow({ enquiry, onStatusChange }: { enquiry: Enquiry; onStatusChange: (id: string, status: Status) => void }) {
  return (
    <article className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(180px,0.8fr)_minmax(220px,1fr)] lg:p-6">
      <div>
        <div className="flex flex-wrap items-center gap-3"><h2 className="text-lg font-semibold">{enquiry.studentName}</h2><span className="text-sm text-slate-500">{enquiry.classApplyingFor}</span></div>
        <p className="mt-1 text-sm text-[#062e5d]/70">Parent: {enquiry.parentName}</p>
        <p className="mt-1 text-sm text-[#062e5d]/70">{enquiry.mobile}{enquiry.email ? ` · ${enquiry.email}` : ""}</p>
        {enquiry.message && <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{enquiry.message}</p>}
        <p className="mt-3 text-xs text-[#062e5d]/45">{new Date(enquiry.createdAt).toLocaleString()}</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Status</p>
        <select value={enquiry.status} onChange={(event) => onStatusChange(enquiry._id, event.target.value as Status)} className="mt-2 w-full rounded-xl border border-[#062e5d]/20 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-[#ed0b82]"><option>New</option><option>Contacted</option><option>Closed</option></select>
      </div>
      <div className="rounded-xl bg-[#eef9fb] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0b77a8]">CRM result</p>
        <p className={`mt-2 font-semibold ${enquiry.crmStatus === "Sent" ? "text-emerald-700" : enquiry.crmStatus === "Failed" ? "text-red-700" : "text-[#062e5d]/55"}`}>{enquiry.crmStatus || "Not sent"}</p>
        {enquiry.crmResponse && <p className="mt-2 break-words text-sm text-[#062e5d]/70">{enquiry.crmResponse}</p>}
        {enquiry.crmSentAt && <p className="mt-2 text-xs text-[#062e5d]/45">{new Date(enquiry.crmSentAt).toLocaleString()}</p>}
      </div>
    </article>
  );
}
