"use client";

import { useMemo, useState } from "react";
import { PinCard } from "@/components/pins/PinCard";
import { demoPins } from "@/lib/demo-content";

type SortOption = "new" | "top" | "comments" | "trending";

export function FeedClient() {
  const [sort, setSort] = useState<SortOption>("new");
  const [selectedTopic, setSelectedTopic] = useState<string>("All");

  const topics = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(demoPins.map((pin) => pin.circle.category?.name ?? pin.circle.name))
      ),
    ],
    []
  );

  const pins = useMemo(() => {
    const items = [...demoPins].filter((pin) => {
      if (selectedTopic === "All") return true;
      return (
        pin.circle.category?.name === selectedTopic ||
        pin.circle.name === selectedTopic
      );
    });
    if (sort === "top") return items.sort((a, b) => b._count.votes - a._count.votes);
    if (sort === "comments") return items.sort((a, b) => b._count.comments - a._count.comments);
    if (sort === "trending") {
      return items.sort((a, b) => {
        const aScore = a._count.votes * 2 + a._count.comments * 3;
        const bScore = b._count.votes * 2 + b._count.comments * 3;
        return bScore - aScore;
      });
    }
    return items.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [selectedTopic, sort]);

  return (
    <div className="section-shell py-8 sm:py-10">
      <section className="mb-6">
        <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-circle-accent">Feed</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-circle-ink sm:text-5xl">
            Discover visual posts that feel worth saving and worth discussing.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-circle-accent sm:text-lg">
            Explore style, spaces, food, and travel through posts that invite both inspiration and conversation.
          </p>
        </div>
      </section>

      <section className="mb-8 inline-block">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-circle-accent">Sort Lens</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(["new", "top", "comments", "trending"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setSort(opt)}
              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                sort === opt
                  ? "bg-circle-ink text-white"
                  : "border border-circle-border bg-white text-circle-accent hover:border-circle-primary hover:text-circle-ink"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-circle-accent">Topic Lens</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                selectedTopic === topic
                  ? "bg-circle-primary text-white"
                  : "border border-circle-border bg-white text-circle-accent hover:border-circle-primary hover:text-circle-ink"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </section>

      {pins.length > 0 ? (
        <div className="pin-grid">
          {pins.map((pin) => (
            <PinCard key={pin.id} pin={pin} />
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-[2rem] p-8 text-center">
          <p className="font-display text-2xl font-bold text-circle-ink">No posts match this lens yet.</p>
          <p className="mt-3 text-sm leading-6 text-circle-accent">
            Try a different topic or sort state to reopen the feed.
          </p>
        </div>
      )}
    </div>
  );
}
