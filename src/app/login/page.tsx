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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Log in to PinCircles</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-2xl shadow-lg border border-circle-border">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-circle-border focus:ring-2 focus:ring-circle-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-circle-border focus:ring-2 focus:ring-circle-primary focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-circle-primary text-white font-medium hover:bg-circle-secondary disabled:opacity-50 transition-colors"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p className="text-center mt-4 text-circle-accent">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-circle-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
