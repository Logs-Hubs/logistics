import { DriverClient } from "./DriverClient";
import { getSpedizioni, getTerminals, getVettori } from "@/lib/queries";
import { terminalNome, vettoreById } from "@/lib/data";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DriverPage() {
  const [spedizioni, terminals, vettori] = await Promise.all([getSpedizioni(), getTerminals(), getVettori()]);
  const spedizione = spedizioni.find((s) => s.id === "SP-2464"); // confermata, terminal PSA Prà
  const vettore = spedizione ? vettoreById(vettori, spedizione.vettoreId) : undefined;
  if (!spedizione || !vettore) notFound();

  return <DriverClient spedizione={spedizione} vettore={vettore} terminalNome={terminalNome(terminals, spedizione.terminalId)} />;
}
