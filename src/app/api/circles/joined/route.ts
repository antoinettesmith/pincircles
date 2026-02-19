/**
 * GET /api/circles/joined
 * Get circles user has joined (protected)
 */
import { NextRequest } from "next/server";
import { getJoinedCircles } from "@/services/circle.service";
import { requireAuth } from "@/lib/api-middleware";
import { apiSuccess } from "@/lib/api-middleware";

export async function GET(request: NextRequest) {
  const authResult = requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const memberships = await getJoinedCircles(authResult.userId);
  return apiSuccess(memberships);
}
