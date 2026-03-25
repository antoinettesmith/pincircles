"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/providers/AuthProvider";
import { PinCard } from "@/components/pins/PinCard";
import { CircleCommentThread } from "@/components/comments/CircleCommentThread";
import { CommentContent } from "@/components/comments/CommentContent";
import { getDemoCircle, getPinsForCircle, type DemoCircleComment } from "@/lib/demo-content";

interface CircleDetailClientProps {
  params: Promise<{ slug: string }>;
}

const pinnedPromptBySlug: Record<string, string> = {
  "ui-design": "What makes a visual reference actually useful to save: layout, hierarchy, interaction, or the reasoning behind it?",
  "travel-photos": "Which shots make you want to book the trip immediately, and which ones feel more like personal journal images?",
  foodie: "What turns a food post from just appetizing into something you would genuinely save and try later?",
  "cozy-homes": "What detail makes a room feel lived in rather than staged: lighting, texture, books, plants, or layout?",
  "workspace-goals": "What makes a setup worth copying in real life: workflow, comfort, lighting, or desk styling?",
  "shows-to-watch": "What series do you keep recommending because the mood, pacing, or production design stays with you?",
  "style-edit": "What makes a style reference feel current without becoming too trend-chased to be useful next season?",
  "social-media-marketing-careers": "What portfolio signal actually helps social candidates stand out right now: strategy, writing, metrics, or taste?",
  "job-hunting-2026": "What has been the most useful part of your search so far: networking, resume edits, targeted applications, or interview prep?",
  budgeting: "What money habit helped you the most once you stopped trying to build the perfect system and just started tracking honestly?",
  "mood-boarding": "When you build a mood board, what do you lock first: color, material, silhouette, references, or emotional tone?",
  "remote-careers": "What makes a remote role feel sustainable long term: async culture, documentation, flexibility, or management style?",
  investing: "What explanation or resource finally made long-term investing feel understandable instead of intimidating?",
};

