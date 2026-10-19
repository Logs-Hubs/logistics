import "server-only";
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Capability A di product/container-trucking-v1.md ("AI order intake"), prima implementazione:
// il dispatcher incolla il testo di un'email/ordine ricevuto, Claude lo struttura nei campi di
// NuovoOrdineInput e segnala quali campi non è riuscito a trovare con sicurezza — non li inventa.
// L'ordine non viene mai creato direttamente da qui: il dispatcher vede sempre i campi pre-compilati
// nel form esistente e conferma lui, stesso principio del resto del modulo ("Movr suggerisce, la
// persona conferma", vedi capability D).

const TERMINALI_PER_PORTO: Record<string, string[]> = {
  genova: ["PSA Genova Prà", "SECH Sampierdarena", "Messina Terminal"],
  "savona-vado": ["APM Terminals Vado", "Reefer Terminal Vado"],
  "la-spezia": ["LSCT", "Terminal del Golfo"],
};

const SCHEMA_ORDINE = {
  name: "estrai_ordine_container",
  description: "Struttura i dati di un ordine di trasporto container a partire dal testo libero di un'email o di un documento.",
  input_schema: {
    type: "object" as const,
    properties: {
      cliente: { type: "string", description: "Nome del cliente/committente dell'ordine" },
      containerId: { type: "string", description: "Codice container, es. MSCU1234567. Stringa vuota se non presente nel testo." },
      tipoContainer: {
        type: "string",
        enum: ["20' dry", "40' dry", "40' HC", "20' reefer", "40' reefer"],
        description: "Tipo e dimensione del container. Se reefer è menzionato nel testo, scegli una delle opzioni reefer.",
      },
      porto: { type: "string", enum: ["genova", "savona-vado", "la-spezia"], description: "Porto di riferimento dell'ordine" },
      terminal: { type: "string", description: "Nome del terminal, se menzionato nel testo; altrimenti stringa vuota." },
      tipo: { type: "string", enum: ["import", "export"] },
      richiedeReefer: { type: "boolean" },
      richiedeAdr: { type: "boolean", description: "true se il testo menziona merce pericolosa/ADR" },
      ultimoFreeDay: { type: "string", description: "Last free day in formato ISO YYYY-MM-DD, stringa vuota se non presente nel testo." },
      tariffaConcordata: { type: ["number", "null"], description: "Tariffa in EUR se esplicitamente indicata nel testo, altrimenti null." },
      incerti: {
        type: "array",
        items: { type: "string" },
        description:
          "Elenco dei NOMI dei campi sopra che non erano presenti nel testo o che hai dovuto indovinare/assumere per compilare lo schema (es. porto scelto per default). Vuoto se tutto era esplicito nel testo.",
      },
    },
    required: ["cliente", "containerId", "tipoContainer", "porto", "terminal", "tipo", "richiedeReefer", "richiedeAdr", "ultimoFreeDay", "tariffaConcordata", "incerti"],
  },
};

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { errore: "Estrazione AI non configurata: manca ANTHROPIC_API_KEY nelle Environment Variables." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const testo = typeof body?.testo === "string" ? body.testo.trim() : "";
  if (!testo) {
    return NextResponse.json({ errore: "Incolla il testo dell'ordine prima di estrarre." }, { status: 400 });
  }
  if (testo.length > 20000) {
    return NextResponse.json({ errore: "Testo troppo lungo (max 20.000 caratteri)." }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  let risposta;
  try {
    risposta = await client.messages.create({
      model: "claude-sonnet-5-5",
      max_tokens: 1024,
      system:
        "Sei un assistente che estrae dati strutturati da email/documenti di trasporto container per un'azienda di autotrasporto italiana. Oggi è " +
        new Date().toISOString().slice(0, 10) +
        ". Usa solo informazioni presenti nel testo: se un dato non c'è, lascialo vuoto/null e aggiungilo a 'incerti'. Non inventare container ID, date o tariffe.",
      tools: [SCHEMA_ORDINE],
      tool_choice: { type: "tool", name: "estrai_ordine_container" },
      messages: [{ role: "user", content: testo }],
    });
  } catch {
    return NextResponse.json({ errore: "Estrazione AI non riuscita, compila il form a mano." }, { status: 502 });
  }

  const toolUse = risposta.content.find((blocco) => blocco.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    return NextResponse.json({ errore: "Estrazione AI non riuscita, compila il form a mano." }, { status: 502 });
  }

  const campi = toolUse.input as Record<string, unknown>;

  // Il terminal è testo libero lato modello: se non combacia con nessuno di quelli noti per il
  // porto estratto, meglio azzerarlo (il form sceglie il primo valido) e segnalarlo come incerto
  // piuttosto che mostrare un'opzione che la select non ha.
  const terminaliValidi = TERMINALI_PER_PORTO[String(campi.porto)] ?? [];
  const terminalEstratto = typeof campi.terminal === "string" ? campi.terminal : "";
  const incerti = Array.isArray(campi.incerti) ? [...campi.incerti] : [];
  if (!terminaliValidi.includes(terminalEstratto)) {
    campi.terminal = "";
    if (!incerti.includes("terminal")) incerti.push("terminal");
  }

  return NextResponse.json({ campi: { ...campi, incerti } });
}
