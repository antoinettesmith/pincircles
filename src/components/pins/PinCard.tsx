"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { getThemedPinImage } from "@/lib/themed-media";

interface PinCardProps {
  pin: {
    id: string;
    title: string;
    description?: string | null;
    imageUrl: string;
    circle?: { name: string; slug: string; category?: { name: string } };
    author?: { username: string };
    _count?: { votes: number; comments: number };
    userHasVoted?: boolean;
  };
}

const FALLBACK_IMAGE = "https://picsum.photos/seed/fallback/600/750";

export function PinCard({ pin }: PinCardProps) {
  const { user } = useAuth();
  const [voteCount, setVoteCount] = useState(pin._count?.votes ?? 0);
  const [hasVoted, setHasVoted] = useState(pin.userHasVoted ?? false);
  const [loading, setLoading] = useState(false);
  const fallbackThemedSrc = getThemedPinImage({
    id: pin.id,
    categoryName: pin.circle?.category?.name,
    circleName: pin.circle?.name,
    title: pin.title,
    description: pin.description,
    fallbackUrl: pin.imageUrl,
  });
  const resolvedSrc = pin.imageUrl || fallbackThemedSrc;
  const [imgSrc, setImgSrc] = useState(resolvedSrc);

  useEffect(() => {
    setImgSrc(resolvedSrc);
  }, [resolvedSrc]);

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || loading) return;
    setLoading(true);
    if (hasVoted) {
      setVoteCount((c) => c - 1);
      setHasVoted(false);
    } else {
      setVoteCount((c) => c + 1);
      setHasVoted(true);
    }
    setLoading(false);
  };

  return (
    <Link href={`/pins/${pin.id}`} className="block pin-grid-item">
      <article className="group overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/80 shadow-lg shadow-amber-950/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-950/10">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            key={imgSrc}
            src={imgSrc}
            alt={pin.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            onError={() => setImgSrc(FALLBACK_IMAGE)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-80" />
          <div className="absolute inset-0 flex items-end justify-end p-3">
            {user && (
              <button
                onClick={handleVote}
                disabled={loading}
                className={`rounded-full px-3 py-1 text-sm font-semibold transition-colors ${
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
        <div className="space-y-3 p-4">
          <h3 className="font-display text-xl font-bold leading-tight text-circle-ink line-clamp-2">
            {pin.title}
          </h3>
          {pin.description ? (
            <p className="line-clamp-2 text-sm leading-6 text-circle-accent">{pin.description}</p>
          ) : null}
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-circle-accent">
            <span>by {pin.author?.username}</span>
            <span>•</span>
            <span>{pin._count?.comments ?? 0} comments</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
