import { notFound } from "next/navigation";
import { SpotDetailScreen } from "@/components/spots/spot-detail-screen";
import { SPOTS } from "@/components/spots/data";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const spot = SPOTS.find((s) => s.id === id);
  if (!spot) notFound();

  return <SpotDetailScreen spot={spot} />;
}
