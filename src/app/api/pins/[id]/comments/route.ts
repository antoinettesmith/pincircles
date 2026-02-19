/**
 * GET /api/pins/[id]/comments - Get comments
 * POST /api/pins/[id]/comments - Add comment (protected)
 */
import { NextRequest } from "next/server";
import { createComment, getComments } from "@/services/engagement.service";
import { requireAuth } from "@/lib/api-middleware";
import { apiError, apiSuccess } from "@/lib/api-middleware";
import { z } from "zod";

const createSchema = z.object({
  content: z.string().min(1).max(2000),
  parentId: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const comments = await getComments(id);
  return apiSuccess(comments);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { id } = await params;
  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message || "Invalid input", 400);
    }
    const comment = await createComment({
      content: parsed.data.content,
      userId: authResult.userId,
      pinId: id,
      parentId: parsed.data.parentId,
    });
    return apiSuccess(comment, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to add comment";
    return apiError(message, 400);
  }
}
