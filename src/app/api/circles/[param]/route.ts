/**
 * GET /api/circles/[param]
 * Get circle by slug or id
 */
import { NextRequest } from "next/server";
import { getCircleBySlugOrId } from "@/services/circle.service";
import { apiError, apiSuccess } from "@/lib/api-middleware";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ param: string }> }
) {
  const { param } = await params;
  const circle = await getCircleBySlugOrId(param);
  if (!circle) return apiError("Circle not found", 404);
  return apiSuccess(circle);
}
