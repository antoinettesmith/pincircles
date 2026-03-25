"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
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
import { getDemoCircle, getDemoCircleAnalytics } from "@/lib/demo-content";

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

export default function AnalyticsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const circle = getDemoCircle(slug);
  const analytics = getDemoCircleAnalytics(slug);

  if (!circle || !analytics) {
    return (
      <div className="section-shell py-8">
        <div className="glass-panel rounded-[2rem] p-10 text-center">
          <p className="font-display text-2xl font-bold text-circle-ink">Analytics not found.</p>
        </div>
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
        backgroundColor: "rgba(44, 32, 24, 0.45)",
      },
      {
        label: "Comments",
        data: analytics.engagementOverTime.map((d) => d.comments),
        backgroundColor: "rgba(110, 123, 155, 0.55)",
      },
    ],
  };

  const trendData = {
    labels: analytics.engagementOverTime.map((d) =>
      new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })
    ),
    datasets: [
      {
        label: "Engagement",
        data: analytics.engagementOverTime.map((d) => d.votes + d.comments),
        borderColor: "rgb(230, 0, 35)",
        backgroundColor: "rgba(230, 0, 35, 0.08)",
        fill: true,
      },
    ],
  };

  const playbook = [
    `Lean into ${circle.name}'s strongest save-worthy posts and turn them into recurring weekly prompts.`,
    "Highlight one conversation-rich pin each week to keep comment quality visible, not buried.",
    "Use the healthiest post formats as templates for future submissions and onboarding.",
  ];

  return (
    <div className="section-shell py-8 sm:py-10">
      <Link href={`/circles/${circle.slug}`} className="text-sm font-semibold text-circle-primary hover:underline">
        ← Back to {circle.name}
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-[2rem] border border-circle-border bg-circle-ink p-8 text-white shadow-2xl shadow-amber-950/10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/60">
            Creator View
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold">Circle Insights</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/75">
            A lightweight owner-facing view of how this community is growing, what content is landing,
            and where conversation is strongest.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-white/8 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                Circle Health
              </p>
              <p className="mt-3 text-4xl font-bold">{analytics.circleHealthScore}/100</p>
            </div>
            <div className="rounded-[1.5rem] bg-white/8 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                Active Members
              </p>
              <p className="mt-3 text-4xl font-bold">{analytics.activeMembersLast7Days}</p>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-circle-accent">
            Snapshot
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[1.5rem] border border-circle-border bg-white p-4">
              <p className="text-sm text-circle-accent">Members</p>
              <p className="mt-2 text-3xl font-bold text-circle-ink">{analytics.totalMembers}</p>
            </div>
            <div className="rounded-[1.5rem] border border-circle-border bg-white p-4">
              <p className="text-sm text-circle-accent">Pins</p>
              <p className="mt-2 text-3xl font-bold text-circle-ink">{analytics.totalPins}</p>
            </div>
            <div className="rounded-[1.5rem] border border-circle-border bg-white p-4">
              <p className="text-sm text-circle-accent">Comments</p>
              <p className="mt-2 text-3xl font-bold text-circle-ink">{analytics.totalComments}</p>
            </div>
            <div className="rounded-[1.5rem] border border-circle-border bg-white p-4">
              <p className="text-sm text-circle-accent">Engagement Rate</p>
              <p className="mt-2 text-3xl font-bold text-circle-ink">{analytics.engagementRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <div className="glass-panel rounded-[2rem] p-6">
            <h2 className="font-display text-2xl font-bold text-circle-ink">Engagement Trend</h2>
            <div className="mt-5 h-72">
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

          <div className="glass-panel rounded-[2rem] p-6">
            <h2 className="font-display text-2xl font-bold text-circle-ink">Activity Mix</h2>
            <div className="mt-5 h-72">
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

        <div className="space-y-8">
          <div className="glass-panel rounded-[2rem] p-6">
            <h2 className="font-display text-2xl font-bold text-circle-ink">Owner Playbook</h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-circle-accent">
              {playbook.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-6">
            <h2 className="font-display text-2xl font-bold text-circle-ink">Top Performing Pins</h2>
            <div className="mt-5 space-y-4">
              {analytics.topPins.map((pin) => (
                <Link
                  key={pin.id}
                  href={`/pins/${pin.id}`}
                  className="flex gap-4 rounded-[1.5rem] border border-circle-border bg-white/80 p-4 transition hover:-translate-y-0.5"
                >
                  <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-circle-surface">
                    <Image src={pin.imageUrl} alt={pin.title} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-circle-ink">{pin.title}</p>
                    <p className="mt-2 text-sm text-circle-accent">
                      ▲ {pin.voteCount} votes • {pin.commentCount} comments
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
