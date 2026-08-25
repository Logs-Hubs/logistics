"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { FaseOperativa, Spedizione, StatoAppuntamento, Terminal, Vettore } from "./data";
import {
  prenotaAppuntamento as confermaAppuntamentoAction,
  segnalaRitiro as segnalaRitiroAction,
  segnalaRientroVuoto as segnalaRientroVuotoAction,
} from "@/app/actions";

type Override = Partial<
  Pick<Spedizione, "stato" | "oraAppuntamento" | "dataAppuntamento" | "faseOperativa" | "oraRitiro" | "oraRientroVuoto">
>;

type OperationsContextValue = {
  /** Spedizioni cosi' come caricate da Supabase all'avvio, con sopra gli aggiornamenti ottimistici fatti a runtime */
  spedizioni: Spedizione[];
  terminals: Terminal[];
  vettori: Vettore[];
  /** Id dell'ultima spedizione aggiornata, per far pulsare la card giusta per ~6s */
  ultimoAggiornatoId: string | null;
  confermaAppuntamento: (spedizioneId: string, oraAppuntamento: string, dataAppuntamento: string) => void;
  segnalaRitiro: (spedizioneId: string, ora: string) => void;
  segnalaRientroVuoto: (spedizioneId: string, ora: string) => void;
};

const OperationsContext = createContext<OperationsContextValue | null>(null);

export function OperationsProvider({
  spedizioniIniziali,
  terminals,
  vettori,
  children,
}: {
  spedizioniIniziali: Spedizione[];
  terminals: Terminal[];
  vettori: Vettore[];
  children: ReactNode;
}) {
  const [overrides, setOverrides] = useState<Record<string, Override>>({});
  const [ultimoAggiornatoId, setUltimoAggiornatoId] = useState<string | null>(null);

  const applyOverride = useCallback((spedizioneId: string, patch: Override) => {
    setOverrides((prev) => ({ ...prev, [spedizioneId]: { ...prev[spedizioneId], ...patch } }));
    setUltimoAggiornatoId(spedizioneId);
    window.setTimeout(() => {
      setUltimoAggiornatoId((current) => (current === spedizioneId ? null : current));
    }, 6000);
  }, []);

  // Aggiornamento ottimistico immediato in UI + scrittura reale su Supabase in background.
  // Se la scrittura fallisce logghiamo soltanto: l'utente vede comunque lo stato ottimistico,
  // coerente con com'era gia' il comportamento del calendario prima di questa integrazione.
  const confermaAppuntamento = useCallback(
    (spedizioneId: string, oraAppuntamento: string, dataAppuntamento: string) => {
      applyOverride(spedizioneId, { stato: "confermato" as StatoAppuntamento, oraAppuntamento, dataAppuntamento });
      confermaAppuntamentoAction(spedizioneId, dataAppuntamento, oraAppuntamento).catch((err) =>
        console.error("Errore nel salvataggio della conferma appuntamento su Supabase:", err)
      );
    },
    [applyOverride]
  );

  const segnalaRitiro = useCallback(
    (spedizioneId: string, ora: string) => {
      applyOverride(spedizioneId, { faseOperativa: "ritirato" as FaseOperativa, oraRitiro: ora });
      segnalaRitiroAction(spedizioneId, ora).catch((err) =>
        console.error("Errore nel salvataggio del ritiro su Supabase:", err)
      );
    },
    [applyOverride]
  );

  const segnalaRientroVuoto = useCallback(
    (spedizioneId: string, ora: string) => {
      applyOverride(spedizioneId, { faseOperativa: "rientro_vuoto" as FaseOperativa, oraRientroVuoto: ora });
      segnalaRientroVuotoAction(spedizioneId, ora).catch((err) =>
        console.error("Errore nel salvataggio del rientro vuoto su Supabase:", err)
      );
    },
    [applyOverride]
  );

  const spedizioni = spedizioniIniziali.map((s) => (overrides[s.id] ? { ...s, ...overrides[s.id] } : s));

  return (
    <OperationsContext.Provider
      value={{ spedizioni, terminals, vettori, ultimoAggiornatoId, confermaAppuntamento, segnalaRitiro, segnalaRientroVuoto }}
    >
      {children}
    </OperationsContext.Provider>
  );
}

export function useOperations() {
  const ctx = useContext(OperationsContext);
  if (!ctx) throw new Error("useOperations deve essere usato dentro <OperationsProvider>");
  return ctx;
}
