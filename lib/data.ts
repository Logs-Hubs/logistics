export type StatoAppuntamento = "confermato" | "da_pianificare" | "in_ritardo";

export type Terminal = {
  id: string;
  nome: string;
  breve: string;
};

export type Vettore = {
  id: string;
  nome: string;
  autista: string;
  telefono: string;
  targa: string;
};

export type FaseOperativa = "in_attesa_ritiro" | "ritirato" | "rientro_vuoto";

export type Spedizione = {
  id: string;
  cliente: string;
  containerId: string;
  terminalId: string;
  stato: StatoAppuntamento;
  vettoreId: string;
  scadenzaDemurrage: string; // ISO date
  oraAppuntamento?: string; // HH:mm se confermato
  dataAppuntamento?: string; // giorno se confermato, YYYY-MM-DD
  tipo: "import" | "export";
  merce: string;
  // Tracking del mezzo oggi fuori dal Port Community System: il gate reale segnala solo il ritiro
  // del container pieno, il rientro del vuoto resta un buco gestito a telefono.
  faseOperativa?: FaseOperativa; // assente = ancora in attesa del ritiro
  oraRitiro?: string; // HH:mm, valorizzato quando il driver segnala il ritiro dal terminal
  oraRientroVuoto?: string; // HH:mm, valorizzato quando il driver segnala il rientro del vuoto
};

export type SlotStato = "libero" | "quasi_pieno" | "pieno";

export type Slot = {
  ora: string;
  terminalId: string;
  stato: SlotStato;
  spedizioneId?: string;
};

const orari = ["07:00", "08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generaSlot(giorno: string, spedizioni: Spedizione[], terminals: Terminal[]): Slot[] {
  const slots: Slot[] = [];
  let seed = giorno.split("-").reduce((a, b) => a + parseInt(b, 10), 0);
  terminals.forEach((t, ti) => {
    orari.forEach((ora, oi) => {
      seed += 1;
      const r = pseudoRandom(seed + ti * 13 + oi * 7);
      let stato: SlotStato = "libero";
      if (r > 0.75) stato = "pieno";
      else if (r > 0.5) stato = "quasi_pieno";
      // aggancia gli slot confermati della demo
      const spedizioneAggangiata = spedizioni.find(
        (s) => s.terminalId === t.id && s.dataAppuntamento === giorno && s.oraAppuntamento === ora
      );
      if (spedizioneAggangiata) stato = "pieno";
      slots.push({ ora, terminalId: t.id, stato, spedizioneId: spedizioneAggangiata?.id });
    });
  });
  return slots;
}

export const ORARI_SLOT = orari;

export function terminalNome(terminals: Terminal[], id: string): string {
  return terminals.find((t) => t.id === id)?.nome ?? id;
}

export function vettoreById(vettori: Vettore[], id: string): Vettore | undefined {
  return vettori.find((v) => v.id === id);
}

const OGGI_DEMO = new Date("2026-08-25T00:00:00");

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr + "T00:00:00");
  return Math.round((target.getTime() - OGGI_DEMO.getTime()) / (1000 * 60 * 60 * 24));
}

export type EventoTimeline = {
  step: string;
  label: string;
  dataOra: string;
  completato: boolean;
  attuale?: boolean;
  note?: string;
};

export function timelineSpedizione(s: Spedizione): EventoTimeline[] {
  const ritirato = s.faseOperativa === "ritirato" || s.faseOperativa === "rientro_vuoto";
  const vuotoRientrato = s.faseOperativa === "rientro_vuoto";
  return [
    { step: "arrivo_nave", label: "Arrivo nave in porto", dataOra: "24/08/2026 · 06:40", completato: true },
    { step: "scarico", label: "Scarico container", dataOra: "24/08/2026 · 11:20", completato: true },
    { step: "sdoganamento", label: "Sdoganamento", dataOra: "25/08/2026 · 09:05", completato: true },
    {
      step: "appuntamento_gate",
      label: "Appuntamento gate terminal",
      dataOra: s.oraAppuntamento ? `${s.dataAppuntamento} · ${s.oraAppuntamento}` : "Da pianificare",
      completato: s.stato === "confermato",
      attuale: s.stato !== "confermato",
      note: s.stato === "in_ritardo" ? "Nessuno slot ancora prenotato, rischio demurrage" : undefined,
    },
    {
      step: "ritiro",
      label: "Ritiro container dal terminal",
      dataOra: ritirato ? `Oggi · ${s.oraRitiro}` : "—",
      completato: ritirato,
      attuale: s.stato === "confermato" && !ritirato,
      note: ritirato ? `Targa mezzo tracciata al gate` : undefined,
    },
    { step: "consegna", label: "Consegna al cliente", dataOra: "—", completato: false },
    {
      step: "rientro_vuoto",
      label: "Rientro container vuoto al terminal",
      dataOra: vuotoRientrato ? `Oggi · ${s.oraRientroVuoto}` : "—",
      completato: vuotoRientrato,
      attuale: ritirato && !vuotoRientrato,
      note: vuotoRientrato
        ? "Flusso che il PCS oggi non traccia. Qui invece sì"
        : ritirato
          ? "Flusso oggi non tracciato dal PCS: nessuna visibilità finché il driver non lo segnala qui"
          : undefined,
    },
  ];
}
