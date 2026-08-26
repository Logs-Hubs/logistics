"use client";

import { useMemo, useState } from "react";
import {
  Truck,
  AlertTriangle,
  Sparkles,
  Undo2,
  Clock3,
  CheckCircle2,
  MessageCircleQuestion,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AUTISTI, CARICHI_SPOT, MEZZI, ORDINI } from "@/lib/flotta/datiDemo";
import {
  applicaAzione,
  calcolaKpi,
  pianificaBase,
  pianificaOttimizzato,
  rilevaProblemi,
  simulaRitardo,
  type RacconteEccezione,
} from "@/lib/flotta/pianificatore";
import type { Piano, Problema } from "@/lib/flotta/tipi";

const DOMANDE_PRECONFEZIONATE = [
  "Cosa devo sistemare oggi?",
  "Dove sto perdendo margine?",
  "Quali viaggi stanno tornando vuoti?",
  "Qual è il criterio con cui assegnate i mezzi?",
];

function euro(n: number) {
  return n.toLocaleString("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

export function FlottaClient() {
  const pianoBase = useMemo(() => pianificaBase(ORDINI, MEZZI, AUTISTI), []);
  const problemiBase = useMemo(() => rilevaProblemi(pianoBase, ORDINI, MEZZI, AUTISTI, CARICHI_SPOT), [pianoBase]);

  const [ottimizzato, setOttimizzato] = useState(false);
  const [piano, setPiano] = useState<Piano>(pianoBase);
  const [problemi, setProblemi] = useState<Problema[]>(problemiBase);
  const [eccezione, setEccezione] = useState<RacconteEccezione | null>(null);
  const [rispostaAI, setRispostaAI] = useState<{ domanda: string; risposta: string } | null>(null);

  const kpi = calcolaKpi(piano);
  const kpiBase = calcolaKpi(pianoBase);

  const problemiAperti = problemi.filter((p) => !p.risolto);
  const denaroARischio = problemiAperti.reduce((s, p) => s + Math.max(0, p.impattoEuro), 0);
  const denaroRecuperato = problemi.filter((p) => p.risolto).reduce((s, p) => s + Math.max(0, p.impattoEuro), 0);
  const backhaul = problemi.filter((p) => p.tipo === "reso_vuoto" && p.azione && !p.risolto);

  function ottimizzaOggi() {
    const nuovoPiano = pianificaOttimizzato(ORDINI, MEZZI, AUTISTI);
    setPiano(nuovoPiano);
    setProblemi(rilevaProblemi(nuovoPiano, ORDINI, MEZZI, AUTISTI, CARICHI_SPOT));
    setOttimizzato(true);
    setEccezione(null);
  }

  function applicaProblema(problema: Problema) {
    if (!problema.azione) return;
    const nuovoPiano = applicaAzione(piano, problema.azione, ORDINI, MEZZI, AUTISTI, CARICHI_SPOT);
    setPiano(nuovoPiano);
    setProblemi((prev) => prev.map((p) => (p.id === problema.id ? { ...p, risolto: true } : p)));
  }

  function simula() {
    const minuti = 45 + Math.round((piano.mezzi.length * 7) % 50); // variazione deterministica, non casuale
    const racconto = simulaRitardo(piano, ORDINI, MEZZI, minuti);
    setEccezione(racconto);
    if (racconto?.problema) {
      setProblemi((prev) => [racconto.problema!, ...prev.filter((p) => p.id !== racconto.problema!.id)]);
    }
  }

  function chiedi(domanda: string) {
    setRispostaAI({ domanda, risposta: rispostaPer(domanda, problemiAperti, kpi, backhaul.length) });
  }

  return (
    <div className="mx-auto max-w-7xl px-8 py-8">
      <header className="mb-8">
        <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy">
          <Sparkles className="h-3.5 w-3.5" />
          AI Transport Manager · verticale in valutazione
        </p>
        <h1 className="text-2xl font-bold text-navy">Centro comando flotta</h1>
        <p className="mt-1 text-sm text-muted">
          Autotrasportatori PMI, non spedizionieri doganali: dati e logica separati da Clyo, stesso repo per la demo.
        </p>
      </header>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard icon={Truck} label="Mezzi in flotta" value={String(MEZZI.length)} color="text-navy" bg="bg-navy/5" />
        <StatCard icon={ArrowRight} label="Consegne oggi" value={String(ORDINI.length)} color="text-navy" bg="bg-navy/5" />
        <StatCard icon={AlertTriangle} label="A rischio" value={euro(denaroARischio)} color="text-rose-600" bg="bg-rose-50" />
        <StatCard icon={CheckCircle2} label="Recuperato" value={euro(denaroRecuperato)} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard icon={Undo2} label="Rientri da coprire" value={String(backhaul.length)} color="text-amber-600" bg="bg-amber-50" />
      </div>

      {!ottimizzato ? (
        <div className="mb-8 rounded-2xl bg-navy p-8 text-center text-white shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-light">Piano di oggi non ancora ottimizzato</p>
          <p className="mx-auto mt-2 max-w-lg text-sm text-teal-light/90">
            Il piano attuale è quello che un dispacciatore otterrebbe assegnando gli ordini a mano, mezzo per mezzo,
            senza incatenare le tappe per ridurre i km a vuoto.
          </p>
          <button
            onClick={ottimizzaOggi}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-dark"
          >
            <Sparkles className="h-4 w-4" />
            Ottimizza oggi
          </button>
        </div>
      ) : (
        <ConfrontoPrimaOpo kpiBase={kpiBase} kpi={kpi} problemiBase={problemiBase.length} problemiOra={problemiAperti.length} />
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              Problemi rilevati ({problemiAperti.length})
            </h2>
            {problemiAperti.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted">
                Nessun problema aperto nel piano attuale.
              </div>
            ) : (
              <div className="space-y-3">
                {problemiAperti.map((p) => (
                  <ProblemaCard key={p.id} problema={p} onApplica={() => applicaProblema(p)} />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
              <Undo2 className="h-3.5 w-3.5" />
              AI Backhaul Finder
            </h2>
            {backhaul.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted">
                Nessun rientro a vuoto copribile al momento con i carichi spot disponibili.
              </div>
            ) : (
              <div className="space-y-3">
                {backhaul.map((p) => (
                  <ProblemaCard key={p.id} problema={p} onApplica={() => applicaProblema(p)} />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
              <Clock3 className="h-3.5 w-3.5" />
              AI Exception Manager
            </h2>
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <p className="mb-3 text-sm text-muted">
                Simula un ritardo su uno dei mezzi con più tappe e guarda come l&apos;AI ricalcola il giro.
              </p>
              <button
                onClick={simula}
                className="mb-4 rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-dark"
              >
                Simula ritardo camion
              </button>
              {eccezione && (
                <div className="space-y-2 rounded-lg bg-[#F7F9FA] p-4">
                  {eccezione.passi.map((passo, i) => (
                    <p key={i} className="text-xs leading-relaxed text-foreground">
                      <span className="font-semibold text-navy">{i + 1}.</span> {passo}
                    </p>
                  ))}
                  {eccezione.problema && (
                    <button
                      onClick={() => applicaProblema(eccezione.problema!)}
                      className="mt-2 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-dark"
                    >
                      Applica lo spostamento
                    </button>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy">
              <MessageCircleQuestion className="h-4 w-4 text-accent" />
              Chiedi all&apos;AI
            </h2>
            <div className="space-y-1.5">
              {DOMANDE_PRECONFEZIONATE.map((d) => (
                <button
                  key={d}
                  onClick={() => chiedi(d)}
                  className="w-full rounded-lg border border-border px-3 py-2 text-left text-xs text-foreground hover:bg-[#F7F9FA]"
                >
                  {d}
                </button>
              ))}
            </div>
            {rispostaAI && (
              <div className="mt-4 rounded-lg bg-navy p-4 text-xs leading-relaxed text-teal-light">
                <p className="mb-1.5 font-semibold text-white">{rispostaAI.domanda}</p>
                {rispostaAI.risposta}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-5 text-xs text-muted shadow-sm">
            <p className="mb-1.5 font-semibold text-navy">Come funziona il motore</p>
            <p>
              Assegnazione e calcolo km/margine sono deterministici (nessuna chiamata a un LLM in questa demo): un
              vero prodotto userebbe l&apos;IA per capire ordini non strutturati e spiegare le decisioni, lasciando
              vincoli e routing a un motore di ottimizzazione dedicato.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className={cn("mb-2 flex h-8 w-8 items-center justify-center rounded-lg", bg)}>
        <Icon className={cn("h-4 w-4", color)} />
      </div>
      <div className="text-lg font-bold text-navy">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}

function ConfrontoPrimaOpo({
  kpiBase,
  kpi,
  problemiBase,
  problemiOra,
}: {
  kpiBase: ReturnType<typeof calcolaKpi>;
  kpi: ReturnType<typeof calcolaKpi>;
  problemiBase: number;
  problemiOra: number;
}) {
  const righe = [
    { label: "Km a vuoto", prima: `${kpiBase.kmVuoti} km`, dopo: `${kpi.kmVuoti} km`, migliora: kpi.kmVuoti < kpiBase.kmVuoti },
    {
      label: "Utilizzo mezzi",
      prima: `${Math.round(kpiBase.utilizzoMezzi * 100)}%`,
      dopo: `${Math.round(kpi.utilizzoMezzi * 100)}%`,
      migliora: kpi.utilizzoMezzi > kpiBase.utilizzoMezzi,
    },
    { label: "Margine stimato", prima: euro(kpiBase.margine), dopo: euro(kpi.margine), migliora: kpi.margine > kpiBase.margine },
    { label: "Problemi aperti", prima: String(problemiBase), dopo: String(problemiOra), migliora: problemiOra < problemiBase },
  ];

  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="grid grid-cols-4 border-b border-border bg-[#F7F9FA] text-xs font-semibold uppercase tracking-wide text-muted">
        <div className="px-4 py-3">Metrica</div>
        <div className="px-4 py-3">Piano manuale</div>
        <div className="px-4 py-3">Piano ottimizzato AI</div>
        <div className="px-4 py-3">Variazione</div>
      </div>
      {righe.map((r) => (
        <div key={r.label} className="grid grid-cols-4 border-b border-border text-sm last:border-0">
          <div className="px-4 py-3 font-medium text-navy">{r.label}</div>
          <div className="px-4 py-3 text-muted">{r.prima}</div>
          <div className="px-4 py-3 font-medium text-foreground">{r.dopo}</div>
          <div className={cn("px-4 py-3 font-semibold", r.migliora ? "text-emerald-600" : "text-muted")}>
            {r.migliora ? "Migliora" : "Invariato"}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProblemaCard({ problema, onApplica }: { problema: Problema; onApplica: () => void }) {
  const positivo = problema.impattoEuro >= 0;
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-navy">{problema.titolo}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted">{problema.descrizione}</p>
        </div>
        <span className={cn("whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold", positivo ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600")}>
          {positivo ? "+" : ""}
          {euro(problema.impattoEuro)}
        </span>
      </div>
      <div className="mt-3 flex justify-end">
        <button
          onClick={onApplica}
          disabled={!problema.azione}
          className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-40"
          title={problema.azione ? undefined : "Nessuna azione automatica disponibile per questo problema"}
        >
          Applica
        </button>
      </div>
    </div>
  );
}

function rispostaPer(
  domanda: string,
  problemiAperti: Problema[],
  kpi: ReturnType<typeof calcolaKpi>,
  numeroBackhaul: number
): string {
  const top3 = [...problemiAperti].sort((a, b) => b.impattoEuro - a.impattoEuro).slice(0, 3);

  if (domanda === "Cosa devo sistemare oggi?") {
    if (top3.length === 0) return "Il piano attuale non ha problemi aperti da sistemare.";
    return `I 3 problemi con impatto più alto ora sono: ${top3.map((p) => `${p.titolo} (${euro(p.impattoEuro)})`).join("; ")}.`;
  }

  if (domanda === "Dove sto perdendo margine?") {
    const resiVuoti = problemiAperti.filter((p) => p.tipo === "reso_vuoto");
    if (resiVuoti.length === 0) return "Nessun rientro a vuoto aperto: il margine attuale riflette già le tratte assegnate.";
    return `${resiVuoti.length} mezzi rientrano vuoti alla base: sono la voce di margine perso più diretta nel piano di oggi, circa ${euro(
      resiVuoti.reduce((s, p) => s + Math.abs(p.impattoEuro), 0)
    )} tra costo del rientro e ricavi non colti.`;
  }

  if (domanda === "Quali viaggi stanno tornando vuoti?") {
    const resiVuoti = problemiAperti.filter((p) => p.tipo === "reso_vuoto");
    if (resiVuoti.length === 0) return "Nessuno al momento: tutti i mezzi rientrano già coperti o vicino alla base.";
    return resiVuoti.map((p) => p.titolo).join(", ") + (numeroBackhaul > 0 ? `. Per ${numeroBackhaul} di questi c'è già un carico spot compatibile.` : ".");
  }

  return `Il motore assegna ogni ordine al mezzo compatibile (capacità, ADR, frigo, ore autista residue) più vicino al punto di ritiro, poi incatena le tappe successive per minimizzare i km a vuoto. Con il piano attuale l'utilizzo mezzi è al ${Math.round(
    kpi.utilizzoMezzi * 100
  )}%.`;
}
