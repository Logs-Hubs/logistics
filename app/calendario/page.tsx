import { CalendarioClient } from "./CalendarioClient";
import { getSpedizioni, getTerminals, getVettori } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function CalendarioPage() {
  const [spedizioni, terminals, vettori] = await Promise.all([getSpedizioni(), getTerminals(), getVettori()]);
  return <CalendarioClient spedizioni={spedizioni} terminals={terminals} vettori={vettori} />;
}
