/**
 * Circle service - CRUD, membership, and recommendation engine
 */
import { prisma } from "@/lib/prisma";
import { slugify, getPagination } from "@/lib/utils";

export interface CreateCircleInput {
  name: string;
  description?: string;
  categoryId: string;
  imageUrl?: string;
  ownerId: string;
}

export interface CircleFilters {
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function createCircle(input: CreateCircleInput) {
  const baseSlug = slugify(input.name);
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.circle.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  return prisma.circle.create({
    data: {
      name: input.name,
      slug,
      description: input.description,
      imageUrl: input.imageUrl,
      categoryId: input.categoryId,
      ownerId: input.ownerId,
    },
    include: {
      category: true,
      owner: { select: { id: true, username: true, avatar: true } },
      _count: { select: { memberships: true, pins: true } },
    },
  });
}

export async function getCircles(filters: CircleFilters = {}) {
  const { skip, take } = getPagination(filters.page || 1, filters.limit || 20);
  const where: Record<string, unknown> = {};

  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const [circles, total] = await Promise.all([
    prisma.circle.findMany({
      where,
      skip,
      take,
      include: {
        category: true,
        owner: { select: { id: true, username: true, avatar: true } },
        _count: { select: { memberships: true, pins: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.circle.count({ where }),
  ]);

  return { circles, total, page: filters.page || 1, limit: take };
}

export async function getCircleBySlug(slug: string) {
  return prisma.circle.findUnique({
    where: { slug },
    include: {
      category: true,
      owner: { select: { id: true, username: true, avatar: true } },
      _count: { select: { memberships: true, pins: true } },
    },
  });
}

export async function getCircleById(id: string) {
  return prisma.circle.findUnique({
    where: { id },
    include: {
      category: true,
      owner: { select: { id: true, username: true, avatar: true } },
      _count: { select: { memberships: true, pins: true } },
    },
  });
}

/** Resolve circle by slug or id (cuid) */
export async function getCircleBySlugOrId(param: string) {
  const isCuid = param.length === 25 && param.startsWith("c");
  return isCuid ? getCircleById(param) : getCircleBySlug(param);
}

export async function getJoinedCircles(userId: string) {
  return prisma.membership.findMany({
    where: { userId },
    include: {
      circle: {
        include: {
          category: true,
          _count: { select: { memberships: true, pins: true } },
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });
}

export async function joinCircle(userId: string, circleId: string) {
  const circle = await prisma.circle.findUnique({ where: { id: circleId } });
  if (!circle) throw new Error("Circle not found");

  const existing = await prisma.membership.findUnique({
    where: { userId_circleId: { userId, circleId } },
  });
  if (existing) throw new Error("Already a member");

  return prisma.membership.create({
    data: { userId, circleId },
    include: {
      circle: {
        include: {
          category: true,
          _count: { select: { memberships: true, pins: true } },
        },
      },
    },
  });
}

export async function leaveCircle(userId: string, circleId: string) {
  const membership = await prisma.membership.findUnique({
    where: { userId_circleId: { userId, circleId } },
    include: { circle: true },
  });

  if (!membership) throw new Error("Not a member of this circle");
  if (membership.circle.ownerId === userId) {
    throw new Error("Circle owner cannot leave. Transfer ownership first.");
  }

  return prisma.membership.delete({
    where: { userId_circleId: { userId, circleId } },
  });
}

export async function isMember(userId: string, circleId: string): Promise<boolean> {
  const membership = await prisma.membership.findUnique({
    where: { userId_circleId: { userId, circleId } },
  });
  return !!membership;
}

export async function isOwner(userId: string, circleId: string): Promise<boolean> {
  const circle = await prisma.circle.findUnique({
    where: { id: circleId },
  });
  return circle?.ownerId === userId;
}

/**
 * Circle Recommendation Engine
 * Suggests Circles based on:
 * - Categories of Circles user has joined
 * - Categories of Pins user has engaged with (votes, comments)
 * - Overlapping membership patterns
 */
export async function getCircleRecommendations(userId: string, limit: number = 5) {
  // Get user's joined circle IDs and their categories
  const userMemberships = await prisma.membership.findMany({
    where: { userId },
    include: { circle: { include: { category: true } } },
  });
  const joinedCircleIds = userMemberships.map((m) => m.circleId);
  const joinedCategoryIds = Array.from(new Set(userMemberships.map((m) => m.circle.categoryId)));

  // Get categories from pins user has voted on
  const votedPins = await prisma.vote.findMany({
    where: { userId },
    include: { pin: { include: { circle: true } } },
  });
  const votedCategoryIds = votedPins.map((v) => v.pin.circle.categoryId);

  // Get categories from pins user has commented on
  const commentedPins = await prisma.comment.findMany({
    where: { userId },
    include: { pin: { include: { circle: true } } },
  });
  const commentedCategoryIds = commentedPins.map((c) => c.pin.circle.categoryId);

  // Build category frequency map (weight: joins=3, votes=2, comments=1.5)
  const categoryScores: Record<string, number> = {};
  for (const cid of joinedCategoryIds) {
    categoryScores[cid] = (categoryScores[cid] || 0) + 3;
  }
  for (const cid of votedCategoryIds) {
    categoryScores[cid] = (categoryScores[cid] || 0) + 2;
  }
  for (const cid of commentedCategoryIds) {
    categoryScores[cid] = (categoryScores[cid] || 0) + 1.5;
  }

  // Get circles user has NOT joined, in preferred categories, ordered by relevance
  const preferredCategories = Object.entries(categoryScores)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);

  if (preferredCategories.length === 0) {
    // No engagement yet - recommend popular circles
    const popularCircles = await prisma.circle.findMany({
      where: { id: { notIn: joinedCircleIds } },
      include: {
        category: true,
        _count: { select: { memberships: true, pins: true } },
      },
      orderBy: { memberships: { _count: "desc" } },
      take: limit,
    });
    return popularCircles.map((c) => ({
      circle: c,
      explanation: "Popular circle you might enjoy",
    }));
  }

  const recommendedCircles = await prisma.circle.findMany({
    where: {
      id: { notIn: joinedCircleIds },
      categoryId: { in: preferredCategories },
    },
    include: {
      category: true,
      _count: { select: { memberships: true, pins: true } },
    },
    take: limit * 2, // Fetch extra for sorting
  });

  // Sort by category preference and member count
  const sorted = recommendedCircles
    .sort((a, b) => {
      const aScore = categoryScores[a.categoryId] || 0;
      const bScore = categoryScores[b.categoryId] || 0;
      if (bScore !== aScore) return bScore - aScore;
      return b._count.memberships - a._count.memberships;
    })
    .slice(0, limit);

  return sorted.map((circle) => ({
    circle,
    explanation: `Recommended because you engage with ${circle.category.name}`,
  }));
}
