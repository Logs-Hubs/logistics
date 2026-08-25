import { SPEDIZIONI } from "@/lib/data";
import { notFound } from "next/navigation";
import { SpedizioneDetailClient } from "./SpedizioneDetailClient";

export function generateStaticParams() {
  return SPEDIZIONI.map((s) => ({ id: s.id }));
}

export default async function SpedizionePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!SPEDIZIONI.some((s) => s.id === id)) notFound();

  return <SpedizioneDetailClient id={id} />;
}
