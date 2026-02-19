/**
 * POST /api/circles/[param]/leave
 * Leave a circle (protected)
 */
import { NextRequest } from "next/server";
import { leaveCircle, getCircleBySlugOrId } from "@/services/circle.service";
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
    await leaveCircle(authResult.userId, circle.id);
    return apiSuccess({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to leave circle";
    return apiError(message, 400);
  }
}
