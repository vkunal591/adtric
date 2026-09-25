"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { saveAdminToken } from "@/lib/admin-auth";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to sign in.");
      }

      saveAdminToken(result.token);
      router.replace("/admin");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#062e5d] px-6 py-12 text-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 rounded-3xl border-t-4 border-[#ed0b82] bg-[#fdf9f2] p-8 text-[#062e5d] shadow-2xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ed0b82]">Manthan School</p>
          <h1 className="mt-3 text-3xl font-semibold">Admin sign in</h1>
        </div>

        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <label className="block text-sm font-medium">
          Email
          <input
            className="mt-2 w-full rounded-xl border border-[#062e5d]/20 bg-white px-3 py-3 outline-none focus:border-[#ed0b82]"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label className="block text-sm font-medium">
          Password
          <input
            className="mt-2 w-full rounded-xl border border-[#062e5d]/20 bg-white px-3 py-3 outline-none focus:border-[#ed0b82]"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        <button
          className="w-full rounded-xl bg-[#ed0b82] px-4 py-3 font-semibold text-white transition hover:bg-[#c9086d] disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
