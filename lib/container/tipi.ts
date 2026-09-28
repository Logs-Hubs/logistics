// Domain model del modulo Container Trucking: il workflow centrale definito in
// product/container-trucking-v1.md — order intake -> readiness -> dispatch -> esecuzione ->
// consegna -> rientro vuoto -> documenti -> fatturazione. Persona: il dispatcher di un'azienda di
// autotrasporto container, non lo spedizioniere (quello è il modulo Porti) né l'autotrasportatore
// generico (quello è Flotte). Dati demo deterministici, nessun collegamento a Supabase o a terminal
// reali — vedi lib/container/datiDemo.ts.

export type PortoContainer = "genova" | "savona-vado" | "la-spezia";

export const NOME_PORTO: Record<PortoContainer, string> = {
  genova: "Genova",
  "savona-vado": "Savona-Vado",
  "la-spezia": "La Spezia",
};

export type FaseOrdine =
  | "attesa_readiness"
  | "pronto_dispatch"
  | "in_esecuzione"
  | "consegnato"
  | "vuoto_rientrato"
  | "fatturato";

export const LABEL_FASE_ORDINE: Record<FaseOrdine, string> = {
  attesa_readiness: "In attesa di readiness",
  pronto_dispatch: "Pronto per il dispatch",
  in_esecuzione: "In esecuzione",
  consegnato: "Consegnato",
  vuoto_rientrato: "Vuoto rientrato",
  fatturato: "Fatturato",
};

/** I tre segnali indipendenti che devono essere tutti veri prima che un container sia ritirabile
 * — vedi research/container-trucking-workflow.md §2. Lo slot è tenuto separato perché non tutti i
 * terminal lo richiedono, e perché anche con readiness completa lo slot può restare da prenotare. */
export type StatoReadiness = {
  carrierRelease: boolean;
  customsRelease: boolean;
  terminalDisponibile: boolean;
  slotPrenotato: boolean;
  slotDataOra: string | null;
};

export function readinessCompleta(r: StatoReadiness): boolean {
  return r.carrierRelease && r.customsRelease && r.terminalDisponibile;
}

export type Autista = {
  id: string;
  nome: string;
};

export type Mezzo = {
  id: string;
  targa: string;
  reefer: boolean;
  adr: boolean;
};

export type OrdineContainer = {
  id: string;
  cliente: string;
  containerId: string;
  tipoContainer: string; // es. "40' HC", "20' dry", "40' reefer"
  porto: PortoContainer;
  terminal: string;
  tipo: "import" | "export";
  /** Requisiti del mezzo, non del container: determinano quali mezzi sono assegnabili in dispatch
   * (vedi compatibile()) — product/container-trucking-v1.md §10 punto 2. */
  richiedeReefer: boolean;
  richiedeAdr: boolean;
  readiness: StatoReadiness;
  /** Ultimo giorno senza penale demurrage/detention — ISO date. */
  ultimoFreeDay: string;
  faseOperativa: FaseOrdine;
  autistaId: string | null;
  mezzoId: string | null;
  oraRitiro: string | null;
  oraConsegna: string | null;
  oraRientroVuoto: string | null;
  /** Minuti di attesa registrati al gate/cliente oltre soglia contrattuale, null se non ancora capitato. */
  attesaMinuti: number | null;
  /** EUR di accessorial (attese, pesature, riconsegne) non ancora fatturati al cliente. */
  accessorialDaFatturare: number | null;
  tariffaConcordata: number | null;
  /** EIR (verbale di stato al ritiro) e POD (prova di consegna) raccolti — senza entrambi non si
   * può fatturare, vedi prontoPerFatturazione() in motore.ts e product/container-trucking-v1.md §10. */
  eirRaccolto: boolean;
  podRaccolto: boolean;
  creatoIl: string;
  aggiornatoIl: string;
};

export function compatibile(ordine: OrdineContainer, mezzo: Mezzo): boolean {
  if (ordine.richiedeReefer && !mezzo.reefer) return false;
  if (ordine.richiedeAdr && !mezzo.adr) return false;
  return true;
}

/** Campi che un dispatcher compila per registrare un ordine appena arrivato — intake strutturato
 * manuale, non capability A (parsing AI di email/PDF, resta HYPOTHESIS non costruita). Vedi
 * product/container-trucking-v1.md §10 punto 1. */
export type NuovoOrdineInput = {
  cliente: string;
  containerId: string;
  tipoContainer: string;
  porto: PortoContainer;
  terminal: string;
  tipo: "import" | "export";
  richiedeReefer: boolean;
  richiedeAdr: boolean;
  ultimoFreeDay: string;
  tariffaConcordata: number | null;
};
