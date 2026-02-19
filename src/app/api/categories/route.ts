/**
 * GET /api/categories
 * List all categories
 */
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getAllCategories } from "@/services/category.service";
import { apiSuccess } from "@/lib/api-middleware";

export async function GET() {
  const categories = await getAllCategories();
  return apiSuccess(categories);
}
