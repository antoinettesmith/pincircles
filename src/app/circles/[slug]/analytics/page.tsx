"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { useParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { apiFetch } from "@/lib/api-client";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface Analytics {
  totalMembers: number;
  activeMembersLast7Days: number;
  totalPins: number;
  totalComments: number;
  totalVotes: number;
  engagementRate: number;
  topPins: Array<{
    id: string;
    title: string;
    imageUrl: string;
    voteCount: number;
    commentCount: number;
  }>;
  engagementOverTime: Array<{
    date: string;
    pins: number;
    votes: number;
    comments: number;
  }>;
  circleHealthScore: number;
}

interface Circle {
  id: string;
  name: string;
  slug: string;
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const params = useParams();
  const slug = params.slug as string;
  const [circle, setCircle] = useState<Circle | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    apiFetch<Circle>(`/circles/${slug}`).then(setCircle).catch(() => setCircle(null));
  }, [slug]);

  useEffect(() => {
    if (!circle || !user) return;
    setLoading(true);
    apiFetch<Analytics>(`/circles/${circle.id}/analytics`)
      .then(setAnalytics)
      .catch(() => setAnalytics(null))
      .finally(() => setLoading(false));
  }, [circle, user]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-circle-accent">Please log in to view analytics.</p>
      </div>
    );
  }

  if (!circle || (loading && !analytics)) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-64 bg-circle-surface rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-circle-accent">Unable to load analytics. You may not be the circle owner.</p>
        <Link href={`/circles/${circle.slug}`} className="text-circle-primary font-medium mt-2 inline-block">
          Back to circle
        </Link>
      </div>
    );
  }

  const engagementChartData = {
    labels: analytics.engagementOverTime.map((d) =>
      new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })
    ),
    datasets: [
      {
        label: "Pins",
        data: analytics.engagementOverTime.map((d) => d.pins),
        backgroundColor: "rgba(230, 0, 35, 0.5)",
      },
      {
        label: "Votes",
        data: analytics.engagementOverTime.map((d) => d.votes),
        backgroundColor: "rgba(142, 142, 147, 0.5)",
      },
      {
        label: "Comments",
        data: analytics.engagementOverTime.map((d) => d.comments),
        backgroundColor: "rgba(189, 8, 28, 0.5)",
      },
    ],
  };

  const trendData = {
    labels: analytics.engagementOverTime.map((d) =>
      new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })
    ),
    datasets: [
      {
        label: "Engagement (votes + comments)",
        data: analytics.engagementOverTime.map((d) => d.votes + d.comments),
        borderColor: "rgb(230, 0, 35)",
        backgroundColor: "rgba(230, 0, 35, 0.1)",
        fill: true,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        href={`/circles/${circle.slug}`}
        className="text-circle-primary font-medium mb-6 inline-block"
      >
        ← Back to {circle.name}
      </Link>
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-circle-border">
          <p className="text-sm text-circle-accent">Total Members</p>
          <p className="text-2xl font-bold">{analytics.totalMembers}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-circle-border">
          <p className="text-sm text-circle-accent">Active (7 days)</p>
          <p className="text-2xl font-bold">{analytics.activeMembersLast7Days}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-circle-border">
          <p className="text-sm text-circle-accent">Total Pins</p>
          <p className="text-2xl font-bold">{analytics.totalPins}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-circle-border">
          <p className="text-sm text-circle-accent">Engagement Rate</p>
          <p className="text-2xl font-bold">{analytics.engagementRate}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-circle-border mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Circle Health Score</h2>
          <span
            className={`text-3xl font-bold ${
              analytics.circleHealthScore >= 70
                ? "text-green-600"
                : analytics.circleHealthScore >= 40
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {analytics.circleHealthScore}/100
          </span>
        </div>
        <div className="w-full h-4 bg-circle-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-circle-primary transition-all"
            style={{ width: `${analytics.circleHealthScore}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl border border-circle-border">
          <h2 className="text-xl font-semibold mb-4">Engagement Over Time (7 days)</h2>
          <div className="h-64">
            <Line
              data={trendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "bottom" } },
              }}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-circle-border">
          <h2 className="text-xl font-semibold mb-4">Activity by Day</h2>
          <div className="h-64">
            <Bar
              data={engagementChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "bottom" } },
                scales: {
                  x: { stacked: true },
                  y: { stacked: true },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-circle-border">
        <h2 className="text-xl font-semibold mb-4">Top Performing Pins</h2>
        {analytics.topPins.length === 0 ? (
          <p className="text-circle-accent">No pins yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {analytics.topPins.map((p) => (
              <Link
                key={p.id}
                href={`/pins/${p.id}`}
                className="block group"
              >
                <div className="relative aspect-square rounded-lg overflow-hidden bg-circle-surface">
                  <Image
                    src={p.imageUrl}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="font-medium text-sm mt-2 line-clamp-2">{p.title}</p>
                <p className="text-xs text-circle-accent">
                  ▲ {p.voteCount} • 💬 {p.commentCount}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
