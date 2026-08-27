// Motore del modulo Dogana: nessuna chiamata LLM reale qui, stesso principio già adottato nel
// modulo Flotte (lib/flotta/pianificatore.ts) — punteggio e stato derivano da funzioni pure e
// deterministiche sui dati del caso, "chiedi all'AI" risponde con template su dati reali calcolati.
import type { CasoDoganale, DocumentoDoganale, ProblemaValidazione, StatoCasoDoganale, VoceMerce } from "./tipi";

const PESO_SEVERITA: Record<ProblemaValidazione["severita"], number> = {
  bloccante: 35,
  errore: 18,
  attenzione: 8,
  info: 2,
};

/** 0-100: quanto un caso è pronto per la dogana. Ricalcolato ad ogni render, mai salvato staticamente. */
export function calcolaReadiness(caso: CasoDoganale): number {
  let punteggio = 100;
  for (const p of caso.problemi) {
    if (p.stato === "aperto") punteggio -= PESO_SEVERITA[p.severita];
  }
  const merciDaRivedere = caso.merci.filter((m) => m.statoClassificazione !== "approvata").length;
  punteggio -= merciDaRivedere * 4;
  return Math.max(0, Math.min(100, Math.round(punteggio)));
}

export function fasciaReadiness(score: number): { label: string; tono: "buono" | "medio" | "attenzione" | "bloccato" } {
  if (score === 100) return { label: "Pronto per la dogana", tono: "buono" };
  if (score >= 80) return { label: "Quasi completo, revisione minima", tono: "medio" };
  if (score >= 50) return { label: "Informazioni importanti mancanti o da rivedere", tono: "attenzione" };
  return { label: "Bloccato", tono: "bloccato" };
}

/** Cosa impedisce oggi al caso di arrivare a 100 — per la spiegazione sempre visibile del punteggio. */
export function spiegaBlocco(caso: CasoDoganale): string[] {
  const motivi: string[] = [];
  const aperti = [...caso.problemi]
    .filter((p) => p.stato === "aperto")
    .sort((a, b) => PESO_SEVERITA[b.severita] - PESO_SEVERITA[a.severita]);
  for (const p of aperti) motivi.push(p.titolo);
  const daRivedere = caso.merci.filter((m) => m.statoClassificazione !== "approvata");
  if (daRivedere.length > 0) {
    motivi.push(
      daRivedere.length === 1
        ? `1 voce merce con classificazione HS non ancora approvata`
        : `${daRivedere.length} voci merce con classificazione HS non ancora approvata`
    );
  }
  return motivi;
}

/** Stato derivato dal punteggio, ma senza retrocedere mai da stati "avanzati" (inviato/sdoganato) già raggiunti. */
export function statoDaReadiness(caso: CasoDoganale): StatoCasoDoganale {
  if (caso.stato === "inviato" || caso.stato === "sdoganato") return caso.stato;
  const score = calcolaReadiness(caso);
  const bloccanteAperto = caso.problemi.some((p) => p.stato === "aperto" && p.severita === "bloccante");
  if (score === 100) return "pronto_per_dogana";
  if (bloccanteAperto) return "bloccato";
  if (score >= 50) return "revisione_necessaria";
  return "bloccato";
}

export const LABEL_STATO: Record<StatoCasoDoganale, string> = {
  raccolta_documenti: "Raccolta documenti",
  elaborazione: "Elaborazione IA in corso",
  revisione_necessaria: "Revisione necessaria",
  bloccato: "Bloccato",
  pronto_per_dogana: "Pronto per la dogana",
  inviato: "Dichiarazione inviata",
  sdoganato: "Sdoganato",
};

export const LABEL_SEVERITA: Record<ProblemaValidazione["severita"], string> = {
  bloccante: "Bloccante",
  errore: "Errore",
  attenzione: "Attenzione",
  info: "Info",
};

export const LABEL_TIPO_DOCUMENTO: Record<string, string> = {
  fattura_commerciale: "Fattura commerciale",
  packing_list: "Packing list",
  bill_of_lading: "Bill of lading",
  certificato_origine: "Certificato di origine",
  eur1: "EUR.1",
  documento_trasporto: "Documento di trasporto",
  autorizzazione_doganale: "Autorizzazione doganale",
  certificato: "Certificato prodotto",
  altro: "Altro",
};

/** I passi mostrati durante la simulazione di intake — stessa sequenza per ogni "drop", solo il
 * ritmo con cui appaiono a schermo cambia (vedi CustomsDashboardClient). */
export const PASSI_ELABORAZIONE = [
  "File caricati",
  "Identificazione documenti",
  "Estrazione dati spedizione",
  "Abbinamento alla spedizione",
  "Confronto tra documenti",
  "Verifica requisiti doganali",
  "Creazione caso doganale",
];

/** Genera il caso demo "WOW" (fascicolo disordinato -> caso strutturato con 3 problemi rilevati),
 * deterministico rispetto al contatore passato: stesso scenario ad ogni simulazione, riferimento diverso. */
