/**
 * Utility functions for PinCircles
 */

/**
 * Generate URL-friendly slug from string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Pagination helper - calculate skip/take for Prisma
 */
export function getPagination(page: number, limit: number) {
  const take = Math.min(Math.max(limit, 1), 50);
  const skip = Math.max((page - 1) * take, 0);
  return { skip, take };
}

/**
 * Trending score formula:
 * (votes * 2 + comments * 1.5) / (hours_since_post + 2)
 */
export function calculateTrendingScore(
  votes: number,
  comments: number,
  createdAt: Date
): number {
  const hoursSincePost =
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
  const engagementScore = votes * 2 + comments * 1.5;
  return engagementScore / (hoursSincePost + 2);
}
