// Motore dell'Exception Center di Flotte: pure funzioni, nessuna chiamata IA — correla i problemi
// già rilevati dal planner (lib/flotta/pianificatore.ts) con il fatturato bloccato dai documenti
// (lib/flotta/documenti/motore.ts), stesso principio di lib/exceptions/motore.ts per Porti.
import type { Problema } from "@/lib/flotta/tipi";
import type { LavoroTrasporto } from "@/lib/flotta/documenti/tipi";
import { calcolaStatoFatturazione, spiegaBlocco } from "@/lib/flotta/documenti/motore";
import type { CategoriaEccezioneFlotta, EccezioneFlotta, SeveritaEccezioneFlotta } from "./tipi";

const PESO_SEVERITA: Record<SeveritaEccezioneFlotta, number> = { critica: 3, alta: 2, media: 1 };

export const LABEL_SEVERITA_ECCEZIONE_FLOTTA: Record<SeveritaEccezioneFlotta, string> = {
  critica: "Critica",
  alta: "Alta",
  media: "Media",
};

function severitaProblema(problema: Problema): SeveritaEccezioneFlotta {
  if (problema.tipo === "non_assegnato" || problema.tipo === "ore_autista") return "critica";
  if (problema.tipo === "rischio_ritardo") return "alta";
  return "media"; // reso_vuoto: opportunità mancata, non un guasto operativo
}

export function rilevaEccezioniFlotta(problemi: Problema[], lavori: LavoroTrasporto[]): EccezioneFlotta[] {
  const eccezioni: EccezioneFlotta[] = [];

  for (const p of problemi) {
    if (p.risolto) continue;
    eccezioni.push({
      id: `ECC-PIANO-${p.id}`,
      severita: severitaProblema(p),
      titolo: p.titolo,
      ragioni: [p.descrizione],
      categorie: ["pianificazione" as CategoriaEccezioneFlotta],
      azioneConsigliata: p.azione ? "Applica la correzione suggerita nel centro comando" : "Rivedi manualmente nel centro comando",
      href: "/flotta",
      // solo il denaro già a rischio (impatto negativo), non le opportunità di ricavo non ancora colte
      esposizioneEuro: p.impattoEuro < 0 ? Math.abs(p.impattoEuro) : null,
    });
  }

  for (const l of lavori) {
    const stato = calcolaStatoFatturazione(l);
    if (stato !== "documenti_mancanti" && stato !== "tariffa_da_verificare") continue;
    const ragioni = spiegaBlocco(l);
    eccezioni.push({
      id: `ECC-DOC-${l.id}`,
      severita: stato === "documenti_mancanti" && ragioni.length >= 2 ? "critica" : stato === "documenti_mancanti" ? "alta" : "media",
      titolo: `${l.riferimento} — ${l.clienteNome}`,
      ragioni,
      categorie: ["fatturazione" as CategoriaEccezioneFlotta],
      azioneConsigliata: stato === "documenti_mancanti" ? "Sollecita i documenti mancanti" : "Conferma la tariffa concordata",
      href: `/flotta/documenti/${l.id}`,
      esposizioneEuro: l.tariffaConcordata,
    });
  }

  return eccezioni.sort((a, b) => PESO_SEVERITA[b.severita] - PESO_SEVERITA[a.severita]);
}
