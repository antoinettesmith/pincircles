import { CircleDetailClient } from "./CircleDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title: `${slug} - PinCircles`,
  };
}

export default function CirclePage({ params }: { params: Promise<{ slug: string }> }) {
  return <CircleDetailClient params={params} />;
}
