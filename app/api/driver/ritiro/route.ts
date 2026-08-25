import { NextRequest, NextResponse } from "next/server";
import { verificaDriverAuth } from "@/lib/driverAuth";
import { segnalaRitiro } from "@/app/actions";

export async function POST(request: NextRequest) {
  if (!verificaDriverAuth(request)) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const spedizioneId = body?.spedizioneId;
  const ora = body?.ora;
  if (typeof spedizioneId !== "string" || typeof ora !== "string") {
    return NextResponse.json({ error: "Body non valido: attesi spedizioneId e ora" }, { status: 400 });
  }

  await segnalaRitiro(spedizioneId, ora);
  return NextResponse.json({ ok: true });
}
