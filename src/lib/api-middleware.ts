/**
 * API route middleware utilities
 * Handles auth extraction, validation, and error responses
 */
import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getTokenFromHeader } from "./auth";
import type { JwtPayload } from "./auth";

export interface AuthenticatedRequest extends NextRequest {
  user?: JwtPayload;
}

/**
 * Extract user from request - returns null if not authenticated
 */
export function getAuthUser(request: NextRequest): JwtPayload | null {
  const authHeader = request.headers.get("authorization");
  const token = getTokenFromHeader(authHeader) || request.cookies.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Require authentication - returns 401 if not authenticated
 */
export function requireAuth(request: NextRequest): JwtPayload | NextResponse {
  const user = getAuthUser(request);
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }
  return user;
}

/**
 * Standard API error response
 */
export function apiError(
  message: string,
  status: number = 400
): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Standard API success response
 */
export function apiSuccess<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(data, { status });
}
