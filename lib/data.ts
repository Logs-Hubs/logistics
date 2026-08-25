export type StatoAppuntamento = "confermato" | "da_pianificare" | "in_ritardo";

export type Terminal = {
  id: string;
  nome: string;
  breve: string;
};

export const TERMINALS: Terminal[] = [
  { id: "porto-vecchio", nome: "Genova Porto Vecchio", breve: "Porto Vecchio" },
  { id: "psa-pra", nome: "PSA Genova Prà", breve: "PSA Prà" },
  { id: "savona-vado", nome: "Savona-Vado Ligure", breve: "Savona-Vado" },
];

export type Vettore = {
  id: string;
  nome: string;
  autista: string;
  telefono: string;
  targa: string;
};

export const VETTORI: Vettore[] = [
  { id: "v1", nome: "Autotrasporti Bruzzone srl", autista: "Marco Bruzzone", telefono: "+39 335 012 3456", targa: "GE AZ912" },
  { id: "v2", nome: "Trans Liguria Cargo", autista: "Ismail Diallo", telefono: "+39 347 890 1122", targa: "SV BF204" },
  { id: "v3", nome: "F.lli Ferrando Autotrasporti", autista: "Luca Ferrando", telefono: "+39 328 445 7789", targa: "GE CD558" },
  { id: "v4", nome: "Sestri Log Trans", autista: "Andrei Popescu", telefono: "+39 351 220 9081", targa: "GE EF330" },
];

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
};

export const SPEDIZIONI: Spedizione[] = [
  {
    id: "SP-2461",
    cliente: "Ansaldo Componenti SpA",
    containerId: "MSCU 771230-4",
    terminalId: "psa-pra",
    stato: "confermato",
    vettoreId: "v1",
    scadenzaDemurrage: "2026-08-29",
    oraAppuntamento: "08:00",
    dataAppuntamento: "2026-08-26",
    tipo: "import",
    merce: "Componenti meccanici",
  },
  {
    id: "SP-2462",
    cliente: "Costa Caffè Import",
    containerId: "TCLU 550981-2",
    terminalId: "porto-vecchio",
    stato: "da_pianificare",
    vettoreId: "v2",
    scadenzaDemurrage: "2026-08-27",
    tipo: "import",
    merce: "Caffè in grani",
  },
  {
    id: "SP-2463",
    cliente: "Recchi Marmi Export",
    containerId: "MSCU 118820-9",
    terminalId: "savona-vado",
    stato: "in_ritardo",
    vettoreId: "v3",
    scadenzaDemurrage: "2026-08-25",
    tipo: "export",
    merce: "Marmo lavorato",
  },
  {
    id: "SP-2464",
    cliente: "Ligure Tessuti Srl",
    containerId: "HLXU 990112-7",
    terminalId: "psa-pra",
    stato: "confermato",
    vettoreId: "v4",
    scadenzaDemurrage: "2026-08-30",
    oraAppuntamento: "14:00",
    dataAppuntamento: "2026-08-26",
    tipo: "export",
    merce: "Tessuti tecnici",
  },
  {
    id: "SP-2465",
    cliente: "Ansaldo Componenti SpA",
    containerId: "MSCU 220441-3",
    terminalId: "porto-vecchio",
    stato: "da_pianificare",
    vettoreId: "v1",
    scadenzaDemurrage: "2026-08-28",
    tipo: "import",
    merce: "Componenti elettronici",
  },
  {
    id: "SP-2466",
    cliente: "Genova Food Trade",
    containerId: "CMAU 334765-1",
    terminalId: "savona-vado",
    stato: "confermato",
    vettoreId: "v2",
    scadenzaDemurrage: "2026-09-01",
    oraAppuntamento: "10:00",
    dataAppuntamento: "2026-08-27",
    tipo: "import",
    merce: "Prodotti alimentari confezionati",
  },
  {
    id: "SP-2467",
    cliente: "Sestri Meccanica Export",
    containerId: "MSCU 887321-6",
    terminalId: "psa-pra",
    stato: "in_ritardo",
    vettoreId: "v3",
    scadenzaDemurrage: "2026-08-25",
    tipo: "export",
    merce: "Macchinari industriali",
  },
];

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

export function generaSlot(giorno: string): Slot[] {
  const slots: Slot[] = [];
  let seed = giorno.split("-").reduce((a, b) => a + parseInt(b, 10), 0);
  TERMINALS.forEach((t, ti) => {
    orari.forEach((ora, oi) => {
      seed += 1;
      const r = pseudoRandom(seed + ti * 13 + oi * 7);
      let stato: SlotStato = "libero";
      if (r > 0.75) stato = "pieno";
      else if (r > 0.5) stato = "quasi_pieno";
      // aggancia gli slot confermati della demo
      const spedizioneAggangiata = SPEDIZIONI.find(
        (s) => s.terminalId === t.id && s.dataAppuntamento === giorno && s.oraAppuntamento === ora
      );
      if (spedizioneAggangiata) stato = "pieno";
      slots.push({ ora, terminalId: t.id, stato, spedizioneId: spedizioneAggangiata?.id });
    });
  });
  return slots;
}

export const ORARI_SLOT = orari;

export function terminalNome(id: string): string {
  return TERMINALS.find((t) => t.id === id)?.nome ?? id;
}

export function vettoreById(id: string): Vettore | undefined {
  return VETTORI.find((v) => v.id === id);
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
      note: s.stato === "in_ritardo" ? "Nessuno slot ancora prenotato — rischio demurrage" : undefined,
    },
    { step: "ritiro", label: "Ritiro container dal terminal", dataOra: "—", completato: false },
    { step: "consegna", label: "Consegna al cliente", dataOra: "—", completato: false },
    { step: "rientro_vuoto", label: "Rientro container vuoto al terminal", dataOra: "—", completato: false, note: "Flusso oggi non tracciato dal PCS" },
  ];
}
