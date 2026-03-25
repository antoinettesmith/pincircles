/**
 * GET /api/circles/[param]/discussion - Get general circle comments (not pin-specific)
 * POST /api/circles/[param]/discussion - Add circle comment (protected)
 */
import { NextRequest } from "next/server";
import { getCircleComments, createCircleComment, getCircleBySlugOrId } from "@/services/circle.service";
import { requireAuth } from "@/lib/api-middleware";
import { apiError, apiSuccess } from "@/lib/api-middleware";
import { z } from "zod";

const createSchema = z.object({
  content: z.string().min(1).max(2000),
  parentId: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ param: string }> }
) {
  const { param } = await params;
  const circle = await getCircleBySlugOrId(param);
  if (!circle) return apiError("Circle not found", 404);

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  const comments = await getCircleComments(circle.id, limit);
  return apiSuccess(comments);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ param: string }> }
) {
  const authResult = requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { param } = await params;
  const circle = await getCircleBySlugOrId(param);
  if (!circle) return apiError("Circle not found", 404);

  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message || "Invalid input", 400);
    }
    const comment = await createCircleComment({
      content: parsed.data.content,
      userId: authResult.userId,
      circleId: circle.id,
      parentId: parsed.data.parentId,
    });
    return apiSuccess(comment, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to add comment";
    return apiError(message, 400);
  }
}
