"use client";

import { useState } from "react";
import { ORARI_SLOT, daysUntil, generaSlot, terminalNome, vettoreById, type Slot, type SlotStato } from "@/lib/data";
import { useOperations } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, X, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

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
  const { spedizioni, terminals, vettori, confermaAppuntamento, annullaAppuntamento } = useOperations();
  const [giornoIdx, setGiornoIdx] = useState(1); // default: martedì 26, giorno con più slot liberi
  const giorno = GIORNI[giornoIdx];
  const [slotsPerGiorno, setSlotsPerGiorno] = useState<Record<string, Slot[]>>(() => {
    const init: Record<string, Slot[]> = {};
    GIORNI.forEach((g) => (init[g] = generaSlot(g, spedizioni, terminals)));
    return init;
  });
  const [dialogSlot, setDialogSlot] = useState<{ terminalId: string; ora: string } | null>(null);
  const [spedizioneSel, setSpedizioneSel] = useState<string>("");
  const [dettaglioSpedizioneId, setDettaglioSpedizioneId] = useState<string | null>(null);
  const [confermaVisibile, setConfermaVisibile] = useState<string | null>(null);
  const [annullatoVisibile, setAnnullatoVisibile] = useState<string | null>(null);

  const slots = slotsPerGiorno[giorno];
  const spedizioniNonPianificate = [...spedizioni]
    .filter((s) => s.stato !== "confermato")
    .sort((a, b) => daysUntil(a.scadenzaDemurrage) - daysUntil(b.scadenzaDemurrage));
  const spedizioniUrgenti = spedizioniNonPianificate.filter((s) => daysUntil(s.scadenzaDemurrage) <= 2);
  const dettaglioSpedizione = dettaglioSpedizioneId ? spedizioni.find((s) => s.id === dettaglioSpedizioneId) : undefined;

  function apriSlot(terminalId: string, ora: string, stato: SlotStato, spedizioneId: string | undefined) {
    if (stato === "pieno") {
      if (spedizioneId) setDettaglioSpedizioneId(spedizioneId);
      return;
    }
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

  function annullaPrenotazione() {
    if (!dettaglioSpedizione) return;
    const spedizioneId = dettaglioSpedizione.id;
    setSlotsPerGiorno((prev) => {
      const copia = { ...prev };
      copia[giorno] = copia[giorno].map((s) =>
        s.spedizioneId === spedizioneId ? { ...s, stato: "libero" as SlotStato, spedizioneId: undefined } : s
      );
      return copia;
    });
    annullaAppuntamento(spedizioneId);
    setDettaglioSpedizioneId(null);
    setAnnullatoVisibile(spedizioneId);
    setTimeout(() => setAnnullatoVisibile(null), 3500);
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

      {/* alert scadenze demurrage */}
      {spedizioniUrgenti.length > 0 && (
        <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-rose-700">
            <AlertTriangle className="h-4 w-4" />
            {spedizioniUrgenti.length === 1
              ? "1 spedizione rischia la scadenza demurrage"
              : `${spedizioniUrgenti.length} spedizioni rischiano la scadenza demurrage`}
          </div>
          <ul className="space-y-1 text-xs text-rose-700/90">
            {spedizioniUrgenti.map((s) => {
              const gg = daysUntil(s.scadenzaDemurrage);
              return (
                <li key={s.id} className="flex items-center justify-between gap-3">
                  <span>
                    <span className="font-medium">{s.id}</span> · {s.cliente} · {s.containerId}
                  </span>
                  <span className="whitespace-nowrap font-medium">
                    {gg < 0 ? "scaduta" : gg === 0 ? "scade oggi" : `scade tra ${gg}gg`}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

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
                    onClick={() => apriSlot(t.id, ora, slot.stato, slot.spedizioneId)}
                    disabled={slot.stato === "pieno" && !spedizione}
                    className={cn(
                      "flex w-full items-center justify-center rounded-md border px-2 py-2 text-xs font-medium transition-colors",
                      STATO_STYLE[slot.stato],
                      spedizione && "cursor-pointer opacity-100 hover:bg-rose-100"
                    )}
                    title={spedizione ? `${spedizione.id} · ${spedizione.cliente} · clicca per modificare` : undefined}
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
              {spedizioniNonPianificate.map((s) => {
                const gg = daysUntil(s.scadenzaDemurrage);
                const urgenza = gg <= 2 ? ` · ${gg < 0 ? "scaduta" : gg === 0 ? "scade oggi" : `scade tra ${gg}gg`}` : "";
                return (
                  <option key={s.id} value={s.id}>
                    {s.id} · {s.cliente} · {s.containerId}
                    {urgenza}
                  </option>
                );
              })}
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

      {/* dialog dettaglio/annullamento appuntamento confermato */}
      {dettaglioSpedizione && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-navy">Appuntamento confermato</h3>
                <p className="mt-0.5 text-sm text-muted">
                  {terminalNome(terminals, dettaglioSpedizione.terminalId)} · ore {dettaglioSpedizione.oraAppuntamento}
                </p>
              </div>
              <button onClick={() => setDettaglioSpedizioneId(null)} className="text-muted hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-5 rounded-lg bg-[#F7F9FA] p-3 text-xs text-muted">
              <div className="mb-1 text-sm font-medium text-foreground">
                {dettaglioSpedizione.id} · {dettaglioSpedizione.cliente}
              </div>
              Container {dettaglioSpedizione.containerId} · Vettore{" "}
              {vettoreById(vettori, dettaglioSpedizione.vettoreId)?.nome}
            </div>

            <p className="mb-5 text-xs text-muted">
              Per spostarlo su un altro orario o terminal, annulla l&apos;appuntamento e riprenotalo sullo slot
              giusto: il vettore riceverà la nuova notifica automatica.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDettaglioSpedizioneId(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted hover:bg-[#F7F9FA]"
              >
                Chiudi
              </button>
              <button
                onClick={annullaPrenotazione}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
              >
                Annulla appuntamento
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

      {/* toast annullamento */}
      {annullatoVisibile && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-lg bg-navy px-4 py-3 text-sm font-medium text-white shadow-lg">
          <AlertTriangle className="h-4.5 w-4.5 text-amber-400" />
          Appuntamento annullato per {annullatoVisibile}, torna tra le spedizioni da pianificare.
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
