/**
 * POST /api/auth/register
 * Register new user
 */
import { NextRequest } from "next/server";
import { registerUser } from "@/services/auth.service";
import { apiError, apiSuccess } from "@/lib/api-middleware";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  username: z.string().min(2).max(30).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message || "Invalid input", 400);
    }
    const result = await registerUser(parsed.data);
    return apiSuccess(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Registration failed";
    return apiError(message, 400);
  }
}
