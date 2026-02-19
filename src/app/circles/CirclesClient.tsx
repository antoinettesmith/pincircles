"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiFetch } from "@/lib/api-client";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { circles: number };
}

interface Circle {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  category: { name: string };
  _count: { memberships: number; pins: number };
}

export function CirclesClient() {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Category[]>("/categories").then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.set("categoryId", selectedCategory);
    if (search) params.set("search", search);
    apiFetch<{ circles: Circle[] }>(`/circles?${params}`)
      .then((data) => setCircles(data.circles))
      .catch(() => setCircles([]))
      .finally(() => setLoading(false));
  }, [selectedCategory, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Circles</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search circles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-circle-border focus:ring-2 focus:ring-circle-primary"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              !selectedCategory ? "bg-circle-primary text-white" : "bg-white border border-circle-border"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === cat.id ? "bg-circle-primary text-white" : "bg-white border border-circle-border"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-circle-surface rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : circles.length === 0 ? (
        <div className="text-center py-16 text-circle-accent">
          <p className="text-lg">No circles found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {circles.map((circle) => (
            <Link
              key={circle.id}
              href={`/circles/${circle.slug}`}
              className="block bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition-shadow border border-circle-border"
            >
              <div className="relative h-32 bg-circle-surface">
                {circle.imageUrl ? (
                  <Image
                    src={circle.imageUrl}
                    alt={circle.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-circle-accent">
                    ◯
                  </div>
                )}
              </div>
              <div className="p-4">
                <span className="text-xs text-circle-primary font-medium">
                  {circle.category.name}
                </span>
                <h3 className="font-semibold mt-1">{circle.name}</h3>
                <p className="text-sm text-circle-accent line-clamp-2 mt-1">
                  {circle.description || "No description"}
                </p>
                <div className="flex gap-4 mt-2 text-sm text-circle-accent">
                  <span>{circle._count.memberships} members</span>
                  <span>{circle._count.pins} pins</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
