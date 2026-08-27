// Motore dell'Exception Center: pure funzioni, nessuna chiamata IA — correla segnali che esistono
// già in Porti (demurrage, appuntamento) e in Dogana (problemi bloccanti aperti) invece di
// inventarne di nuovi. Lo stesso principio "deterministico, non un LLM" già in lib/flotta e
// lib/customs. Non tocca né modifica lo stato di Spedizione o CasoDoganale: legge soltanto.
import { daysUntil, type Spedizione } from "@/lib/data";
import type { CasoDoganale } from "@/lib/customs/tipi";
import type { CategoriaEccezione, Eccezione, SeveritaEccezione } from "./tipi";

const PESO_SEVERITA: Record<SeveritaEccezione, number> = { critica: 3, alta: 2, media: 1 };

export const LABEL_SEVERITA_ECCEZIONE: Record<SeveritaEccezione, string> = {
  critica: "Critica",
  alta: "Alta",
  media: "Media",
};

/** Stima puramente indicativa, solo su demurrage già maturato — non inventiamo esposizione su rischio futuro. */
const TARIFFA_DEMURRAGE_GIORNO = 140;

function peggiorProblemaAperto(caso: CasoDoganale) {
  return [...caso.problemi]
    .filter((p) => p.stato === "aperto" && (p.severita === "bloccante" || p.severita === "errore"))
    .sort((a, b) => (a.severita === "bloccante" ? -1 : 1) - (b.severita === "bloccante" ? -1 : 1))[0];
}

export function rilevaEccezioni(spedizioni: Spedizione[], casiDoganali: CasoDoganale[]): Eccezione[] {
  const eccezioni: Eccezione[] = [];
  const idSpedizioniConCaso = new Set<string>();

  for (const s of spedizioni) {
    const caso = casiDoganali.find((c) => c.spedizioneId === s.id);
    if (caso) idSpedizioniConCaso.add(s.id);

    const problemaDogana = caso ? peggiorProblemaAperto(caso) : undefined;
    const doganaBlocca = Boolean(problemaDogana);
    const nonPianificata = s.stato !== "confermato";
    const gg = daysUntil(s.scadenzaDemurrage);
    const demurrageVicino = gg <= 2;

    if (!doganaBlocca && !nonPianificata && !demurrageVicino) continue;

    const ragioni: string[] = [];
    const categorie: CategoriaEccezione[] = [];

    if (doganaBlocca && problemaDogana) {
      categorie.push("dogana");
      ragioni.push(`Dogana bloccata: ${problemaDogana.titolo.toLowerCase()}`);
    }
    if (nonPianificata) {
      categorie.push("appuntamento");
      ragioni.push(s.stato === "in_ritardo" ? "Nessuno slot ancora prenotato al terminal" : "Appuntamento gate non ancora pianificato");
    }
    if (demurrageVicino) {
      categorie.push("demurrage");
      ragioni.push(gg <= 0 ? `Demurrage già scaduto (${Math.abs(gg)} giorni fa)` : `Demurrage tra ${gg} giorni`);
    }

    let severita: SeveritaEccezione = "media";
    if ((doganaBlocca && demurrageVicino) || gg <= 0) severita = "critica";
    else if (ragioni.length >= 2 || gg <= 1) severita = "alta";

    const azioneConsigliata = doganaBlocca
      ? `Risolvi il blocco doganale (caso ${caso!.riferimento}) per sbloccare la spedizione`
      : nonPianificata
        ? "Prenota un appuntamento gate prima possibile"
        : "Coordina il ritiro con il vettore prima della scadenza";

    eccezioni.push({
      id: `ECC-${s.id}`,
      severita,
      spedizioneId: s.id,
      casoDoganaleId: caso?.id ?? null,
      titolo: `${s.id} — ${s.cliente}`,
      ragioni,
      categorie,
      azioneConsigliata,
      href: doganaBlocca && caso ? `/customs/${caso.id}` : `/spedizioni/${s.id}`,
      esposizioneEuro: gg <= 0 ? (Math.abs(gg) + 1) * TARIFFA_DEMURRAGE_GIORNO : null,
    });
  }

  // Casi doganali bloccati senza (ancora) una spedizione collegata nella lista corrente: non hanno
  // un demurrage da tracciare, ma bloccano comunque il lavoro a monte e vanno segnalati lo stesso.
  for (const caso of casiDoganali) {
    if (caso.spedizioneId && idSpedizioniConCaso.has(caso.spedizioneId)) continue;
    const aperti = caso.problemi.filter((p) => p.stato === "aperto" && (p.severita === "bloccante" || p.severita === "errore"));
    if (aperti.length === 0) continue;
    const peggiore = peggiorProblemaAperto(caso)!;
    eccezioni.push({
      id: `ECC-${caso.id}`,
      severita: aperti.some((p) => p.severita === "bloccante") ? "alta" : "media",
      spedizioneId: null,
      casoDoganaleId: caso.id,
      titolo: `${caso.riferimento} — ${caso.importatore.nome}`,
      ragioni: aperti.map((p) => p.titolo),
      categorie: ["dogana"],
      azioneConsigliata: peggiore.azioneSuggerita ?? "Rivedi il caso doganale",
      href: `/customs/${caso.id}`,
      esposizioneEuro: null,
    });
  }

  return eccezioni.sort((a, b) => PESO_SEVERITA[b.severita] - PESO_SEVERITA[a.severita]);
}