export function CircleDetailClient({ params }: CircleDetailClientProps) {
  const [slug, setSlug] = useState("");
  const [discussion, setDiscussion] = useState<DemoCircleComment[]>([]);
  const [discussionText, setDiscussionText] = useState("");
  const [isMember, setIsMember] = useState(true);
  const pinsSectionRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    params.then((value) => setSlug(value.slug));
  }, [params]);

  const circle = useMemo(() => (slug ? getDemoCircle(slug) : null), [slug]);
  const pins = useMemo(() => (slug ? getPinsForCircle(slug) : []), [slug]);

  useEffect(() => {
    if (circle) {
      setDiscussion(circle.discussion);
    }
  }, [circle]);

  const pinComments = useMemo(() => {
    return pins
      .flatMap((pin) =>
        pin.comments.slice(0, 1).map((comment) => ({
          ...comment,
          pin: { id: pin.id, title: pin.title },
        }))
      )
      .slice(0, 6);
  }, [pins]);

  const featuredPin = pins[0] ?? null;

  if (!circle) {
    return (
      <div className="section-shell py-8">
        <div className="glass-panel rounded-[2rem] p-10 text-center">
          <p className="font-display text-2xl font-bold text-circle-ink">Circle not found.</p>
        </div>
      </div>
    );
  }

  const pinnedPrompt =
    pinnedPromptBySlug[circle.slug] ??
    "What kinds of posts make this circle feel distinct enough to revisit instead of only saving once?";

  const appendReplyToThread = (
    comments: DemoCircleComment[],
    parentId: string,
    reply: DemoCircleComment
  ): DemoCircleComment[] =>
    comments.map((comment) => {
      if (comment.id === parentId) {
        return { ...comment, replies: [...(comment.replies ?? []), reply] };
      }

      if (!comment.replies?.length) {
        return comment;
      }

      return {
        ...comment,
        replies: appendReplyToThread(comment.replies, parentId, reply),
      };
    });

  const handleReply = async (content: string, parentId: string) => {
    const reply: DemoCircleComment = {
      id: `reply-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      user: { id: "local-user", username: user?.username ?? "guest" },
    };

    setDiscussion((prev) => appendReplyToThread(prev, parentId, reply));
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionText.trim()) return;
    const next: DemoCircleComment = {
      id: `comment-${Date.now()}`,
      content: discussionText.trim(),
      createdAt: new Date().toISOString(),
      user: { id: "local-user", username: user?.username ?? "guest" },
    };
    setDiscussion((prev) => [next, ...prev]);
    setDiscussionText("");
  };

  return (
    <div className="section-shell py-8 sm:py-10">
      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-xl shadow-amber-950/5">
        <div className="relative h-56 sm:h-72">
          <Image src={circle.imageUrl} alt={circle.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
              {circle.category.name}
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">{circle.name}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/80 sm:text-base">
              {circle.description}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 p-6 text-sm text-circle-accent">
          <span>{circle._count.memberships.toLocaleString()} members</span>
          <span>{circle._count.pins} pins</span>
          <span>by {circle.owner.username}</span>
          <button
            onClick={() => setIsMember((value) => !value)}
            className={`rounded-full px-4 py-2 font-semibold ${
              isMember
                ? "border border-circle-border bg-white text-circle-ink hover:bg-circle-mist"
                : "bg-circle-primary text-white hover:bg-circle-secondary"
            }`}
          >
            {isMember ? "Joined" : "Join Circle"}
          </button>
          <button
            onClick={() => pinsSectionRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="rounded-full border border-circle-border bg-white px-4 py-2 font-semibold text-circle-ink hover:bg-circle-mist"
          >
            Jump to Pins
          </button>
          <Link
            href={`/circles/${circle.slug}/analytics`}
            className="rounded-full border border-circle-border bg-white px-4 py-2 font-semibold text-circle-ink hover:bg-circle-mist"
          >
            View Insights
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="glass-panel rounded-[2rem] p-6">
          <div className="rounded-[1.5rem] border border-circle-border bg-white/85 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-circle-accent">
              Pinned Prompt
            </p>
            <p className="mt-3 text-base leading-7 text-circle-ink">{pinnedPrompt}</p>
          </div>

          <h2 className="font-display text-2xl font-bold text-circle-ink">Discussion</h2>
          <p className="mt-2 text-sm leading-6 text-circle-accent">
            Swap references, explain why a post works, and build taste together instead of only collecting screenshots.
          </p>
          <form onSubmit={handleComment} className="mt-5">
            <textarea
              value={discussionText}
              onChange={(e) => setDiscussionText(e.target.value)}
              placeholder="Add a take, question, or critique..."
              rows={3}
              className="w-full rounded-2xl border border-circle-border bg-white/90 px-4 py-3 text-sm outline-none focus:border-circle-primary"
            />
            <button
              type="submit"
              className="mt-3 rounded-full bg-circle-primary px-4 py-2 text-sm font-semibold text-white hover:bg-circle-secondary"
            >
              Post to Discussion
            </button>
          </form>
          <div className="mt-6 space-y-4">
            {discussion.map((comment) => (
              <CircleCommentThread
                key={comment.id}
                comment={comment}
                circleId={circle.id}
                currentUsername={user?.username}
                onReply={handleReply}
              />
            ))}
          </div>
        </section>

        <aside className="glass-panel rounded-[2rem] p-6">
          {featuredPin && (
            <div className="rounded-[1.5rem] border border-circle-border bg-white/85 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-circle-accent">
                Featured Pin
              </p>
              <Link href={`/pins/${featuredPin.id}`} className="mt-3 block hover:opacity-90">
                <p className="font-display text-2xl font-bold text-circle-ink">{featuredPin.title}</p>
                <p className="mt-2 text-sm leading-6 text-circle-accent">{featuredPin.description}</p>
                <p className="mt-3 text-sm font-semibold text-circle-primary">Open pin discussion</p>
              </Link>
            </div>
          )}

          <h2 className="mt-5 font-display text-2xl font-bold text-circle-ink">Recent Activity</h2>
          <div className="mt-5 space-y-4">
            {pinComments.map((comment) => (
              <div key={comment.id} className="rounded-2xl border border-circle-border bg-white/80 p-4">
                <p className="text-sm">
                  <span className="font-semibold text-circle-ink">{comment.user.username}</span>
                  <span className="text-circle-accent"> on </span>
                  <Link href={`/pins/${comment.pin.id}`} className="font-semibold text-circle-primary hover:underline">
                    {comment.pin.title}
                  </Link>
                </p>
                <p className="mt-2 text-sm leading-6 text-circle-accent">
                  <CommentContent content={comment.content} />
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div ref={pinsSectionRef} className="mt-10">
        <h2 className="mb-4 font-display text-3xl font-bold text-circle-ink">Pins</h2>
        <div className="pin-grid">
          {pins.map((pin) => (
            <PinCard key={pin.id} pin={pin} />
          ))}
        </div>
      </div>
    </div>
  );
}
