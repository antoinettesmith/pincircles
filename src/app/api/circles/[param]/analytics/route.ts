/**
 * GET /api/circles/[param]/analytics
 * Get analytics for circle owners (protected)
 */
import { NextRequest } from "next/server";
import { getCircleAnalytics } from "@/services/analytics.service";
import { isOwner, getCircleBySlugOrId } from "@/services/circle.service";
import { requireAuth } from "@/lib/api-middleware";
import { apiError, apiSuccess } from "@/lib/api-middleware";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ param: string }> }
) {
  const authResult = requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { param } = await params;
  const circle = await getCircleBySlugOrId(param);
  if (!circle) return apiError("Circle not found", 404);

  const isCircleOwner = await isOwner(authResult.userId, circle.id);
  if (!isCircleOwner) {
    return apiError("Only circle owners can view analytics", 403);
  }

  try {
    const analytics = await getCircleAnalytics(circle.id);
    return apiSuccess(analytics);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch analytics";
    return apiError(message, 404);
  }
}
