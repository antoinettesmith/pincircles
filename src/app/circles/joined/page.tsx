"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/providers/AuthProvider";
import { apiFetch } from "@/lib/api-client";

interface Membership {
  circle: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    imageUrl?: string | null;
    category: { name: string };
    _count: { memberships: number; pins: number };
  };
}

export default function JoinedCirclesPage() {
  const { user } = useAuth();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    apiFetch<Membership[]>("/circles/joined")
      .then(setMemberships)
      .catch(() => setMemberships([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-circle-accent">Please log in to view your circles.</p>
        <Link href="/login" className="text-circle-primary font-medium mt-2 inline-block">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Circles</h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-circle-surface rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : memberships.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-circle-border">
          <p className="text-circle-accent mb-4">You haven&apos;t joined any circles yet.</p>
          <Link
            href="/circles"
            className="text-circle-primary font-medium hover:underline"
          >
            Explore Circles
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {memberships.map(({ circle }) => (
            <Link
              key={circle.id}
              href={`/circles/${circle.slug}`}
              className="block bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition-shadow border border-circle-border"
            >
              <div className="relative h-32 bg-circle-surface">
                {circle.imageUrl ? (
                  <Image src={circle.imageUrl} alt={circle.name} fill className="object-cover" />
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
