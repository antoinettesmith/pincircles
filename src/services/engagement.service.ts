/**
 * Engagement service - votes and comments
 */
import { prisma } from "@/lib/prisma";
import { filterProfanity } from "@/lib/profanity";

export async function upvote(userId: string, pinId: string) {
  const existing = await prisma.vote.findUnique({
    where: { userId_pinId: { userId, pinId } },
  });
  if (existing) throw new Error("Already voted");

  const pin = await prisma.pin.findUnique({ where: { id: pinId } });
  if (!pin) throw new Error("Pin not found");

  const [vote] = await prisma.$transaction([
    prisma.vote.create({ data: { userId, pinId } }),
    prisma.membership.updateMany({
      where: { userId, circleId: pin.circleId },
      data: { lastActiveAt: new Date() },
    }),
  ]);

  const count = await prisma.vote.count({ where: { pinId } });
  return { vote, voteCount: count };
}

export async function removeVote(userId: string, pinId: string) {
  const existing = await prisma.vote.findUnique({
    where: { userId_pinId: { userId, pinId } },
  });
  if (!existing) throw new Error("No vote to remove");

  await prisma.vote.delete({
    where: { userId_pinId: { userId, pinId } },
  });

  const count = await prisma.vote.count({ where: { pinId } });
  return { voteCount: count };
}

export interface CreateCommentInput {
  content: string;
  userId: string;
  pinId: string;
  parentId?: string;
}

export async function createComment(input: CreateCommentInput) {
  const filteredContent = filterProfanity(input.content);

  const pin = await prisma.pin.findUnique({ where: { id: input.pinId } });
  if (!pin) throw new Error("Pin not found");

  const [comment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        content: filteredContent,
        userId: input.userId,
        pinId: input.pinId,
        parentId: input.parentId,
      },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
      },
    }),
    prisma.membership.updateMany({
      where: { userId: input.userId, circleId: pin.circleId },
      data: { lastActiveAt: new Date() },
    }),
  ]);

  return comment;
}

export async function getComments(pinId: string) {
  return prisma.comment.findMany({
    where: { pinId, parentId: null },
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
  });
}
