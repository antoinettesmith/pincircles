"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { apiFetch } from "@/lib/api-client";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch<{ token: string }>("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      login(res.token);
      toast.success("Welcome back!");
      router.push("/feed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-shell py-10 sm:py-16">
      <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_0.75fr]">
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-circle-accent">Welcome back</p>
          <h1 className="max-w-xl font-display text-5xl font-bold leading-tight text-circle-ink">
            Log in to your circles and pick up where inspiration left off.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-circle-accent">
            Return to the feed, revisit community conversations, and surface the next great idea.
          </p>
        </div>

        <div className="glass-panel w-full rounded-[2rem] p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-circle-ink">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-circle-border bg-white/90 px-4 py-3 focus:border-circle-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-circle-ink">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-circle-border bg-white/90 px-4 py-3 focus:border-circle-primary focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-circle-primary py-3 text-base font-semibold text-white shadow-lg shadow-circle-primary/20 transition-colors hover:bg-circle-secondary disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
          <p className="mt-5 text-center text-circle-accent">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-circle-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
