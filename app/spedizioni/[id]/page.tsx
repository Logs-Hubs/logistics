import { SpedizioneDetailClient } from "./SpedizioneDetailClient";

export default async function SpedizionePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SpedizioneDetailClient id={id} />;
}
