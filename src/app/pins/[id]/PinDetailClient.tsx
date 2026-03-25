"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { CommentThread } from "@/components/comments/CommentThread";
import { PinCard } from "@/components/pins/PinCard";
import { getDemoPin, getPinsForCircle, type DemoComment } from "@/lib/demo-content";

interface PinDetailClientProps {
  params: Promise<{ id: string }>;
}

export function PinDetailClient({ params }: PinDetailClientProps) {
  const [pinId, setPinId] = useState("");
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<DemoComment[]>([]);
  const [voteCount, setVoteCount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [saveCount, setSaveCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    params.then((value) => setPinId(value.id));
  }, [params]);

  const pin = useMemo(() => (pinId ? getDemoPin(pinId) : null), [pinId]);

  useEffect(() => {
    if (pin) {
      setComments(pin.comments);
      setVoteCount(pin._count.votes);
      setSaveCount(Math.max(18, Math.round(pin._count.votes * 1.6)));
      setIsSaved(false);
    }
  }, [pin]);

  const relatedPins = useMemo(() => {
    if (!pin) return [];

    return getPinsForCircle(pin.circle.slug)
      .filter((candidate) => candidate.id !== pin.id)
      .slice(0, 3);
  }, [pin]);

  if (!pin) {
    return (
      <div className="section-shell py-8">
        <div className="glass-panel rounded-[2rem] p-10 text-center">
          <p className="font-display text-2xl font-bold text-circle-ink">Pin not found.</p>
        </div>
      </div>
    );
  }

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const next: DemoComment = {
      id: `comment-${Date.now()}`,
      content: commentText.trim(),
      createdAt: new Date().toISOString(),
      user: { id: "local-user", username: user?.username ?? "guest" },
    };
    setComments((prev) => [next, ...prev]);
    setCommentText("");
  };

  const appendReplyToThread = (
    items: DemoComment[],
    parentId: string,
    reply: DemoComment
  ): DemoComment[] =>
    items.map((comment) => {
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
    setComments((prev) =>
      appendReplyToThread(prev, parentId, {
        id: `reply-${Date.now()}`,
        content,
        createdAt: new Date().toISOString(),
        user: { id: "local-user", username: user?.username ?? "guest" },
      })
    );
  };

  return (
    <div className="section-shell py-8 sm:py-10">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="self-start overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-xl shadow-amber-950/5">
          <div className="relative aspect-[4/5]">
            <Image src={pin.imageUrl} alt={pin.title} fill className="object-cover" priority />
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-circle-primary">
            {pin.circle.name}
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-circle-ink">
            {pin.title}
          </h1>
          <p className="mt-3 text-base leading-7 text-circle-accent">{pin.description}</p>
          <p className="mt-4 text-sm font-medium uppercase tracking-[0.16em] text-circle-accent">
            by {pin.author.username}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => {
                setHasVoted((prev) => !prev);
                setVoteCount((prev) => prev + (hasVoted ? -1 : 1));
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                hasVoted
                  ? "bg-circle-primary text-white"
                  : "border border-circle-border bg-white text-circle-ink hover:bg-circle-mist"
              }`}
            >
              ▲ {voteCount} votes
            </button>
            <span className="rounded-full border border-circle-border bg-white px-4 py-2 text-sm font-semibold text-circle-ink">
              {comments.length} comments
            </span>
            <button
              onClick={() => {
                setIsSaved((prev) => !prev);
                setSaveCount((prev) => prev + (isSaved ? -1 : 1));
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                isSaved
                  ? "bg-circle-ink text-white"
                  : "border border-circle-border bg-white text-circle-ink hover:bg-circle-mist"
              }`}
            >
              {isSaved ? "Saved" : "Save"} · {saveCount}
            </button>
            <Link
              href={`/circles/${pin.circle.slug}`}
              className="rounded-full border border-circle-border bg-white px-4 py-2 text-sm font-semibold text-circle-ink hover:bg-circle-mist"
            >
              More from {pin.circle.name}
            </Link>
          </div>

          <div className="mt-8 border-t border-circle-border pt-6">
            <h2 className="font-display text-2xl font-bold text-circle-ink">Comments</h2>
            <form onSubmit={handleComment} className="mt-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                className="w-full rounded-2xl border border-circle-border bg-white/90 px-4 py-3 text-sm outline-none focus:border-circle-primary"
              />
              <button
                type="submit"
                className="mt-3 rounded-full bg-circle-primary px-4 py-2 text-sm font-semibold text-white hover:bg-circle-secondary"
              >
                Post Comment
              </button>
            </form>
            <div className="mt-6 space-y-4">
              {comments.map((comment) => (
                <CommentThread
                  key={comment.id}
                  comment={comment}
                  pinId={pin.id}
                  currentUsername={user?.username}
                  onReply={handleReply}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {relatedPins.length > 0 && (
        <div className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-circle-accent">
                Keep Exploring
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-circle-ink">
                More from {pin.circle.name}
              </h2>
            </div>
            <Link
              href={`/circles/${pin.circle.slug}`}
              className="text-sm font-semibold text-circle-primary hover:underline"
            >
              View circle
            </Link>
          </div>
          <div className="pin-grid">
            {relatedPins.map((relatedPin) => (
              <PinCard key={relatedPin.id} pin={relatedPin} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
