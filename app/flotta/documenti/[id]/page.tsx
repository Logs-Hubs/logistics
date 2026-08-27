import { LavoroDetailClient } from "./LavoroDetailClient";

export default async function LavoroPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LavoroDetailClient id={id} />;
}
