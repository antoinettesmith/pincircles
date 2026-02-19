/**
 * POST /api/pins/[id]/vote - Upvote (protected)
 * DELETE /api/pins/[id]/vote - Remove vote (protected)
 */
import { NextRequest } from "next/server";
import { upvote, removeVote } from "@/services/engagement.service";
import { requireAuth } from "@/lib/api-middleware";
import { apiError, apiSuccess } from "@/lib/api-middleware";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  try {
    const result = await upvote(authResult.userId, id);
    return apiSuccess(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to vote";
    return apiError(message, 400);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  try {
    const result = await removeVote(authResult.userId, id);
    return apiSuccess(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to remove vote";
    return apiError(message, 400);
  }
}
