/**
 * Pin service - CRUD, feed, ranking, and engagement
 */
import { prisma } from "@/lib/prisma";
import { getPagination, calculateTrendingScore } from "@/lib/utils";

export type PinSortOption = "new" | "top" | "commented" | "trending";

export interface CreatePinInput {
  title: string;
  description?: string;
  imageUrl: string;
  circleId: string;
  authorId: string;
}

export interface FeedFilters {
  circleId?: string;
  sort?: PinSortOption;
  page?: number;
  limit?: number;
}

export async function createPin(input: CreatePinInput) {
  return prisma.pin.create({
    data: input,
    include: {
      circle: { include: { category: true } },
      author: { select: { id: true, username: true, avatar: true } },
      _count: { select: { votes: true, comments: true } },
    },
  });
}

export async function getPinById(id: string) {
  return prisma.pin.findUnique({
    where: { id },
    include: {
      circle: { include: { category: true } },
      author: { select: { id: true, username: true, avatar: true } },
      _count: { select: { votes: true, comments: true } },
      votes: { select: { userId: true } },
      comments: {
        where: { parentId: null },
        include: {
          user: { select: { id: true, username: true, avatar: true } },
          replies: {
            include: {
              user: { select: { id: true, username: true, avatar: true } },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function getFeed(filters: FeedFilters = {}, userId?: string) {
  const { skip, take } = getPagination(filters.page || 1, filters.limit || 20);
  const where: Record<string, unknown> = {};

  if (filters.circleId) where.circleId = filters.circleId;

  const sort = filters.sort || "new";

  if (sort === "new") {
    const [pins, total] = await Promise.all([
      prisma.pin.findMany({
        where,
        skip,
        take,
        include: {
          circle: { include: { category: true } },
          author: { select: { id: true, username: true, avatar: true } },
          _count: { select: { votes: true, comments: true } },
          votes: userId ? { where: { userId }, select: { userId: true } } : false,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.pin.count({ where }),
    ]);

    const pinsWithUserVote = pins.map((p) => ({
      ...p,
      userHasVoted: userId
        ? (p as { votes?: { userId: string }[] }).votes?.some((v) => v.userId === userId)
        : false,
      votes: undefined,
    }));

    return {
      pins: pinsWithUserVote.map(({ votes, ...rest }) => rest),
      total,
      page: filters.page || 1,
      limit: take,
    };
  }

  if (sort === "top" || sort === "commented" || sort === "trending") {
    const pins = await prisma.pin.findMany({
      where,
      include: {
        circle: { include: { category: true } },
        author: { select: { id: true, username: true, avatar: true } },
        _count: { select: { votes: true, comments: true } },
        votes: userId ? { where: { userId }, select: { userId: true } } : false,
      },
    });

    const total = pins.length;

    let sorted: typeof pins;
    if (sort === "top") {
      sorted = pins.sort((a, b) => b._count.votes - a._count.votes);
    } else if (sort === "commented") {
      sorted = pins.sort((a, b) => b._count.comments - a._count.comments);
    } else {
      sorted = pins.sort((a, b) => {
        const scoreA = calculateTrendingScore(
          a._count.votes,
          a._count.comments,
          a.createdAt
        );
        const scoreB = calculateTrendingScore(
          b._count.votes,
          b._count.comments,
          b.createdAt
        );
        return scoreB - scoreA;
      });
    }

    const paginated = sorted.slice(skip, skip + take);
    const result = paginated.map((p) => {
      const { votes, ...rest } = p;
      const voteList = Array.isArray(votes) ? votes : [];
      return {
        ...rest,
        userHasVoted: userId ? voteList.some((v: { userId: string }) => v.userId === userId) : false,
      };
    });

    return {
      pins: result,
      total,
      page: filters.page || 1,
      limit: take,
    };
  }

  return { pins: [], total: 0, page: 1, limit: take };
}

export async function getUserVote(userId: string, pinId: string) {
  return prisma.vote.findUnique({
    where: { userId_pinId: { userId, pinId } },
  });
}
