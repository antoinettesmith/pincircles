/**
 * GET /api/pins - Feed with sorting (new, top, commented, trending)
 * POST /api/pins - Create pin (protected, must be circle member)
 */
import { NextRequest } from "next/server";
import { getFeed, createPin } from "@/services/pin.service";
import { isMember } from "@/services/circle.service";
import { requireAuth, getAuthUser } from "@/lib/api-middleware";
import { apiError, apiSuccess } from "@/lib/api-middleware";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  imageUrl: z.string().url(),
  circleId: z.string().min(1),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const circleId = searchParams.get("circleId") || undefined;
  const sort = (searchParams.get("sort") || "new") as "new" | "top" | "commented" | "trending";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const user = getAuthUser(request);
  const result = await getFeed(
    { circleId, sort, page, limit },
    user?.userId
  );
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

    const member = await isMember(authResult.userId, parsed.data.circleId);
    if (!member) {
      return apiError("You must join the circle before posting", 403);
    }

    const pin = await createPin({
      ...parsed.data,
      authorId: authResult.userId,
    });
    return apiSuccess(pin, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create pin";
    return apiError(message, 400);
  }
}
