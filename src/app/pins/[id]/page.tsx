import { PinDetailClient } from "./PinDetailClient";

export default function PinPage({ params }: { params: Promise<{ id: string }> }) {
  return <PinDetailClient params={params} />;
}
