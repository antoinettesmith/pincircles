"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/providers/AuthProvider";
import { apiFetch } from "@/lib/api-client";
import { PinCard } from "@/components/pins/PinCard";
import toast from "react-hot-toast";

interface CircleDetailClientProps {
  params: Promise<{ slug: string }>;
}

interface Circle {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  category: { name: string };
  owner: { username: string };
  _count: { memberships: number; pins: number };
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
}

export function CircleDetailClient({ params }: CircleDetailClientProps) {
  const [slug, setSlug] = useState<string>("");
  const [circle, setCircle] = useState<Circle | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    apiFetch<Circle>(`/circles/${slug}`)
      .then(async (c) => {
        setCircle(c);
        const { pins: pinList } = await apiFetch<{ pins: Pin[] }>(
          `/pins?circleId=${c.id}&sort=new&limit=50`
        );
        setPins(pinList);
      })
      .catch(() => setCircle(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!circle || !user) return;
    apiFetch<{ memberships: Array<{ circleId: string }> }>("/circles/joined")
      .then((data) => {
        const joined = data.memberships.some((m) => m.circleId === circle.id);
        setIsMember(joined);
      })
      .catch(() => setIsMember(false));
  }, [circle, user]);

  const handleJoinLeave = async () => {
    if (!user || !circle || actionLoading) return;
    setActionLoading(true);
    try {
      if (isMember) {
        await apiFetch(`/circles/${circle.id}/leave`, { method: "POST" });
        setIsMember(false);
        toast.success("Left circle");
      } else {
        await apiFetch(`/circles/${circle.id}/join`, { method: "POST" });
        setIsMember(true);
        toast.success("Joined circle!");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !circle) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-64 bg-circle-surface rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow border border-circle-border overflow-hidden mb-8">
        <div className="relative h-48 bg-circle-surface">
          {circle.imageUrl ? (
            <Image src={circle.imageUrl} alt={circle.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl text-circle-accent">
              ◯
            </div>
          )}
        </div>
        <div className="p-6">
          <span className="text-sm text-circle-primary font-medium">{circle.category.name}</span>
          <h1 className="text-3xl font-bold mt-1">{circle.name}</h1>
          <p className="text-circle-accent mt-2">{circle.description || "No description"}</p>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <span className="text-sm text-circle-accent">
              {circle._count.memberships} members • {circle._count.pins} pins
            </span>
            <span className="text-sm text-circle-accent">by {circle.owner.username}</span>
            {user && (
              <>
                <button
                  onClick={handleJoinLeave}
                  disabled={actionLoading}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    isMember
                      ? "border border-circle-border hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                      : "bg-circle-primary text-white hover:bg-circle-secondary"
                  }`}
                >
                  {actionLoading ? "..." : isMember ? "Leave" : "Join"}
                </button>
                {isMember && (
                  <Link
                    href={`/circles/${circle.slug}/create-pin`}
                    className="px-4 py-2 rounded-full bg-circle-primary text-white text-sm font-medium hover:bg-circle-secondary"
                  >
                    Create Pin
                  </Link>
                )}
                {circle.owner.username === user.username && (
                  <Link
                    href={`/circles/${circle.slug}/analytics`}
                    className="px-4 py-2 rounded-full border border-circle-border text-sm font-medium hover:bg-circle-surface"
                  >
                    Analytics
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Pins</h2>
      {pins.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-circle-border text-circle-accent">
          <p>No pins yet. {isMember && "Be the first to share!"}</p>
        </div>
      ) : (
        <div className="pin-grid">
          {pins.map((pin) => (
            <PinCard key={pin.id} pin={{ ...pin, circle: { name: circle.name, slug: circle.slug } }} />
          ))}
        </div>
      )}
    </div>
  );
}
