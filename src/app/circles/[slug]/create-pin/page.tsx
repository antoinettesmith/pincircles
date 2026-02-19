"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/providers/AuthProvider";
import { apiFetch, apiFetchFormData } from "@/lib/api-client";
import toast from "react-hot-toast";

interface Circle {
  id: string;
  name: string;
  slug: string;
}

export default function CreatePinPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [circle, setCircle] = useState<Circle | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;
    apiFetch<Circle>(`/circles/${slug}`)
      .then(setCircle)
      .catch(() => setCircle(null));
  }, [slug]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !circle || !imageFile) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      const { url } = await apiFetchFormData<{ url: string }>("/upload", formData);

      await apiFetch("/pins", {
        method: "POST",
        body: {
          title,
          description: description || undefined,
          imageUrl: url,
          circleId: circle.id,
        },
      });
      toast.success("Pin created!");
      router.push(`/circles/${circle.slug}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create pin");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-circle-accent">Please log in to create a pin.</p>
        <Link href="/login" className="text-circle-primary font-medium mt-2 inline-block">
          Log in
        </Link>
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-64 bg-circle-surface rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link href={`/circles/${circle.slug}`} className="text-circle-primary font-medium mb-4 inline-block">
        ← Back to {circle.name}
      </Link>
      <h1 className="text-3xl font-bold mb-6">Create a Pin</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-2xl shadow border border-circle-border">
        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="w-full"
          />
          {imagePreview && (
            <div className="relative mt-2 aspect-[4/5] max-w-xs rounded-lg overflow-hidden">
              <Image src={imagePreview} alt="Preview" fill className="object-cover" />
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-circle-border focus:ring-2 focus:ring-circle-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-circle-border focus:ring-2 focus:ring-circle-primary"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-circle-primary text-white font-medium hover:bg-circle-secondary disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Pin"}
        </button>
      </form>
    </div>
  );
}
