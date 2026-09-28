"use client";

// Stato client-only del modulo Container: nessun backend, aggiornamenti ottimistici in memoria —
// stesso principio di lib/flotta/store.tsx. L'Exception Center (lib/container/motore.ts) ricalcola
// sempre dagli ordini correnti, mai da un elenco di eccezioni "congelato".
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { AUTISTI_DEMO, MEZZI_DEMO, ORDINI_DEMO } from "./datiDemo";
import { rilevaEccezioniContainer, type EccezioneContainer } from "./motore";
import { readinessCompleta, type Autista, type Mezzo, type OrdineContainer } from "./tipi";

type ContainerContextValue = {
  ordini: OrdineContainer[];
  autisti: Autista[];
  mezzi: Mezzo[];
  eccezioni: EccezioneContainer[];
  trovaOrdine: (id: string) => OrdineContainer | undefined;
  segnalaCarrierRelease: (id: string) => void;
  segnalaCustomsRelease: (id: string) => void;
  segnalaTerminalDisponibile: (id: string) => void;
  prenotaSlot: (id: string, dataOra: string) => void;
  assegnaAutista: (id: string, autistaId: string, mezzoId: string) => void;
  segnalaRitiro: (id: string) => void;
  segnalaConsegna: (id: string, attesaMinuti?: number) => void;
  segnalaRientroVuoto: (id: string) => void;
  segnalaFatturato: (id: string) => void;
};

const ContainerContext = createContext<ContainerContextValue | null>(null);

function adesso(): string {
  return new Date().toISOString();
}

export function ContainerProvider({ children }: { children: ReactNode }) {
  const [ordini, setOrdini] = useState<OrdineContainer[]>(ORDINI_DEMO);

  const aggiorna = useCallback((id: string, patch: Partial<OrdineContainer>) => {
    setOrdini((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch, aggiornatoIl: adesso() } : o)));
  }, []);

  const aggiornaReadiness = useCallback(
    (id: string, patchReadiness: Partial<OrdineContainer["readiness"]>) => {
      setOrdini((prev) =>
        prev.map((o) => {
          if (o.id !== id) return o;
          const readiness = { ...o.readiness, ...patchReadiness };
          const faseOperativa =
            o.faseOperativa === "attesa_readiness" && readinessCompleta(readiness) ? "pronto_dispatch" : o.faseOperativa;
          return { ...o, readiness, faseOperativa, aggiornatoIl: adesso() };
        })
      );
    },
    []
  );

  const segnalaCarrierRelease = useCallback((id: string) => aggiornaReadiness(id, { carrierRelease: true }), [aggiornaReadiness]);
  const segnalaCustomsRelease = useCallback((id: string) => aggiornaReadiness(id, { customsRelease: true }), [aggiornaReadiness]);
  const segnalaTerminalDisponibile = useCallback(
    (id: string) => aggiornaReadiness(id, { terminalDisponibile: true }),
    [aggiornaReadiness]
  );

  const prenotaSlot = useCallback(
    (id: string, dataOra: string) => aggiornaReadiness(id, { slotPrenotato: true, slotDataOra: dataOra }),
    [aggiornaReadiness]
  );

  const assegnaAutista = useCallback(
    (id: string, autistaId: string, mezzoId: string) => aggiorna(id, { autistaId, mezzoId }),
    [aggiorna]
  );

  const segnalaRitiro = useCallback(
    (id: string) => aggiorna(id, { faseOperativa: "in_esecuzione", oraRitiro: adesso() }),
    [aggiorna]
  );

  const segnalaConsegna = useCallback(
    (id: string, attesaMinuti?: number) =>
      aggiorna(id, { faseOperativa: "consegnato", oraConsegna: adesso(), attesaMinuti: attesaMinuti ?? null }),
    [aggiorna]
  );

  const segnalaRientroVuoto = useCallback(
    (id: string) => aggiorna(id, { faseOperativa: "vuoto_rientrato", oraRientroVuoto: adesso() }),
    [aggiorna]
  );

  const segnalaFatturato = useCallback((id: string) => aggiorna(id, { faseOperativa: "fatturato", accessorialDaFatturare: 0 }), [aggiorna]);

  const trovaOrdine = useCallback((id: string) => ordini.find((o) => o.id === id), [ordini]);

  const eccezioni = useMemo(() => rilevaEccezioniContainer(ordini), [ordini]);

  const value = useMemo(
    () => ({
      ordini,
      autisti: AUTISTI_DEMO,
      mezzi: MEZZI_DEMO,
      eccezioni,
      trovaOrdine,
      segnalaCarrierRelease,
      segnalaCustomsRelease,
      segnalaTerminalDisponibile,
      prenotaSlot,
      assegnaAutista,
      segnalaRitiro,
      segnalaConsegna,
      segnalaRientroVuoto,
      segnalaFatturato,
    }),
    [
      ordini,
      eccezioni,
      trovaOrdine,
      segnalaCarrierRelease,
      segnalaCustomsRelease,
      segnalaTerminalDisponibile,
      prenotaSlot,
      assegnaAutista,
      segnalaRitiro,
      segnalaConsegna,
      segnalaRientroVuoto,
      segnalaFatturato,
    ]
  );

  return <ContainerContext.Provider value={value}>{children}</ContainerContext.Provider>;
}

export function useContainer() {
  const ctx = useContext(ContainerContext);
  if (!ctx) throw new Error("useContainer deve essere usato dentro <ContainerProvider>");
  return ctx;
}
