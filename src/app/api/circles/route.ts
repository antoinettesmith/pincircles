/**
 * GET /api/circles - List circles (with filters)
 * POST /api/circles - Create circle (protected)
 */
import { NextRequest } from "next/server";
import { getCircles, createCircle } from "@/services/circle.service";
import { requireAuth } from "@/lib/api-middleware";
import { apiError, apiSuccess } from "@/lib/api-middleware";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  categoryId: z.string().min(1),
  imageUrl: z.string().url().optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId") || undefined;
  const search = searchParams.get("search") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const result = await getCircles({ categoryId, search, page, limit });
  return apiSuccess(result);
}

export async function POST(request: NextRequest) {
  const authResult = requireAuth(request);
  if (authResult instanceof Response) return authResult;

  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message || "Invalid input", 400);
    }
    const circle = await createCircle({
      ...parsed.data,
      ownerId: authResult.userId,
    });
    return apiSuccess(circle, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create circle";
    return apiError(message, 400);
  }
}
