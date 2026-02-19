/**
 * Cloudinary image upload service
 * Abstraction layer for image storage - can be swapped for mock in tests
 */
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  publicId: string;
  secureUrl: string;
}

/**
 * Upload image to Cloudinary
 * Returns secure URL for storage in database
 */
export async function uploadImage(
  file: Buffer | string,
  options?: { folder?: string }
): Promise<UploadResult> {
  // If Cloudinary is not configured, use placeholder for development
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return {
      url: "https://placehold.co/600x400/ef4444/white?text=Pin+Image",
      publicId: "placeholder",
      secureUrl: "https://placehold.co/600x400/ef4444/white?text=Pin+Image",
    };
  }

  const uploadOptions: Record<string, unknown> = {
    folder: options?.folder || "pincircles",
  };

  const result = await cloudinary.uploader.upload(
    typeof file === "string" ? file : `data:image/jpeg;base64,${file.toString("base64")}`,
    uploadOptions
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
    secureUrl: result.secure_url,
  };
}

/**
 * Delete image from Cloudinary by public ID
 */
export async function deleteImage(publicId: string): Promise<void> {
  if (!process.env.CLOUDINARY_CLOUD_NAME || publicId === "placeholder") return;
  await cloudinary.uploader.destroy(publicId);
}
