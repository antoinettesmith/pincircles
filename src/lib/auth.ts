/**
 * JWT-based authentication utilities
 * Handles token generation, verification, and password hashing
 */
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { User } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "pincircles-dev-secret-change-in-production";
const JWT_EXPIRES_IN = "7d";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Hash password using bcrypt (10 salt rounds)
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT for authenticated user
 */
export function generateToken(user: Pick<User, "id" | "email" | "role">): string {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role } as JwtPayload,
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Extract Bearer token from Authorization header
 */
export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}
