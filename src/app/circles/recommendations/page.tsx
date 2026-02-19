"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/providers/AuthProvider";
import { apiFetch } from "@/lib/api-client";

interface Recommendation {
  circle: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    imageUrl?: string | null;
    category: { name: string };
    _count: { memberships: number; pins: number };
  };
  explanation: string;
}

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    apiFetch<Recommendation[]>("/circles/recommendations?limit=5")
      .then(setRecommendations)
      .catch(() => setRecommendations([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-circle-accent">Please log in to see recommendations.</p>
        <Link href="/login" className="text-circle-primary font-medium mt-2 inline-block">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">For You</h1>
      <p className="text-circle-accent mb-6">
        Circles we think you&apos;ll love based on your interests
      </p>
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-circle-surface rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-circle-border">
          <p className="text-circle-accent mb-4">
            Join some circles and engage with pins to get personalized recommendations!
          </p>
          <Link href="/circles" className="text-circle-primary font-medium hover:underline">
            Explore Circles
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map(({ circle, explanation }) => (
            <Link
              key={circle.id}
              href={`/circles/${circle.slug}`}
              className="flex bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition-shadow border border-circle-border"
            >
              <div className="relative w-32 h-32 flex-shrink-0 bg-circle-surface">
                {circle.imageUrl ? (
                  <Image src={circle.imageUrl} alt={circle.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl text-circle-accent">
                    ◯
                  </div>
                )}
              </div>
              <div className="flex-1 p-4 flex flex-col justify-center">
                <span className="text-xs text-circle-primary font-medium">
                  {circle.category.name}
                </span>
                <h3 className="font-semibold mt-1">{circle.name}</h3>
                <p className="text-sm text-circle-accent mt-1">{explanation}</p>
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
