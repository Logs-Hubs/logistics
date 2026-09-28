import { OrdineDetailClient } from "./OrdineDetailClient";

export default async function OrdineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrdineDetailClient id={id} />;
}
