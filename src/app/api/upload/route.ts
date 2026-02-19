/**
 * POST /api/upload
 * Upload image to Cloudinary (protected)
 */
import { NextRequest } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { requireAuth } from "@/lib/api-middleware";
import { apiError, apiSuccess } from "@/lib/api-middleware";

export async function POST(request: NextRequest) {
  const authResult = requireAuth(request);
  if (authResult instanceof Response) return authResult;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return apiError("No file provided", 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadImage(buffer, { folder: "pincircles" });
    return apiSuccess({ url: result.secureUrl, publicId: result.publicId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return apiError(message, 500);
  }
}