export function generaCasoIntakeDemo(contatore: number): CasoDoganale {
  const ora = new Date("2026-08-27T11:00:00").toISOString();
  const rif = `ITA-2026-${(4900 + contatore).toString().padStart(4, "0")}`;
  const merci: VoceMerce[] = [
    {
      id: `${rif}-M1`,
      descrizione: "Schede elettroniche di controllo industriale",
      quantita: 480,
      unita: "pz",
      pesoLordoKg: 1180,
      pesoNettoKg: 1050,
      paeseOrigine: "Cina",
      valoreDichiarato: 38500,
      valuta: "EUR",
      hsCodeSuggerito: "8537.10",
      hsConfidenza: 82,
      hsMotivazione: "Descrizione coerente con quadri e apparecchi per comando elettrico, tensione ≤ 1000V.",
      statoClassificazione: "da_rivedere",
      hsCodeApprovato: null,
    },
    {
      id: `${rif}-M2`,
      descrizione: "Connettori e cablaggi assortiti",
      quantita: 1200,
      unita: "pz",
      pesoLordoKg: 210,
      pesoNettoKg: 195,
      paeseOrigine: "Cina",
      valoreDichiarato: 6200,
      valuta: "EUR",
      hsCodeSuggerito: "8544.42",
      hsConfidenza: 91,
      hsMotivazione: "Cavi con connettori, coerente con la voce doganale per conduttori elettrici attrezzati.",
      statoClassificazione: "suggerita",
      hsCodeApprovato: null,
    },
  ];

  const documenti: DocumentoDoganale[] = [
    doc(`${rif}-D1`, "Fattura_Junda_2618.pdf", "fattura_commerciale", "estratto", 95, {
      numeroFattura: "JD-2618",
      totale: "44.700,00 EUR",
      fornitore: "Shenzhen Junda Electronics Co. Ltd",
    }),
    doc(`${rif}-D2`, "Packing_List_2618.pdf", "packing_list", "estratto", 90, {
      colli: "34",
      pesoLordoDichiarato: "1.180 kg",
    }),
    doc(`${rif}-D3`, "BL_MSCUOSA2265581.pdf", "bill_of_lading", "estratto", 97, {
      billOfLading: "MSCUOSA2265581",
      pesoLordoManifest: "1.230 kg",
    }),
    { ...docBase(`${rif}-D4`, "—", "certificato_origine"), stato: "mancante" as const },
  ];

  const problemi: ProblemaValidazione[] = [
    {
      id: `${rif}-P1`,
      severita: "bloccante",
      categoria: "origine",
      titolo: "Documentazione di origine mancante",
      descrizione:
        "Il certificato di origine richiesto per il trattamento doganale selezionato non è presente tra i documenti ricevuti.",
      entitaCoinvolte: [`${rif}-D4`],
      azioneSuggerita: "Richiedi il certificato di origine al fornitore Shenzhen Junda Electronics.",
      stato: "aperto",
    },
    {
      id: `${rif}-P2`,
      severita: "errore",
      categoria: "incongruenza",
      titolo: "Incongruenza sul peso lordo",
      descrizione: "La Packing List indica 1.180 kg, il Bill of Lading indica 1.230 kg per lo stesso container.",
      entitaCoinvolte: [`${rif}-D2`, `${rif}-D3`],
      azioneSuggerita: "Verifica quale dei due documenti riflette il peso reale e correggi l'altro.",
      stato: "aperto",
    },
    {
      id: `${rif}-P3`,
      severita: "attenzione",
      categoria: "classificazione",
      titolo: "Classificazione HS da rivedere",
      descrizione:
        "La descrizione prodotto per le schede elettroniche di controllo è generica: la confidenza IA sulla voce HS suggerita è sotto la soglia per l'approvazione automatica.",
      entitaCoinvolte: [`${rif}-M1`],
      azioneSuggerita: "Chiedi al cliente una descrizione tecnica più precisa o rivedi manualmente la voce HS.",
      stato: "aperto",
    },
  ];

  return {
    id: rif,
    riferimento: rif,
    spedizioneId: null,
    importatore: { nome: "Ansaldo Componenti SpA", paese: "Italia", partitaIva: "IT01234560103", eori: "ITEORI0123456" },
    esportatore: { nome: "Shenzhen Junda Electronics Co. Ltd", paese: "Cina", partitaIva: null, eori: null },
    trasporto: {
      modalita: "mare",
      billOfLading: "MSCUOSA2265581",
      nave: "MSC Diletta",
      viaggio: "FE12E",
      portoImbarco: "Shenzhen",
      portoSbarco: "Genova",
      container: ["MSCU2204413"],
    },
    merci,
    documenti,
    problemi,
    datiDoganali: {
      incoterm: "FOB Shenzhen",
      regimeDoganale: null,
      paeseOrigine: "Cina",
      originePreferenziale: null,
      valoreDoganale: 44700,
      valuta: "EUR",
      dazioStimato: null,
      ivaStimata: null,
    },
    attivita: [
      { id: `${rif}-A1`, quando: ora, testo: "Caso creato da un drop di 4 documenti (ZIP).", fonte: "sistema" },
      { id: `${rif}-A2`, quando: ora, testo: "Documenti identificati e dati estratti automaticamente.", fonte: "ai" },
      { id: `${rif}-A3`, quando: ora, testo: "Rilevate 3 incongruenze/problemi durante il confronto tra documenti.", fonte: "ai" },
    ],
    stato: "bloccato",
    creatoIl: ora,
    aggiornatoIl: ora,
  };
}

