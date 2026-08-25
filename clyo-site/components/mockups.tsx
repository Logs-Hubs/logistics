import { Bell, MapPin, Package, Navigation, CheckCircle2, Undo2 } from "lucide-react";

// Mockup illustrativi fedeli alla UI reale del prodotto — non screenshot, ma la stessa
// struttura visiva (stessa palette, stesse card, stesso frame telefono) usata nell'app.

export function PhoneMockup() {
  return (
    <div className="mx-auto w-full max-w-[260px] overflow-hidden rounded-[1.75rem] border-[6px] border-navy-dark bg-white shadow-2xl">
      <div className="flex items-center justify-between bg-navy-dark px-4 py-1.5 text-[9px] text-white/70">
        <span>9:41</span>
        <span>Clyo</span>
      </div>
      <div className="bg-[#F7F9FA] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted">Ciao,</p>
            <p className="text-sm font-bold text-navy">Andrei Popescu</p>
          </div>
          <div className="relative rounded-full bg-white p-1.5 shadow-sm">
            <Bell className="h-3.5 w-3.5 text-navy" />
            <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-accent" />
          </div>
        </div>
        <div className="rounded-xl bg-navy p-3.5 text-white shadow-md">
          <p className="text-[8.5px] uppercase tracking-wide text-teal-light">Prossimo appuntamento</p>
          <p className="mt-0.5 text-lg font-bold">14:00</p>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-teal-light">
            <MapPin className="h-3 w-3" />
            PSA Genova Prà
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[10px] text-teal-light">
            <Package className="h-3 w-3" />
            HLXU 990112-7
          </div>
          <div className="mt-2.5 flex items-center justify-center gap-1.5 rounded-lg bg-accent py-2 text-[10px] font-semibold text-white">
            <Navigation className="h-3 w-3" />
            Segnala arrivo al gate
          </div>
        </div>
        <div className="mt-3 rounded-xl bg-white p-3 shadow-sm">
          <p className="mb-1.5 text-[9px] font-semibold text-navy">Istruzioni per il gate</p>
          <div className="space-y-1 text-[8.5px] text-muted">
            <p>• Documento di trasporto + targa GE EF330</p>
            <p>• Container HLXU 990112-7</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const TERMINALI = ["Porto Vecchio", "PSA Prà", "Savona-Vado"];
const RIGHE = [
  { ora: "08:00", stati: ["pieno", "libero", "quasi"] },
  { ora: "09:00", stati: ["quasi", "pieno", "libero"] },
  { ora: "10:00", stati: ["libero", "libero", "pieno"] },
  { ora: "14:00", stati: ["pieno", "quasi", "libero"] },
] as const;

const STILE_STATO: Record<string, string> = {
  libero: "bg-emerald-50 text-emerald-700 border-emerald-200",
  quasi: "bg-amber-50 text-amber-700 border-amber-200",
  pieno: "bg-rose-50 text-rose-500 border-rose-200",
};

export function CalendarMockup() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xl">
      <div className="grid grid-cols-[64px_repeat(3,1fr)] border-b border-border bg-[#F7F9FA] text-[9px] font-semibold uppercase tracking-wide text-muted">
        <div className="px-2.5 py-2">Orario</div>
        {TERMINALI.map((t) => (
          <div key={t} className="border-l border-border px-2.5 py-2 truncate">
            {t}
          </div>
        ))}
      </div>
      {RIGHE.map((riga) => (
        <div key={riga.ora} className="grid grid-cols-[64px_repeat(3,1fr)] border-b border-border last:border-0">
          <div className="flex items-center px-2.5 py-1.5 text-[10px] font-medium text-muted">{riga.ora}</div>
          {riga.stati.map((stato, i) => (
            <div key={i} className="border-l border-border px-1.5 py-1">
              <div className={`rounded-md border px-1.5 py-1.5 text-center text-[8.5px] font-medium ${STILE_STATO[stato]}`}>
                {stato === "libero" ? "Libero" : stato === "quasi" ? "1 posto" : "Pieno"}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const STEP_TIMELINE = [
  { label: "Appuntamento gate terminal", stato: "done" as const },
  { label: "Ritiro container dal terminal", stato: "done" as const, nota: "Targa mezzo tracciata al gate" },
  { label: "Consegna al cliente", stato: "pending" as const },
  { label: "Rientro container vuoto al terminal", stato: "current" as const, nota: "Flusso che il PCS oggi non traccia — qui invece sì" },
];

export function TimelineMockup() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-xl">
      <p className="mb-3 text-[10px] font-semibold text-navy">Ciclo di vita della spedizione</p>
      <ol className="space-y-0">
        {STEP_TIMELINE.map((ev, i) => (
          <li key={ev.label} className="relative flex gap-2.5 pb-3.5 last:pb-0">
            {i < STEP_TIMELINE.length - 1 && (
              <span
                className={`absolute left-[7px] top-4 h-full w-px ${ev.stato === "done" ? "bg-teal" : "bg-border"}`}
              />
            )}
            <span className="relative z-10 mt-0.5 flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full bg-white">
              {ev.stato === "done" ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-teal" />
              ) : ev.stato === "current" ? (
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-accent">
                  <span className="h-1 w-1 rounded-full bg-accent" />
                </span>
              ) : (
                <span className="h-3.5 w-3.5 rounded-full border-2 border-border" />
              )}
            </span>
            <div>
              <p className={`text-[10.5px] font-medium ${ev.stato === "pending" ? "text-muted" : "text-foreground"}`}>{ev.label}</p>
              {ev.nota && <p className="mt-0.5 text-[9px] text-amber-700">{ev.nota}</p>}
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-accent/10 py-2 text-[9.5px] font-semibold text-accent-dark">
        <Undo2 className="h-3 w-3" />
        Segnala rientro container vuoto
      </div>
    </div>
  );
}

export function DashboardMockup() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
      <div className="flex items-center justify-between border-b border-border bg-[#F7F9FA] px-5 py-3">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wider text-accent">Dashboard</p>
          <p className="text-sm font-bold text-navy">Buongiorno — ecco la situazione di oggi</p>
        </div>
        <div className="hidden gap-1.5 sm:flex">
          {TERMINALI.map((t) => (
            <span key={t} className="rounded-full border border-border bg-white px-2 py-1 text-[9px] font-medium text-muted">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
        {[
          { v: "7", l: "Spedizioni attive", c: "text-navy" },
          { v: "3", l: "Da pianificare", c: "text-amber-600" },
          { v: "3", l: "In scadenza", c: "text-rose-600" },
          { v: "4", l: "Confermati", c: "text-emerald-600" },
        ].map((s) => (
          <div key={s.l} className="rounded-lg border border-border bg-white p-3">
            <div className={`text-lg font-bold ${s.c}`}>{s.v}</div>
            <div className="text-[9px] text-muted">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 pt-0 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-lg border border-border">
          {[
            { id: "SP-2461", cliente: "Ansaldo Componenti SpA", stato: "Confermato", colore: "bg-emerald-50 text-emerald-700" },
            { id: "SP-2462", cliente: "Costa Caffè Import", stato: "Da pianificare", colore: "bg-amber-50 text-amber-700" },
            { id: "SP-2463", cliente: "Recchi Marmi Export", stato: "In ritardo", colore: "bg-rose-50 text-rose-700" },
          ].map((r) => (
            <div key={r.id} className="flex items-center justify-between border-b border-border bg-white px-3 py-2 text-[10px] last:border-0">
              <span className="font-semibold text-navy">{r.id}</span>
              <span className="hidden text-foreground sm:inline">{r.cliente}</span>
              <span className={`rounded-full px-2 py-0.5 font-medium ${r.colore}`}>{r.stato}</span>
            </div>
          ))}
        </div>
        <div className="hidden lg:block">
          <PhoneMockup />
        </div>
      </div>
    </div>
  );
}
