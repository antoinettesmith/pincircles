"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { demoCircles, getCircleDiscussionCount } from "@/lib/demo-content";

type CircleLens = "all" | "active" | "beginners" | "career" | "lifestyle";

export function CirclesClient() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLens, setSelectedLens] = useState<CircleLens>("all");
  const [search, setSearch] = useState("");

  const categories = useMemo(
    () => Array.from(new Set(demoCircles.map((circle) => circle.category.name))),
    []
  );

  const circleMeta = useMemo(
    () =>
      demoCircles.map((circle) => ({
        ...circle,
        discussionCount: getCircleDiscussionCount(circle.slug),
        isBeginnerFriendly:
          ["Budgeting", "Investing", "Job Hunting 2026", "Remote Careers", "Shows To Watch"].includes(
            circle.name
          ),
        isCareerFocused: ["Careers", "Finance"].includes(circle.category.name),
        isLifestyleFocused: ["Lifestyle", "Home", "Food", "Travel"].includes(circle.category.name),
      })),
    []
  );

  const spotlightCircles = useMemo(
    () => [...circleMeta].sort((a, b) => b.discussionCount - a.discussionCount).slice(0, 3),
    [circleMeta]
  );

  const circles = useMemo(() => {
    return circleMeta
      .filter((circle) => {
      const matchesCategory = !selectedCategory || circle.category.name === selectedCategory;
      const haystack = `${circle.name} ${circle.description}`.toLowerCase();
      const matchesSearch = !search || haystack.includes(search.toLowerCase());
      const matchesLens =
        selectedLens === "all" ||
        (selectedLens === "active" && circle.discussionCount >= 5) ||
        (selectedLens === "beginners" && circle.isBeginnerFriendly) ||
        (selectedLens === "career" && circle.isCareerFocused) ||
        (selectedLens === "lifestyle" && circle.isLifestyleFocused);
      return matchesCategory && matchesSearch && matchesLens;
    })
      .sort((a, b) => {
        if (selectedLens === "active") return b.discussionCount - a.discussionCount;
        return b._count.memberships - a._count.memberships;
      });
  }, [circleMeta, search, selectedCategory, selectedLens]);

  return (
    <div className="section-shell py-8 sm:py-10">
      <section className="mb-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="self-start rounded-[2rem] border border-circle-border bg-circle-ink p-6 text-white shadow-2xl shadow-amber-950/10 sm:p-8">
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Explore circles that feel curated, distinct, and alive.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/72">
            Find communities built around shared taste, niche obsessions, and posts worth following.
          </p>
        </div>

        <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <label className="text-sm font-semibold uppercase tracking-[0.22em] text-circle-accent">
            Search circles
          </label>
          <input
            type="text"
            placeholder="Try cozy homes, brunch, dashboards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-3 w-full rounded-2xl border border-circle-border bg-white/90 px-4 py-3 text-circle-ink outline-none focus:border-circle-primary"
          />
          <div className="mt-4">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-circle-accent">Browse by lens</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {([
                ["all", "All circles"],
                ["active", "Most active"],
                ["beginners", "Best for beginners"],
                ["career", "Career & money"],
                ["lifestyle", "Lifestyle"],
              ] as const).map(([lens, label]) => (
                <button
                  key={lens}
                  onClick={() => setSelectedLens(lens)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    selectedLens === lens
                      ? "bg-circle-ink text-white"
                      : "border border-circle-border bg-white text-circle-accent"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-circle-accent">
              Browse By Topic
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                !selectedCategory ? "bg-circle-primary text-white" : "bg-white border border-circle-border"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  selectedCategory === category ? "bg-circle-primary text-white" : "bg-white border border-circle-border"
                }`}
              >
                {category}
              </button>
            ))}
            </div>
          </div>
        </div>
      </section>

      {selectedLens === "all" && !search && !selectedCategory && spotlightCircles.length > 0 && (
        <section className="mb-10 rounded-[2rem] border border-white/70 bg-white/55 p-5 shadow-lg shadow-amber-950/5 sm:p-6">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-circle-accent">
                Right Now
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-circle-ink">
                Circles with the strongest conversation
              </h2>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {spotlightCircles.map((circle) => (
              <Link
                key={circle.id}
                href={`/circles/${circle.slug}`}
                className="rounded-[1.75rem] border border-white/80 bg-white p-5 shadow-lg shadow-amber-950/5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-950/10"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-circle-accent">
                  {circle.category.name}
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold text-circle-ink">{circle.name}</h3>
                <p className="mt-2 text-sm leading-6 text-circle-accent">{circle.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-circle-accent">
                  <span>{circle.discussionCount} thread moments</span>
                  <span>{circle._count.memberships.toLocaleString()} members</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {circles.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {circles.map((circle) => (
            <Link
              key={circle.id}
              href={`/circles/${circle.slug}`}
              className="group block overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 shadow-lg shadow-amber-950/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-950/10"
            >
              <div className="relative h-44 bg-circle-surface">
                <Image src={circle.imageUrl} alt={circle.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <span className="rounded-full border border-white/25 bg-black/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                    {circle.category.name}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {circle.discussionCount >= 5 ? (
                    <span className="rounded-full bg-circle-mist px-3 py-1 text-xs font-semibold text-circle-ink">
                      Most Active
                    </span>
                  ) : null}
                  {circle.isBeginnerFriendly ? (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-circle-accent border border-circle-border">
                      Beginner Friendly
                    </span>
                  ) : null}
                  {circle.isCareerFocused ? (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-circle-accent border border-circle-border">
                      Career Focus
                    </span>
                  ) : null}
                </div>
                <h3 className="font-display text-2xl font-bold text-circle-ink transition-colors group-hover:text-circle-primary">
                  {circle.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-circle-accent">
                  {circle.description}
                </p>
                <div className="mt-4 flex gap-4 text-sm font-medium text-circle-accent">
                  <span>{circle._count.memberships.toLocaleString()} members</span>
                  <span>{circle._count.pins} pins</span>
                  <span>{circle.discussionCount} comments</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-[2rem] p-8 text-center">
          <p className="font-display text-2xl font-bold text-circle-ink">No circles match this search yet.</p>
          <p className="mt-3 text-sm leading-6 text-circle-accent">
            Try switching the lens or clearing the search to explore the full community set.
          </p>
        </div>
      )}
    </div>
  );
}
