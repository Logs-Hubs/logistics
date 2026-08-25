"use client";

import { useState } from "react";
import { ORARI_SLOT, generaSlot, vettoreById, type Slot, type SlotStato } from "@/lib/data";
import { useOperations } from "@/lib/store";
import { cn } from "@/lib/utils";
import { CheckCircle2, X, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const GIORNI = ["2026-08-25", "2026-08-26", "2026-08-27", "2026-08-28"];
const GIORNI_LABEL: Record<string, string> = {
  "2026-08-25": "Lun 25 ago",
  "2026-08-26": "Mar 26 ago",
  "2026-08-27": "Mer 27 ago",
  "2026-08-28": "Gio 28 ago",
};

const STATO_STYLE: Record<SlotStato, string> = {
  libero: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 cursor-pointer",
  quasi_pieno: "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200 cursor-pointer",
  pieno: "bg-rose-50 text-rose-500 border-rose-200 cursor-not-allowed opacity-80",
};

export function CalendarioClient() {
  const { spedizioni, terminals, vettori, confermaAppuntamento } = useOperations();
  const [giornoIdx, setGiornoIdx] = useState(1); // default: martedì 26, giorno con più slot liberi
  const giorno = GIORNI[giornoIdx];
  const [slotsPerGiorno, setSlotsPerGiorno] = useState<Record<string, Slot[]>>(() => {
    const init: Record<string, Slot[]> = {};
    GIORNI.forEach((g) => (init[g] = generaSlot(g, spedizioni, terminals)));
    return init;
  });
  const [dialogSlot, setDialogSlot] = useState<{ terminalId: string; ora: string } | null>(null);
  const [spedizioneSel, setSpedizioneSel] = useState<string>("");
  const [confermaVisibile, setConfermaVisibile] = useState<string | null>(null);

  const slots = slotsPerGiorno[giorno];
  const spedizioniNonPianificate = spedizioni.filter((s) => s.stato !== "confermato");

  function apriSlot(terminalId: string, ora: string, stato: SlotStato) {
    if (stato === "pieno") return;
    setSpedizioneSel("");
    setDialogSlot({ terminalId, ora });
  }

  function confermaPrenotazione() {
    if (!dialogSlot || !spedizioneSel) return;
    setSlotsPerGiorno((prev) => {
      const copia = { ...prev };
      copia[giorno] = copia[giorno].map((s) =>
        s.terminalId === dialogSlot.terminalId && s.ora === dialogSlot.ora
          ? { ...s, stato: "pieno" as SlotStato, spedizioneId: spedizioneSel }
          : s
      );
      return copia;
    });
    confermaAppuntamento(spedizioneSel, dialogSlot.ora, giorno);
    setConfermaVisibile(spedizioneSel);
    setDialogSlot(null);
    setTimeout(() => setConfermaVisibile(null), 3500);
  }

  return (
    <div className="mx-auto max-w-6xl px-8 py-8">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">Appuntamenti</p>
        <h1 className="mt-1 text-2xl font-bold text-navy">Calendario multi-terminal</h1>
        <p className="mt-1 text-sm text-muted">
          Un&apos;unica vista su Genova Porto Vecchio, PSA Prà e Savona-Vado, invece di tre piattaforme separate.
        </p>
      </header>

      {/* selettore giorno */}
      <div className="mb-5 flex items-center gap-2">
        <button
          onClick={() => setGiornoIdx((i) => Math.max(0, i - 1))}
          className="rounded-lg border border-border bg-white p-2 text-muted hover:bg-[#F7F9FA] disabled:opacity-40"
          disabled={giornoIdx === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-navy">
          <CalendarDays className="h-4 w-4 text-teal" />
          {GIORNI_LABEL[giorno]}
        </div>
        <button
          onClick={() => setGiornoIdx((i) => Math.min(GIORNI.length - 1, i + 1))}
          className="rounded-lg border border-border bg-white p-2 text-muted hover:bg-[#F7F9FA] disabled:opacity-40"
          disabled={giornoIdx === GIORNI.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="ml-auto flex items-center gap-4 text-xs text-muted">
          <Legenda colore="bg-emerald-400" label="Libero" />
          <Legenda colore="bg-amber-400" label="Quasi pieno" />
          <Legenda colore="bg-rose-400" label="Pieno" />
        </div>
      </div>

      {/* griglia calendario */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="grid grid-cols-[100px_repeat(3,1fr)] border-b border-border bg-[#F7F9FA] text-xs font-semibold uppercase tracking-wide text-muted">
          <div className="px-4 py-3">Orario</div>
          {terminals.map((t) => (
            <div key={t.id} className="border-l border-border px-4 py-3">
              {t.nome}
            </div>
          ))}
        </div>
        {ORARI_SLOT.map((ora) => (
          <div key={ora} className="grid grid-cols-[100px_repeat(3,1fr)] border-b border-border last:border-0">
            <div className="flex items-center px-4 py-2.5 text-sm font-medium text-muted">{ora}</div>
            {terminals.map((t) => {
              const slot = slots.find((s) => s.terminalId === t.id && s.ora === ora)!;
              const spedizione = slot.spedizioneId ? spedizioni.find((s) => s.id === slot.spedizioneId) : undefined;
              return (
                <div key={t.id} className="border-l border-border px-2 py-1.5">
                  <button
                    onClick={() => apriSlot(t.id, ora, slot.stato)}
                    disabled={slot.stato === "pieno" && !spedizione}
                    className={cn(
                      "flex w-full items-center justify-center rounded-md border px-2 py-2 text-xs font-medium transition-colors",
                      STATO_STYLE[slot.stato]
                    )}
                    title={spedizione ? `${spedizione.id} · ${spedizione.cliente}` : undefined}
                  >
                    {spedizione ? spedizione.id : slot.stato === "pieno" ? "Pieno" : slot.stato === "quasi_pieno" ? "1 posto" : "Libero"}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* dialog prenotazione */}
      {dialogSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-navy">Prenota appuntamento</h3>
                <p className="mt-0.5 text-sm text-muted">
                  {terminals.find((t) => t.id === dialogSlot.terminalId)?.nome} · ore {dialogSlot.ora}
                </p>
              </div>
              <button onClick={() => setDialogSlot(null)} className="text-muted hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="mb-1.5 block text-xs font-medium text-muted">Spedizione / container</label>
            <select
              value={spedizioneSel}
              onChange={(e) => setSpedizioneSel(e.target.value)}
              className="mb-5 w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:border-teal focus:outline-none"
            >
              <option value="">Seleziona una spedizione da pianificare…</option>
              {spedizioniNonPianificate.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id} · {s.cliente} · {s.containerId}
                </option>
              ))}
            </select>

            {spedizioneSel && (
              <div className="mb-5 rounded-lg bg-[#F7F9FA] p-3 text-xs text-muted">
                Vettore assegnato:{" "}
                <span className="font-medium text-foreground">
                  {vettoreById(vettori, spedizioni.find((s) => s.id === spedizioneSel)!.vettoreId)?.nome}
                </span>{" "}
                riceverà una notifica automatica con orario e istruzioni gate.
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDialogSlot(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted hover:bg-[#F7F9FA]"
              >
                Annulla
              </button>
              <button
                onClick={confermaPrenotazione}
                disabled={!spedizioneSel}
                className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                Conferma prenotazione
              </button>
            </div>
          </div>
        </div>
      )}

      {/* toast conferma */}
      {confermaVisibile && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-lg bg-navy px-4 py-3 text-sm font-medium text-white shadow-lg">
          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
          Appuntamento confermato per {confermaVisibile}, notifica inviata al vettore.
        </div>
      )}
    </div>
  );
}

function Legenda({ colore, label }: { colore: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("h-2 w-2 rounded-full", colore)} />
      {label}
    </div>
  );
}
