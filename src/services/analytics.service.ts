/**
 * Analytics service - Circle owner dashboard metrics
 */
import { prisma } from "@/lib/prisma";

const SEVEN_DAYS_AGO = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

export interface CircleAnalytics {
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
    createdAt: Date;
  }>;
  engagementOverTime: Array<{ date: string; pins: number; votes: number; comments: number }>;
  circleHealthScore: number;
}

export async function getCircleAnalytics(circleId: string): Promise<CircleAnalytics> {
  const circle = await prisma.circle.findUnique({
    where: { id: circleId },
    include: {
      _count: { select: { memberships: true, pins: true } },
    },
  });

  if (!circle) throw new Error("Circle not found");

  const totalMembers = circle._count.memberships;
  const totalPins = circle._count.pins;

  const [activeMembers, pinsData, engagementOverTime] = await Promise.all([
    prisma.membership.count({
      where: {
        circleId,
        lastActiveAt: { gte: SEVEN_DAYS_AGO },
      },
    }),
    prisma.pin.findMany({
      where: { circleId },
      include: {
        _count: { select: { votes: true, comments: true } },
      },
    }),
    getEngagementOverTime(circleId),
  ]);

  const totalVotes = pinsData.reduce((sum, p) => sum + p._count.votes, 0);
  const totalComments = pinsData.reduce((sum, p) => sum + p._count.comments, 0);

  const engagementRate =
    totalMembers > 0 ? (totalVotes + totalComments) / totalMembers : 0;

  const topPins = pinsData
    .sort((a, b) => {
      const scoreA = a._count.votes * 2 + a._count.comments * 1.5;
      const scoreB = b._count.votes * 2 + b._count.comments * 1.5;
      return scoreB - scoreA;
    })
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      title: p.title,
      imageUrl: p.imageUrl,
      voteCount: p._count.votes,
      commentCount: p._count.comments,
      createdAt: p.createdAt,
    }));

  const circleHealthScore = calculateCircleHealthScore({
    totalMembers,
    activeMembers: activeMembers,
    totalPins,
    engagementRate,
  });

  return {
    totalMembers,
    activeMembersLast7Days: activeMembers,
    totalPins,
    totalComments,
    totalVotes,
    engagementRate: Math.round(engagementRate * 100) / 100,
    topPins,
    engagementOverTime,
    circleHealthScore,
  };
}

async function getEngagementOverTime(
  circleId: string
): Promise<Array<{ date: string; pins: number; votes: number; comments: number }>> {
  const pins = await prisma.pin.findMany({
    where: { circleId },
    include: {
      _count: { select: { votes: true, comments: true } },
    },
  });

  const dayMap: Record<
    string,
    { pins: number; votes: number; comments: number }
  > = {};

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    dayMap[key] = { pins: 0, votes: 0, comments: 0 };
  }

  for (const pin of pins) {
    const key = pin.createdAt.toISOString().split("T")[0];
    if (dayMap[key]) {
      dayMap[key].pins += 1;
      dayMap[key].votes += pin._count.votes;
      dayMap[key].comments += pin._count.comments;
    }
  }

  return Object.entries(dayMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, data]) => ({ date, ...data }));
}

function calculateCircleHealthScore(params: {
  totalMembers: number;
  activeMembers: number;
  totalPins: number;
  engagementRate: number;
}): number {
  const { totalMembers, activeMembers, totalPins, engagementRate } = params;

  if (totalMembers === 0) return 0;

  const activityRatio = totalMembers > 0 ? activeMembers / totalMembers : 0;
  const contentScore = Math.min(totalPins / 10, 1);
  const engagementScore = Math.min(engagementRate / 5, 1);

  const score =
    activityRatio * 40 + contentScore * 30 + engagementScore * 30;
  return Math.round(Math.min(score, 100));
}
