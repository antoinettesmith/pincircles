/**
 * GET /api/pins/[id]
 * Get single pin with comments
 */
import { NextRequest } from "next/server";
import { getPinById } from "@/services/pin.service";
import { getAuthUser } from "@/lib/api-middleware";
import { apiError, apiSuccess } from "@/lib/api-middleware";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = getAuthUser(request);

  const pin = await getPinById(id);
  if (!pin) return apiError("Pin not found", 404);

  let userHasVoted = false;
  if (user) {
    const vote = await prisma.vote.findUnique({
      where: { userId_pinId: { userId: user.userId, pinId: id } },
    });
    userHasVoted = !!vote;
  }

  const { votes, ...pinWithoutVotes } = pin;
  return apiSuccess({
    ...pinWithoutVotes,
    userHasVoted,
  });
}
