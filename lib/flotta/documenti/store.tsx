"use client";

// Stato locale per "Documenti trasporto", stesso pattern di lib/customs/store.tsx: nessun backend,
// condiviso tra dashboard e dettaglio lavoro tramite Context montato in app/flotta/documenti/layout.tsx.
// A differenza di CustomsProvider, resta annidato sotto /flotta/documenti e non al root: nessun'altra
// pagina (planner Flotte, dashboard Porti) ha bisogno di leggere questi dati.
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { DocumentoTrasporto, LavoroTrasporto, TipoDocumentoTrasporto } from "./tipi";
import { LAVORI_DEMO } from "./datiDemo";
import { generaLavoroIntakeDemo } from "./motore";

type DocumentiContextValue = {
  lavori: LavoroTrasporto[];
  validaDocumento: (lavoroId: string, documentoId: string) => void;
  confermaTariffa: (lavoroId: string, tariffa: number) => void;
  segnaFatturato: (lavoroId: string) => void;
  registraSollecito: (lavoroId: string, tipo: TipoDocumentoTrasporto) => void;
  simulaIntake: () => string;
};

const DocumentiContext = createContext<DocumentiContextValue | null>(null);

function timestamp() {
  return new Date().toISOString();
}

export function DocumentiProvider({ children }: { children: ReactNode }) {
  const [lavori, setLavori] = useState<LavoroTrasporto[]>(LAVORI_DEMO);
  const [contatoreIntake, setContatoreIntake] = useState(1);

  const aggiornaLavoro = useCallback((lavoroId: string, aggiorna: (l: LavoroTrasporto) => LavoroTrasporto) => {
    setLavori((prev) => prev.map((l) => (l.id === lavoroId ? aggiorna(l) : l)));
  }, []);

  const validaDocumento = useCallback(
    (lavoroId: string, documentoId: string) => {
      aggiornaLavoro(lavoroId, (l) => {
        const documento = l.documenti.find((d) => d.id === documentoId);
        const documenti: DocumentoTrasporto[] = l.documenti.map((d) => (d.id === documentoId ? { ...d, stato: "validato" } : d));
        return {
          ...l,
          documenti,
          attivita: [
            { id: `${lavoroId}-A${l.attivita.length + 1}`, quando: timestamp(), testo: `Documento validato: ${documento?.nome ?? documentoId}.`, fonte: "operatore" },
            ...l.attivita,
          ],
          aggiornatoIl: timestamp(),
        };
      });
    },
    [aggiornaLavoro]
  );

  const confermaTariffa = useCallback(
    (lavoroId: string, tariffa: number) => {
      aggiornaLavoro(lavoroId, (l) => ({
        ...l,
        tariffaConcordata: tariffa,
        attivita: [
          { id: `${lavoroId}-A${l.attivita.length + 1}`, quando: timestamp(), testo: `Tariffa confermata: ${tariffa} EUR.`, fonte: "operatore" },
          ...l.attivita,
        ],
        aggiornatoIl: timestamp(),
      }));
    },
    [aggiornaLavoro]
  );

  const segnaFatturato = useCallback(
    (lavoroId: string) => {
      aggiornaLavoro(lavoroId, (l) => ({
        ...l,
        fatturato: true,
        attivita: [{ id: `${lavoroId}-A${l.attivita.length + 1}`, quando: timestamp(), testo: "Fattura emessa.", fonte: "operatore" }, ...l.attivita],
        aggiornatoIl: timestamp(),
      }));
    },
    [aggiornaLavoro]
  );

  const registraSollecito = useCallback(
    (lavoroId: string, tipo: TipoDocumentoTrasporto) => {
      aggiornaLavoro(lavoroId, (l) => ({
        ...l,
        attivita: [
          { id: `${lavoroId}-A${l.attivita.length + 1}`, quando: timestamp(), testo: `Sollecito preparato per: ${tipo}.`, fonte: "operatore" },
          ...l.attivita,
        ],
      }));
    },
    [aggiornaLavoro]
  );

  const simulaIntake = useCallback(() => {
    const nuovo = generaLavoroIntakeDemo(contatoreIntake);
    setContatoreIntake((n) => n + 1);
    setLavori((prev) => [nuovo, ...prev]);
    return nuovo.id;
  }, [contatoreIntake]);

  const value = useMemo(
    () => ({ lavori, validaDocumento, confermaTariffa, segnaFatturato, registraSollecito, simulaIntake }),
    [lavori, validaDocumento, confermaTariffa, segnaFatturato, registraSollecito, simulaIntake]
  );

  return <DocumentiContext.Provider value={value}>{children}</DocumentiContext.Provider>;
}

export function useDocumentiTrasporto() {
  const ctx = useContext(DocumentiContext);
  if (!ctx) throw new Error("useDocumentiTrasporto deve essere usato dentro <DocumentiProvider>");
  return ctx;
}
