"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../AdminSidebar";
import { adminFetch } from "@/lib/admin-auth";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const getImageUrl = (image: string) => {
  if (/^https?:\/\//i.test(image)) return image;
  return `${apiUrl.replace(/\/$/, "")}${image.startsWith("/") ? image : `/${image}`}`;
};

type Category = "News" | "Event" | "Achievement";
type NewsEvent = {
  _id: string;
  title: string;
  category: Category;
  date: string;
  image: string | null;
  shortDescription: string;
  content: string;
  published: boolean;
  slug: string;
};
type NewsForm = {
  title: string;
  category: Category;
  date: string;
  image: File | null;
  shortDescription: string;
  content: string;
  published: "yes" | "no";
};

const emptyForm: NewsForm = {
  title: "",
  category: "News",
  date: "",
  image: null,
  shortDescription: "",
  content: "",
  published: "no",
};

export default function NewsEventsPage() {
  const router = useRouter();
  const [items, setItems] = useState<NewsEvent[]>([]);
  const [form, setForm] = useState<NewsForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const response = await adminFetch(
        `${apiUrl}/api/admin/news?page=1&limit=100`,
      );
      if (response.status === 401 || response.status === 403) {
        router.replace("/admin/login");
        return;
      }
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Unable to load news and events.");
      setItems(result.data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load news and events.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const updateForm = <K extends keyof NewsForm>(
    field: K,
    value: NewsForm[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const openCreateModal = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setNotice("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: NewsEvent) => {
    setForm({
      title: item.title,
      category: item.category,
      date: item.date.slice(0, 10),
      image: null,
      shortDescription: item.shortDescription,
      content: item.content,
      published: item.published ? "yes" : "no",
    });
    setEditingId(item._id);
    setError("");
    setNotice("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const saveItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsSaving(true);

    try {
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("category", form.category);
      payload.append("date", form.date);
      payload.append("shortDescription", form.shortDescription);
      payload.append("content", form.content);
      payload.append("published", form.published);
      if (form.image) payload.append("image", form.image);

      const response = await adminFetch(
        `${apiUrl}/api/admin/news${editingId ? `/${editingId}` : ""}`,
        { method: editingId ? "PATCH" : "POST", body: payload },
      );
      if (response.status === 401 || response.status === 403) {
        router.replace("/admin/login");
        return;
      }

      const result = await response.json();
      if (!response.ok) {
        setError(
          result.message ||
            Object.values(result.errors || {})[0] ||
            "Unable to save item.",
        );
        return;
      }

      setItems((current) =>
        editingId
          ? current.map((item) => (item._id === editingId ? result.data : item))
          : [result.data, ...current],
      );
      setNotice(
        editingId ? "Item updated successfully." : "Item created successfully.",
      );
      closeModal();
    } catch {
      setError("Unable to save item.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!window.confirm("Delete this news or event?")) return;
    const response = await adminFetch(`${apiUrl}/api/admin/news/${id}`, {
      method: "DELETE",
    });
    if (response.status === 401 || response.status === 403) {
      router.replace("/admin/login");
      return;
    }
    if (!response.ok) {
      const result = await response.json();
      setError(result.message || "Unable to delete item.");
      return;
    }
    setItems((current) => current.filter((item) => item._id !== id));
    setNotice("Item deleted successfully.");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf9f2] text-[#062e5d] lg:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ed0b82]">
                Content management
              </p>
              <h1 className="mt-2 text-3xl font-semibold">News & Events</h1>
              <p className="mt-2 text-slate-500">
                Manage news, events, and achievements.
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="rounded-lg bg-[#ed0b82] px-4 py-3 text-sm font-semibold text-white hover:bg-[#c9086d]"
            >
              Add new event
            </button>
          </header>

          {error && (
            <p className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
              {error}
            </p>
          )}
          {notice && (
            <p className="mt-6 rounded-lg bg-emerald-50 p-4 text-emerald-700">
              {notice}
            </p>
          )}

          <section className="mt-8 overflow-hidden rounded-2xl border border-[#062e5d]/10 bg-white shadow-sm">
            {isLoading ? (
              <p className="p-6 text-slate-500">Loading items...</p>
            ) : items.length === 0 ? (
              <p className="p-6 text-slate-500">No news or events yet.</p>
            ) : (
              <div className="divide-y divide-slate-200">
                {items.map((item) => (
                  <article
                    key={item._id}
                    className="flex flex-col gap-4 p-5 transition hover:bg-[#fff8fc] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      {item.image && (
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.title}
                          className="h-16 w-24 shrink-0 rounded object-cover"
                        />
                      )}

                      <div className="min-w-0">
                        <h2 className="truncate font-semibold">{item.title}</h2>
                        <p className="mt-1 text-sm text-[#062e5d]/65">
                          {item.category} ·{" "}
                          {item.published ? "Published" : "Draft"} ·{" "}
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-400">
                          /{item.slug}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                          className="rounded-xl border border-[#062e5d]/20 px-3 py-2 text-sm font-semibold hover:border-[#ed0b82] hover:text-[#ed0b82]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteItem(item._id)}
                        className="rounded-xl bg-[#062e5d] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0b487f]"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#062e5d]/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="news-event-modal-title"
        >
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[#fdf9f2] p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#ed0b82]">
                  News & Events
                </p>
                <h2
                  id="news-event-modal-title"
                  className="mt-1 text-2xl font-semibold"
                >
                  {editingId ? "Edit item" : "Add new event"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-[#062e5d]/20 px-3 py-2 text-sm font-semibold hover:border-[#ed0b82] hover:text-[#ed0b82]"
                aria-label="Close modal"
              >
                Close
              </button>
            </div>
            <form
              onSubmit={saveItem}
              className="mt-6 grid gap-5 md:grid-cols-2"
            >
              <label className="text-sm font-medium">
                Title
                <input
                  required
                  value={form.title}
                  onChange={(event) => updateForm("title", event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="text-sm font-medium">
                Category
                <select
                  value={form.category}
                  onChange={(event) =>
                    updateForm("category", event.target.value as Category)
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  <option>News</option>
                  <option>Event</option>
                  <option>Achievement</option>
                </select>
              </label>
              <label className="text-sm font-medium">
                Date
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(event) => updateForm("date", event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="text-sm font-medium">
                Image
                <input
                  required={!editingId}
                  accept=".jpg,.jpeg,.png,.webp"
                  type="file"
                  onChange={(event) =>
                    updateForm("image", event.target.files?.[0] || null)
                  }
                  className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm font-medium">
                Published
                <select
                  value={form.published}
                  onChange={(event) =>
                    updateForm(
                      "published",
                      event.target.value as NewsForm["published"],
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </label>
              <label className="text-sm font-medium md:col-span-2">
                Short description
                <textarea
                  required
                  minLength={10}
                  value={form.shortDescription}
                  onChange={(event) =>
                    updateForm("shortDescription", event.target.value)
                  }
                  rows={2}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="text-sm font-medium md:col-span-2">
                Content
                <textarea
                  required
                  minLength={20}
                  value={form.content}
                  onChange={(event) =>
                    updateForm("content", event.target.value)
                  }
                  rows={5}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
              <button
                disabled={isSaving}
                className="rounded-xl bg-[#ed0b82] px-4 py-3 font-semibold text-white hover:bg-[#c9086d] disabled:opacity-60 md:col-span-2"
              >
                {isSaving
                  ? "Saving..."
                  : editingId
                    ? "Update item"
                    : "Create item"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
