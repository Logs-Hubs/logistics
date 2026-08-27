// Motore "Documenti trasporto": stesso principio di lib/customs/motore.ts e lib/flotta/pianificatore.ts
// — funzioni pure e deterministiche, nessuna chiamata LLM reale. Lo stato di fatturazione non è mai
// scritto a mano tranne "fatturato": tutto il resto è calcolato dai documenti presenti.
import type { DocumentoTrasporto, LavoroTrasporto, StatoFatturazione, TipoDocumentoTrasporto } from "./tipi";

/** Ogni lavoro richiede questi tre, indipendentemente dalla tratta — coerente con la demo, non con
 * la normativa reale (che distingue DDT nazionale da CMR internazionale). */
export const DOCUMENTI_RICHIESTI: TipoDocumentoTrasporto[] = ["ordine_cliente", "ddt", "pod"];

export const LABEL_TIPO_DOCUMENTO: Record<TipoDocumentoTrasporto, string> = {
  ordine_cliente: "Ordine cliente",
  ddt: "DDT",
  cmr: "CMR",
  pod: "POD (prova di consegna)",
  fattura: "Fattura",
  altro: "Altro",
};

export const LABEL_STATO_FATTURAZIONE: Record<StatoFatturazione, string> = {
  non_completo: "Consegna non ancora completata",
  documenti_mancanti: "Documenti mancanti",
  tariffa_da_verificare: "Tariffa da verificare",
  pronto_fatturazione: "Pronto per la fatturazione",
  fatturato: "Fatturato",
};

// "Mancante" ai fini della fatturazione non vuol dire solo assente: un documento arrivato ma non
// ancora validato (in elaborazione, da rivedere, rifiutato) non basta per sbloccare il lavoro.
function documentiMancanti(lavoro: LavoroTrasporto): TipoDocumentoTrasporto[] {
  return DOCUMENTI_RICHIESTI.filter((tipo) => {
    const doc = lavoro.documenti.find((d) => d.tipo === tipo);
    return !doc || doc.stato !== "validato";
  });
}

export function calcolaStatoFatturazione(lavoro: LavoroTrasporto): StatoFatturazione {
  if (lavoro.fatturato) return "fatturato";
  if (!lavoro.dataConsegna) return "non_completo";
  if (documentiMancanti(lavoro).length > 0) return "documenti_mancanti";
  if (lavoro.tariffaConcordata === null) return "tariffa_da_verificare";
  return "pronto_fatturazione";
}

/** Perché la fattura non può ancora uscire — sempre spiegato, mai un semaforo muto. Distingue un
 * documento davvero assente da uno arrivato ma non ancora validato: sono azioni diverse. */
export function spiegaBlocco(lavoro: LavoroTrasporto): string[] {
  const stato = calcolaStatoFatturazione(lavoro);
  if (stato === "non_completo") return ["La consegna non risulta ancora completata"];
  if (stato === "documenti_mancanti") {
    return documentiMancanti(lavoro).map((tipo) => {
      const label = LABEL_TIPO_DOCUMENTO[tipo];
      const doc = lavoro.documenti.find((d) => d.tipo === tipo);
      if (!doc || doc.stato === "mancante") return `${label} mancante`;
      if (doc.stato === "rifiutato") return `${label} rifiutato, da ricaricare`;
      return `${label} ricevuto ma non ancora validato`;
    });
  }
  if (stato === "tariffa_da_verificare") return ["Tariffa concordata non ancora confermata"];
  return [];
}

export const PASSI_ELABORAZIONE = [
  "Email ricevuta",
  "Identificazione allegati",
  "Estrazione dati ordine",
  "Abbinamento a mezzo e autista",
  "Verifica documenti richiesti",
  "Creazione lavoro di trasporto",
];

function doc(
  id: string,
  nome: string,
  tipo: TipoDocumentoTrasporto,
  stato: DocumentoTrasporto["stato"],
  confidenza: number | null,
  caricatoIl: string | null,
  campiEstratti: Record<string, string> = {}
): DocumentoTrasporto {
  return { id, nome, tipo, stato, confidenza, campiEstratti, caricatoIl };
}

/** Il "wow moment" dichiarato nel brief: inoltri un'email con un PDF allegato, appare un lavoro di
 * trasporto strutturato. Stesso scenario ad ogni simulazione, riferimento diverso. */
