"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { apiFetch } from "@/lib/api-client";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CreateCirclePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    apiFetch<Category[]>("/categories")
      .then(setCategories)
      .catch(() => setCategories([]));
  }, [user]);

  useEffect(() => {
    if (categories.length && !categoryId) setCategoryId(categories[0].id);
  }, [categories, categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const circle = await apiFetch<{ slug: string }>("/circles", {
        method: "POST",
        body: { name, description: description || undefined, categoryId },
      });
      toast.success("Circle created!");
      router.push(`/circles/${circle.slug}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create circle");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-circle-accent">Please log in to create a circle.</p>
        <Link href="/login" className="text-circle-primary font-medium mt-2 inline-block">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create a Circle</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-2xl shadow border border-circle-border">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            className="w-full px-4 py-2 rounded-lg border border-circle-border focus:ring-2 focus:ring-circle-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-circle-border focus:ring-2 focus:ring-circle-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-circle-border focus:ring-2 focus:ring-circle-primary"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-circle-primary text-white font-medium hover:bg-circle-secondary disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Circle"}
        </button>
      </form>
    </div>
  );
}
