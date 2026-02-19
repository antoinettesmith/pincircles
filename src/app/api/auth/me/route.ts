/**
 * GET /api/auth/me
 * Get current user (protected)
 */
import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/api-middleware";
import { getUserById } from "@/services/auth.service";
import { apiError, apiSuccess } from "@/lib/api-middleware";

export async function GET(request: NextRequest) {
  const authResult = requireAuth(request);
  if (authResult instanceof Response) return authResult;

  const user = await getUserById(authResult.userId);
  if (!user) return apiError("User not found", 404);
  return apiSuccess(user);
}
