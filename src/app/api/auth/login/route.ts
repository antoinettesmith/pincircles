/**
 * POST /api/auth/login
 * Login user, returns JWT
 */
import { NextRequest } from "next/server";
import { loginUser } from "@/services/auth.service";
import { apiError, apiSuccess } from "@/lib/api-middleware";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message || "Invalid input", 400);
    }
    const result = await loginUser(parsed.data);
    return apiSuccess(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Login failed";
    return apiError(message, 401);
  }
}
