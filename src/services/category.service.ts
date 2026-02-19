/**
 * Category service - list categories for Circle creation
 */
import { prisma } from "@/lib/prisma";

export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { circles: true } },
    },
  });
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: {
      _count: { select: { circles: true } },
    },
  });
}
