/**
 * Authentication service - handles user registration and login
 */
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, generateToken } from "@/lib/auth";
import type { User } from "@prisma/client";

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  user: Omit<User, "password">;
  token: string;
}

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email: input.email }, { username: input.username }],
    },
  });

  if (existing) {
    if (existing.email === input.email) {
      throw new Error("Email already registered");
    }
    throw new Error("Username already taken");
  }

  const hashedPassword = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      username: input.username,
      password: hashedPassword,
    },
  });

  const { password: _, ...userWithoutPassword } = user;
  const token = generateToken(user);
  return { user: userWithoutPassword, token };
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const valid = await verifyPassword(input.password, user.password);
  if (!valid) {
    throw new Error("Invalid email or password");
  }

  const { password: _, ...userWithoutPassword } = user;
  const token = generateToken(user);
  return { user: userWithoutPassword, token };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      avatar: true,
      role: true,
      createdAt: true,
    },
  });
  return user;
}
