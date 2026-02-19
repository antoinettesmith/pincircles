/**
 * POST /api/circles/[param]/join
 * Join a circle (protected)
 */
import { NextRequest } from "next/server";
import { joinCircle, getCircleBySlugOrId } from "@/services/circle.service";
import { requireAuth } from "@/lib/api-middleware";
import { apiError, apiSuccess } from "@/lib/api-middleware";

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
    const membership = await joinCircle(authResult.userId, circle.id);
    return apiSuccess(membership, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to join circle";
    return apiError(message, 400);
  }
}
