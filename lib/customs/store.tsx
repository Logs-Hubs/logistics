"use client";

// Stato del modulo Dogana: interamente locale (nessun Supabase dietro, come il modulo Flotte),
// ma condiviso tra dashboard e dettaglio caso tramite Context montato in app/customs/layout.tsx —
// così un caso creato dalla simulazione di intake sulla dashboard esiste ancora quando si naviga
// al suo dettaglio, senza dover passare per un backend.
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { CasoDoganale } from "./tipi";
import { CASI_DEMO } from "./datiDemo";
import { generaCasoIntakeDemo } from "./motore";

type CustomsContextValue = {
  casi: CasoDoganale[];
  risolviProblema: (casoId: string, problemaId: string) => void;
  approvaClassificazione: (casoId: string, merceId: string) => void;
  modificaClassificazione: (casoId: string, merceId: string, nuovoHsCode: string) => void;
  registraRichiestaInformazioni: (casoId: string, problemaId: string) => void;
  simulaIntake: () => string;
};

const CustomsContext = createContext<CustomsContextValue | null>(null);

function timestamp() {
  return new Date().toISOString();
}

export function CustomsProvider({ children }: { children: ReactNode }) {
  const [casi, setCasi] = useState<CasoDoganale[]>(CASI_DEMO);
  const [contatoreIntake, setContatoreIntake] = useState(1);

  const aggiornaCaso = useCallback((casoId: string, aggiorna: (c: CasoDoganale) => CasoDoganale) => {
    setCasi((prev) => prev.map((c) => (c.id === casoId ? aggiorna(c) : c)));
  }, []);

  const risolviProblema = useCallback(
    (casoId: string, problemaId: string) => {
      aggiornaCaso(casoId, (c) => ({
        ...c,
        problemi: c.problemi.map((p) => (p.id === problemaId ? { ...p, stato: "risolto" } : p)),
        attivita: [
          { id: `${casoId}-A${c.attivita.length + 1}`, quando: timestamp(), testo: `Problema risolto: ${c.problemi.find((p) => p.id === problemaId)?.titolo ?? problemaId}.`, fonte: "operatore" },
          ...c.attivita,
        ],
        aggiornatoIl: timestamp(),
      }));
    },
    [aggiornaCaso]
  );

  const approvaClassificazione = useCallback(
    (casoId: string, merceId: string) => {
      aggiornaCaso(casoId, (c) => ({
        ...c,
        merci: c.merci.map((m) =>
          m.id === merceId ? { ...m, statoClassificazione: "approvata", hsCodeApprovato: m.hsCodeSuggerito } : m
        ),
        attivita: [
          { id: `${casoId}-A${c.attivita.length + 1}`, quando: timestamp(), testo: `Classificazione HS approvata per: ${c.merci.find((m) => m.id === merceId)?.descrizione ?? merceId}.`, fonte: "operatore" },
          ...c.attivita,
        ],
        aggiornatoIl: timestamp(),
      }));
    },
    [aggiornaCaso]
  );

  const modificaClassificazione = useCallback(
    (casoId: string, merceId: string, nuovoHsCode: string) => {
      aggiornaCaso(casoId, (c) => ({
        ...c,
        merci: c.merci.map((m) => (m.id === merceId ? { ...m, statoClassificazione: "approvata", hsCodeApprovato: nuovoHsCode } : m)),
        attivita: [
          { id: `${casoId}-A${c.attivita.length + 1}`, quando: timestamp(), testo: `Classificazione HS corretta manualmente in ${nuovoHsCode}.`, fonte: "operatore" },
          ...c.attivita,
        ],
        aggiornatoIl: timestamp(),
      }));
    },
    [aggiornaCaso]
  );

  const registraRichiestaInformazioni = useCallback(
    (casoId: string, problemaId: string) => {
      aggiornaCaso(casoId, (c) => ({
        ...c,
        attivita: [
          { id: `${casoId}-A${c.attivita.length + 1}`, quando: timestamp(), testo: `Bozza di richiesta informazioni preparata per: ${c.problemi.find((p) => p.id === problemaId)?.titolo ?? problemaId}.`, fonte: "operatore" },
          ...c.attivita,
        ],
      }));
    },
    [aggiornaCaso]
  );

  const simulaIntake = useCallback(() => {
    const nuovoCaso = generaCasoIntakeDemo(contatoreIntake);
    setContatoreIntake((n) => n + 1);
    setCasi((prev) => [nuovoCaso, ...prev]);
    return nuovoCaso.id;
  }, [contatoreIntake]);

  const value = useMemo(
    () => ({ casi, risolviProblema, approvaClassificazione, modificaClassificazione, registraRichiestaInformazioni, simulaIntake }),
    [casi, risolviProblema, approvaClassificazione, modificaClassificazione, registraRichiestaInformazioni, simulaIntake]
  );

  return <CustomsContext.Provider value={value}>{children}</CustomsContext.Provider>;
}

export function useCustoms() {
  const ctx = useContext(CustomsContext);
  if (!ctx) throw new Error("useCustoms deve essere usato dentro <CustomsProvider>");
  return ctx;
}
