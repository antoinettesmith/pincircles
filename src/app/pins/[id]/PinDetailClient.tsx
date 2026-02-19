"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { apiFetch } from "@/lib/api-client";
import toast from "react-hot-toast";

interface PinDetailClientProps {
  params: Promise<{ id: string }>;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; username: string };
  replies?: Comment[];
}

interface Pin {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  circle?: { name: string; slug: string };
  author?: { username: string };
  _count?: { votes: number; comments: number };
  userHasVoted?: boolean;
  comments?: Comment[];
}

export function PinDetailClient({ params }: PinDetailClientProps) {
  const [pinId, setPinId] = useState<string>("");
  const [pin, setPin] = useState<Pin | null>(null);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [voteCount, setVoteCount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    params.then((p) => setPinId(p.id));
  }, [params]);

  useEffect(() => {
    if (!pinId) return;
    apiFetch<Pin>(`/pins/${pinId}`)
      .then((data) => {
        setPin(data);
        setVoteCount(data._count?.votes ?? 0);
        setHasVoted(data.userHasVoted ?? false);
      })
      .catch(() => setPin(null))
      .finally(() => setLoading(false));
  }, [pinId]);

  const handleVote = async () => {
    if (!user || !pin || voteLoading) return;
    setVoteLoading(true);
    try {
      if (hasVoted) {
        await apiFetch<{ voteCount: number }>(`/pins/${pin.id}/vote`, {
          method: "DELETE",
        });
        setVoteCount((c) => c - 1);
        setHasVoted(false);
      } else {
        const res = await apiFetch<{ voteCount: number }>(`/pins/${pin.id}/vote`, {
          method: "POST",
        });
        setVoteCount(res.voteCount);
        setHasVoted(true);
      }
    } catch {
      toast.error("Failed to vote");
    } finally {
      setVoteLoading(false);
    }
  };

  const handleComment = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    if (!user || !pin || !commentText.trim() || commentLoading) return;
    setCommentLoading(true);
    try {
      await apiFetch(`/pins/${pin.id}/comments`, {
        method: "POST",
        body: { content: commentText.trim(), parentId },
      });
      setCommentText("");
      const updated = await apiFetch<Pin>(`/pins/${pinId}`);
      setPin(updated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading || !pin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-[4/5] bg-circle-surface rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-circle-surface rounded animate-pulse w-3/4" />
            <div className="h-4 bg-circle-surface rounded animate-pulse w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white shadow border border-circle-border">
          <Image
            src={pin.imageUrl}
            alt={pin.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div>
          {pin.circle && (
            <Link
              href={`/circles/${pin.circle.slug}`}
              className="text-sm text-circle-primary font-medium hover:underline"
            >
              {pin.circle.name}
            </Link>
          )}
          <h1 className="text-2xl font-bold mt-1">{pin.title}</h1>
          <p className="text-circle-accent text-sm mt-1">
            by {pin.author?.username}
          </p>
          {pin.description && (
            <p className="mt-4 text-gray-700">{pin.description}</p>
          )}
          <div className="flex items-center gap-4 mt-4">
            {user && (
              <button
                onClick={handleVote}
                disabled={voteLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                  hasVoted
                    ? "bg-circle-primary text-white"
                    : "bg-circle-surface hover:bg-circle-border"
                }`}
              >
                ▲ {voteCount}
              </button>
            )}
            {!user && <span className="text-sm text-circle-accent">▲ {voteCount} votes</span>}
            <span className="text-sm text-circle-accent">
              {pin._count?.comments ?? pin.comments?.length ?? 0} comments
            </span>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold mb-4">Comments</h3>
            {user && (
              <form onSubmit={(e) => handleComment(e)} className="mb-6">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-circle-border focus:ring-2 focus:ring-circle-primary mb-2"
                />
                <button
                  type="submit"
                  disabled={commentLoading || !commentText.trim()}
                  className="px-4 py-2 rounded-full bg-circle-primary text-white text-sm font-medium hover:bg-circle-secondary disabled:opacity-50"
                >
                  {commentLoading ? "Posting..." : "Comment"}
                </button>
              </form>
            )}
            <div className="space-y-4">
              {pin.comments?.length ? (
                pin.comments.map((c) => (
                  <div key={c.id} className="border-l-2 border-circle-border pl-4">
                    <p className="text-sm font-medium">{c.user.username}</p>
                    <p className="text-gray-700">{c.content}</p>
                    <p className="text-xs text-circle-accent mt-1">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                    {c.replies?.map((r) => (
                      <div key={r.id} className="mt-2 ml-4 border-l-2 border-circle-light pl-4">
                        <p className="text-sm font-medium">{r.user.username}</p>
                        <p className="text-gray-700">{r.content}</p>
                        <p className="text-xs text-circle-accent mt-1">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p className="text-circle-accent text-sm">No comments yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
