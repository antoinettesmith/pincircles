"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { apiFetch } from "@/lib/api-client";
import toast from "react-hot-toast";

interface PinCardProps {
  pin: {
    id: string;
    title: string;
    description?: string | null;
    imageUrl: string;
    circle?: { name: string; slug: string };
    author?: { username: string };
    _count?: { votes: number; comments: number };
    userHasVoted?: boolean;
  };
}

export function PinCard({ pin }: PinCardProps) {
  const { user } = useAuth();
  const [voteCount, setVoteCount] = useState(pin._count?.votes ?? 0);
  const [hasVoted, setHasVoted] = useState(pin.userHasVoted ?? false);
  const [loading, setLoading] = useState(false);

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || loading) return;
    setLoading(true);
    try {
      if (hasVoted) {
        await apiFetch(`/pins/${pin.id}/vote`, { method: "DELETE" });
        setVoteCount((c) => c - 1);
        setHasVoted(false);
      } else {
        await apiFetch<{ voteCount: number }>(`/pins/${pin.id}/vote`, {
          method: "POST",
        });
        setVoteCount((c) => c + 1);
        setHasVoted(true);
      }
    } catch {
      toast.error("Failed to vote");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link href={`/pins/${pin.id}`} className="block pin-grid-item">
      <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition-shadow group">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={pin.imageUrl}
            alt={pin.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-between p-3">
            <span className="text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              {pin.circle?.name}
            </span>
            {user && (
              <button
                onClick={handleVote}
                disabled={loading}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  hasVoted
                    ? "bg-circle-primary text-white"
                    : "bg-white/90 text-gray-800 hover:bg-white"
                }`}
              >
                ▲ {voteCount}
              </button>
            )}
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm line-clamp-2">{pin.title}</h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-circle-accent">
            <span>by {pin.author?.username}</span>
            <span>•</span>
            <span>{pin._count?.comments ?? 0} comments</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