export function generaLavoroIntakeDemo(contatore: number): LavoroTrasporto {
  const ora = new Date("2026-08-27T15:00:00").toISOString();
  const rif = `LAV-2026-${(700 + contatore).toString().padStart(4, "0")}`;
  return {
    id: rif,
    riferimento: rif,
    clienteNome: "Beverage Group Ricci",
    ordineId: null,
    mezzoId: null,
    autistaId: null,
    ritiroCitta: "Brescia",
    consegnaCitta: "Bari",
    dataConsegna: null,
    tariffaConcordata: 640,
    documenti: [
      doc(`${rif}-D1`, "Ordine_BGR_env.pdf", "ordine_cliente", "validato", 96, ora, {
        numeroOrdine: "BGR-3391",
        pesoKg: "5.400",
      }),
      doc(`${rif}-D2`, "—", "ddt", "mancante", null, null),
      doc(`${rif}-D3`, "—", "pod", "mancante", null, null),
    ],
    fatturato: false,
    attivita: [
      { id: `${rif}-A1`, quando: ora, testo: "Lavoro creato da un'email inoltrata con un PDF allegato.", fonte: "sistema" },
      { id: `${rif}-A2`, quando: ora, testo: "Ordine identificato ed estratto automaticamente.", fonte: "ai" },
      { id: `${rif}-A3`, quando: ora, testo: "In attesa di assegnazione mezzo/autista e di DDT e POD a consegna avvenuta.", fonte: "ai" },
    ],
    creatoIl: ora,
    aggiornatoIl: ora,
  };
}

/** Testo pronto per sollecitare il documento mancante (all'autista via WhatsApp, o al cliente via
 * email) — per il prototipo resta una bozza, non invia nulla. Stesso principio di
 * lib/customs/motore.ts generaBozzaRichiesta. */
export function generaBozzaSollecito(lavoro: LavoroTrasporto, tipo: TipoDocumentoTrasporto): string {
  return [
    `Messaggio per sollecitare: ${lavoro.riferimento}`,
    "",
    `Ciao, per chiudere la pratica del lavoro ${lavoro.riferimento} (${lavoro.ritiroCitta} → ${lavoro.consegnaCitta}, cliente ${lavoro.clienteNome})`,
    `manca ancora: ${LABEL_TIPO_DOCUMENTO[tipo]}.`,
    "",
    "Puoi mandare una foto o una scansione appena disponibile? Senza questo documento il lavoro resta bloccato e non può essere fatturato.",
    "",
    "Grazie!",
  ].join("\n");
}

export const DOMANDE_COPILOT_BASE = [
  "Quanto fatturato è bloccato oggi?",
  "Quali lavori hanno documenti mancanti?",
  "Cosa serve per sbloccare questo lavoro?",
  "Riassumi lo stato dei lavori di trasporto.",
];

export function rispostaCopilot(domanda: string, lavori: LavoroTrasporto[], lavoroCorrente?: LavoroTrasporto): string {
  const bloccati = lavori.filter((l) => calcolaStatoFatturazione(l) === "documenti_mancanti");
  const prontiEuro = lavori
    .filter((l) => calcolaStatoFatturazione(l) === "pronto_fatturazione")
    .reduce((s, l) => s + (l.tariffaConcordata ?? 0), 0);
  const bloccatoEuro = bloccati.reduce((s, l) => s + (l.tariffaConcordata ?? 0), 0);

  if (domanda === "Quanto fatturato è bloccato oggi?") {
    if (bloccati.length === 0) return "Nessun fatturato bloccato al momento: tutti i lavori completati hanno i documenti richiesti.";
    return `${bloccati.length} lavori per un totale di ${euro(bloccatoEuro)} sono bloccati da documenti mancanti, contro ${euro(prontiEuro)} già pronti per la fatturazione.`;
  }
  if (domanda === "Quali lavori hanno documenti mancanti?") {
    if (bloccati.length === 0) return "Nessuno al momento.";
    return bloccati.map((l) => `${l.riferimento} (${spiegaBlocco(l).join(", ")})`).join("; ");
  }
  if (domanda === "Cosa serve per sbloccare questo lavoro?") {
    if (!lavoroCorrente) return "Apri un lavoro specifico per avere questa risposta nel contesto giusto.";
    const motivi = spiegaBlocco(lavoroCorrente);
    return motivi.length === 0 ? "Niente: è già pronto per la fatturazione." : motivi.join("; ");
  }
  // "Riassumi lo stato dei lavori di trasporto." e fallback
  const perStato = lavori.reduce<Record<string, number>>((acc, l) => {
    const s = calcolaStatoFatturazione(l);
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(perStato)
    .map(([s, n]) => `${n} ${LABEL_STATO_FATTURAZIONE[s as StatoFatturazione].toLowerCase()}`)
    .join(", ");
}

function euro(n: number) {
  return n.toLocaleString("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}
