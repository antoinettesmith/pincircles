/**
 * GET /api/circles/[param]/comments
 * Get recent comments from pins in a circle
 */
import { NextRequest } from "next/server";
import { getCircleRecentComments, getCircleBySlugOrId } from "@/services/circle.service";
import { apiError, apiSuccess } from "@/lib/api-middleware";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ param: string }> }
) {
  const { param } = await params;
  const circle = await getCircleBySlugOrId(param);
  if (!circle) return apiError("Circle not found", 404);

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const comments = await getCircleRecentComments(circle.id, limit);
  return apiSuccess(comments);
}
