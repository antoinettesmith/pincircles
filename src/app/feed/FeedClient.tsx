"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api-client";
import { PinCard } from "@/components/pins/PinCard";

type SortOption = "new" | "top" | "commented" | "trending";

interface FeedResponse {
  pins: Array<{
    id: string;
    title: string;
    description?: string | null;
    imageUrl: string;
    circle?: { name: string; slug: string };
    author?: { username: string };
    _count?: { votes: number; comments: number };
    userHasVoted?: boolean;
  }>;
  total: number;
  page: number;
  limit: number;
}

export function FeedClient() {
  const [pins, setPins] = useState<FeedResponse["pins"]>([]);
  const [sort, setSort] = useState<SortOption>("new");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch<FeedResponse>(`/pins?sort=${sort}&page=1&limit=20`)
      .then((data) => {
        setPins(data.pins);
        setHasMore(data.pins.length === data.limit && data.total > data.limit);
        setPage(1);
      })
      .catch(() => setPins([]))
      .finally(() => setLoading(false));
  }, [sort]);

  const loadMore = () => {
    const nextPage = page + 1;
    setLoading(true);
    apiFetch<FeedResponse>(`/pins?sort=${sort}&page=${nextPage}&limit=20`)
      .then((data) => {
        setPins((prev) => [...prev, ...data.pins]);
        setHasMore(data.pins.length === data.limit);
        setPage(nextPage);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-2 mb-6">
        {(["new", "top", "commented", "trending"] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => setSort(opt)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              sort === opt
                ? "bg-circle-primary text-white"
                : "bg-white border border-circle-border hover:border-circle-primary text-circle-accent"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {loading && pins.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-circle-surface rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : pins.length === 0 ? (
        <div className="text-center py-16 text-circle-accent">
          <p className="text-lg">No pins yet. Join a circle and start sharing!</p>
        </div>
      ) : (
        <>
          <div className="pin-grid">
            {pins.map((pin) => (
              <PinCard key={pin.id} pin={pin} />
            ))}
          </div>
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-2 rounded-full bg-circle-primary text-white font-medium hover:bg-circle-secondary disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
