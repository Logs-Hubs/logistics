import { NextRequest, NextResponse } from "next/server";
import { verificaDriverAuth } from "@/lib/driverAuth";
import { getSpedizioni, getTerminals } from "@/lib/queries";

export async function GET(request: NextRequest) {
  if (!verificaDriverAuth(request)) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const vettoreId = request.nextUrl.searchParams.get("vettoreId");
  if (!vettoreId) {
    return NextResponse.json({ error: "Parametro vettoreId mancante" }, { status: 400 });
  }

  const [spedizioni, terminals] = await Promise.all([getSpedizioni(), getTerminals()]);
  const proprie = spedizioni
    .filter((s) => s.vettoreId === vettoreId)
    .map((s) => ({
      ...s,
      terminalNome: terminals.find((t) => t.id === s.terminalId)?.nome ?? s.terminalId,
    }));

  return NextResponse.json({ spedizioni: proprie });
}