function docBase(id: string, nome: string, tipo: DocumentoDoganale["tipo"]) {
  return { id, nome, tipo, fonte: "upload" as const, versione: 1, campiEstratti: {}, caricatoIl: null, confidenza: null };
}
function doc(
  id: string,
  nome: string,
  tipo: DocumentoDoganale["tipo"],
  stato: "estratto" | "da_rivedere",
  confidenza: number,
  campiEstratti: Record<string, string>
): DocumentoDoganale {
  return { ...docBase(id, nome, tipo), stato, confidenza, campiEstratti, caricatoIl: "2026-08-27T10:52:00.000Z" };
}

/** Testo di richiesta informazioni pronto da copiare/inviare — per il prototipo resta un draft, non invia nulla. */
export function generaBozzaRichiesta(caso: CasoDoganale, problema: ProblemaValidazione): string {
  const destinatario = caso.esportatore.nome || caso.importatore.nome || "il cliente";
  return [
    `Oggetto: Informazioni mancanti — pratica doganale ${caso.riferimento}`,
    "",
    `Gentile ${destinatario},`,
    "",
    `nella preparazione della pratica doganale ${caso.riferimento} abbiamo riscontrato quanto segue:`,
    `- ${problema.titolo}: ${problema.descrizione}`,
    "",
    problema.azioneSuggerita ? `Richiesta: ${problema.azioneSuggerita}` : "Vi chiediamo di fornirci quanto prima le informazioni mancanti.",
    "",
    "Restiamo in attesa per poter procedere con lo sdoganamento.",
    "Cordiali saluti,",
    caso.importatore.nome !== destinatario ? caso.importatore.nome : "Ufficio operativo",
  ].join("\n");
}

const DOMANDE_COPILOT_BASE = [
  "Cosa manca prima che questo caso possa procedere?",
  "Perché questo caso è bloccato?",
  "Ci sono incongruenze tra i documenti?",
  "Quali merci richiedono revisione della classificazione?",
  "Riassumi questo caso doganale.",
];
export { DOMANDE_COPILOT_BASE };

export function rispostaCopilot(domanda: string, caso: CasoDoganale): string {
  const score = calcolaReadiness(caso);
  const aperti = caso.problemi.filter((p) => p.stato === "aperto");
  const bloccanti = aperti.filter((p) => p.severita === "bloccante" || p.severita === "errore");

  if (domanda === "Cosa manca prima che questo caso possa procedere?") {
    const motivi = spiegaBlocco(caso);
    if (motivi.length === 0) return `Niente: il caso è al 100% e pronto per la dogana.`;
    return `Readiness attuale ${score}/100. Prima di procedere serve risolvere: ${motivi.join("; ")}.`;
  }

  if (domanda === "Perché questo caso è bloccato?") {
    if (bloccanti.length === 0) return "Non è bloccato: non ci sono problemi bloccanti o di tipo errore ancora aperti.";
    return bloccanti
      .map((p) => `${p.titolo} (${LABEL_SEVERITA[p.severita].toLowerCase()}) — ${p.descrizione}`)
      .join(" ");
  }

  if (domanda === "Ci sono incongruenze tra i documenti?") {
    const incongruenze = aperti.filter((p) => p.categoria === "incongruenza");
    if (incongruenze.length === 0) return "Nessuna incongruenza aperta tra i documenti caricati.";
    return incongruenze.map((p) => p.descrizione).join(" ");
  }

  if (domanda === "Quali merci richiedono revisione della classificazione?") {
    const daRivedere = caso.merci.filter((m) => m.statoClassificazione !== "approvata");
    if (daRivedere.length === 0) return "Nessuna: tutte le voci merce hanno una classificazione HS approvata.";
    return daRivedere
      .map((m) => `${m.descrizione} (HS suggerito ${m.hsCodeSuggerito ?? "non disponibile"}, confidenza ${m.hsConfidenza ?? "—"}%)`)
      .join("; ");
  }

  // "Riassumi questo caso doganale." e fallback
  const merciTxt = caso.merci.length === 1 ? "1 voce merce" : `${caso.merci.length} voci merce`;
  const docTxt = caso.documenti.filter((d) => d.stato !== "mancante").length;
  return `${caso.riferimento}: ${merciTxt}, ${docTxt}/${caso.documenti.length} documenti ricevuti, ${aperti.length} problemi aperti, readiness ${score}/100 (${fasciaReadiness(score).label.toLowerCase()}).`;
}
