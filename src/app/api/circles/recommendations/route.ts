/**
 * GET /api/circles/recommendations
 * Get personalized Circle recommendations (protected)
 */
import { NextRequest } from "next/server";
import { getCircleRecommendations } from "@/services/circle.service";
import { requireAuth } from "@/lib/api-middleware";
import { apiSuccess } from "@/lib/api-middleware";

export async function GET(request: NextRequest) {
  const authResult = requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  const recommendations = await getCircleRecommendations(authResult.userId, limit);
  return apiSuccess(recommendations);
}
