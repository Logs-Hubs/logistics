"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  UploadCloud,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  FileStack,
  MessageCircleQuestion,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDocumentiTrasporto } from "@/lib/flotta/documenti/store";
import {
  calcolaStatoFatturazione,
  spiegaBlocco,
  PASSI_ELABORAZIONE,
  LABEL_STATO_FATTURAZIONE,
  DOMANDE_COPILOT_BASE,
  rispostaCopilot,
} from "@/lib/flotta/documenti/motore";
import type { LavoroTrasporto } from "@/lib/flotta/documenti/tipi";

function euro(n: number) {
  return n.toLocaleString("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

export function DocumentiDashboardClient() {
  const { lavori, simulaIntake } = useDocumentiTrasporto();
  const router = useRouter();
  const [passoElaborazione, setPassoElaborazione] = useState<number | null>(null);
  const [rispostaAI, setRispostaAI] = useState<{ domanda: string; risposta: string } | null>(null);

  const completati = lavori.filter((l) => l.dataConsegna !== null);
  const bloccati = lavori.filter((l) => {
    const s = calcolaStatoFatturazione(l);
    return s === "documenti_mancanti" || s === "tariffa_da_verificare";
  });
  const pronti = lavori.filter((l) => calcolaStatoFatturazione(l) === "pronto_fatturazione");
  const inCorso = lavori.filter((l) => calcolaStatoFatturazione(l) === "non_completo");
  const fatturati = lavori.filter((l) => l.fatturato);

  const totaleCompletato = completati.reduce((s, l) => s + (l.tariffaConcordata ?? 0), 0);
  const totalePronto = pronti.reduce((s, l) => s + (l.tariffaConcordata ?? 0), 0);
  const totaleBloccato = bloccati.reduce((s, l) => s + (l.tariffaConcordata ?? 0), 0);
  const totaleFatturato = fatturati.reduce((s, l) => s + (l.tariffaConcordata ?? 0), 0);

  // "Bloccato da": raggruppa l'importo bloccato per il primo motivo di ogni lavoro — lo stesso
  // breakdown "blocked_by" descritto come wow feature primaria.
  const bloccatoPerMotivo = new Map<string, number>();
  for (const l of bloccati) {
    const motivo = spiegaBlocco(l)[0] ?? "Altro";
    bloccatoPerMotivo.set(motivo, (bloccatoPerMotivo.get(motivo) ?? 0) + (l.tariffaConcordata ?? 0));
  }

  function avviaSimulazione() {
    if (passoElaborazione !== null) return;
    setPassoElaborazione(0);
    PASSI_ELABORAZIONE.forEach((_, i) => {
      window.setTimeout(() => setPassoElaborazione(i + 1), (i + 1) * 380);
    });
    window.setTimeout(() => {
      const id = simulaIntake();
      setPassoElaborazione(null);
      router.push(`/flotta/documenti/${id}`);
    }, (PASSI_ELABORAZIONE.length + 1) * 380);
  }

  return (
    <div className="mx-auto max-w-7xl px-8 py-8">
      <header className="mb-8">
        <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy">
          <Sparkles className="h-3.5 w-3.5" />
          Movr Flotte · Documenti trasporto
        </p>
        <h1 className="text-2xl font-bold text-navy">Hai già fatto il lavoro. Ecco cosa ti impedisce di essere pagato.</h1>
        <p className="mt-1 text-sm text-muted">
          Ordine, DDT e POD spesso restano scollegati dal viaggio: qui diventano un unico lavoro di trasporto, con lo stato di
          fatturazione sempre visibile invece di scoprirlo a fine mese.
        </p>
      </header>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={FileStack} label="Lavoro completato" value={euro(totaleCompletato)} color="text-navy" bg="bg-navy/5" />
        <StatCard icon={CheckCircle2} label="Pronto per la fatturazione" value={euro(totalePronto)} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard icon={AlertTriangle} label="Bloccato" value={euro(totaleBloccato)} color="text-rose-600" bg="bg-rose-50" />
        <StatCard icon={Clock3} label="Già fatturato" value={euro(totaleFatturato)} color="text-muted" bg="bg-navy/5" />
      </div>

      {bloccatoPerMotivo.size > 0 && (
        <div className="mb-8 rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-navy">Bloccato da</h2>
          <div className="space-y-2">
            {[...bloccatoPerMotivo.entries()]
              .sort((a, b) => b[1] - a[1])
              .map(([motivo, importo]) => (
                <div key={motivo} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-foreground">{motivo}</span>
                  <span className="font-semibold text-rose-600">{euro(importo)}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="mb-8 rounded-2xl bg-navy p-8 text-white shadow-lg">
        <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-light">Document intake</p>
            <h2 className="mt-1 text-xl font-bold">Inoltra qualsiasi cosa. Ricevi un lavoro di trasporto pronto.</h2>
            <p className="mt-2 max-w-xl text-sm text-teal-light/90">
              Ordine via email, PDF, foto del DDT dall&apos;autista: l&apos;IA li identifica, estrae i dati e crea (o completa) il
              lavoro di trasporto corrispondente — senza un&apos;altra cartella condivisa da tenere in ordine a mano.
            </p>
          </div>
          <button
            onClick={avviaSimulazione}
            disabled={passoElaborazione !== null}
            className="flex flex-shrink-0 items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UploadCloud className="h-4 w-4" />
            Simula: inoltra un&apos;email con un PDF allegato
          </button>
        </div>

        {passoElaborazione !== null && (
          <div className="mt-6 space-y-1.5 rounded-lg bg-white/5 p-4">
            {PASSI_ELABORAZIONE.map((passo, i) => (
              <div key={passo} className="flex items-center gap-2 text-xs">
                {i < passoElaborazione ? (
                  <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-teal-light" />
                ) : i === passoElaborazione ? (
                  <span className="h-3.5 w-3.5 flex-shrink-0 animate-pulse rounded-full border-2 border-accent" />
                ) : (
                  <span className="h-3.5 w-3.5 flex-shrink-0 rounded-full border border-white/20" />
                )}
                <span className={i <= passoElaborazione ? "text-white" : "text-teal-light/50"}>{passo}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <Sezione titolo="Bloccati" lavori={bloccati} vuoto="Nessun lavoro bloccato al momento." />
          <Sezione titolo="In corso" lavori={inCorso} vuoto="Nessun lavoro in corso al momento." />
          <Sezione titolo="Pronti per la fatturazione" lavori={pronti} vuoto="Nessun lavoro ancora pronto." />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy">
              <MessageCircleQuestion className="h-4 w-4 text-accent" />
              Chiedi all&apos;AI
            </h2>
            <div className="space-y-1.5">
              {DOMANDE_COPILOT_BASE.filter((d) => d !== "Cosa serve per sbloccare questo lavoro?").map((d) => (
                <button
                  key={d}
                  onClick={() => setRispostaAI({ domanda: d, risposta: rispostaCopilot(d, lavori) })}
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
              Estrazione e stato di fatturazione sono simulati su dati realistici (nessuna chiamata a un LLM reale in questa
              demo). Lo stato non è mai scritto a mano tranne &quot;fatturato&quot;: tutto il resto è calcolato dai documenti
              presenti e dalla loro validazione.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Sezione({ titolo, lavori, vuoto }: { titolo: string; lavori: LavoroTrasporto[]; vuoto: string }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
        {titolo} ({lavori.length})
      </h2>
      {lavori.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted">{vuoto}</div>
      ) : (
        <div className="space-y-3">
          {lavori.map((l) => (
            <LavoroCard key={l.id} lavoro={l} />
          ))}
        </div>
      )}
    </section>
  );
}

function LavoroCard({ lavoro }: { lavoro: LavoroTrasporto }) {
  const stato = calcolaStatoFatturazione(lavoro);
  const motivi = spiegaBlocco(lavoro);
  const badgeStile = {
    non_completo: "bg-slate-100 text-slate-700",
    documenti_mancanti: "bg-rose-50 text-rose-700",
    tariffa_da_verificare: "bg-amber-50 text-amber-700",
    pronto_fatturazione: "bg-emerald-50 text-emerald-700",
    fatturato: "bg-navy/10 text-navy",
  }[stato];

  return (
    <Link
      href={`/flotta/documenti/${lavoro.id}`}
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-teal/40"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-navy">{lavoro.riferimento}</h3>
          <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", badgeStile)}>{LABEL_STATO_FATTURAZIONE[stato]}</span>
        </div>
        <p className="mt-0.5 text-xs text-muted">
          {lavoro.clienteNome} · {lavoro.ritiroCitta} → {lavoro.consegnaCitta}
        </p>
        {motivi.length > 0 && <p className="mt-1.5 truncate text-xs text-rose-600">{motivi[0]}</p>}
      </div>
      <div className="flex flex-shrink-0 items-center gap-3">
        {lavoro.tariffaConcordata !== null && <span className="text-sm font-semibold text-navy">{euro(lavoro.tariffaConcordata)}</span>}
        <ArrowRight className="h-3.5 w-3.5 text-muted" />
      </div>
    </Link>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className={cn("mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg", bg)}>
        <Icon className={cn("h-4.5 w-4.5", color)} />
      </div>
      <div className="text-lg font-bold text-navy">{value}</div>
      <div className="mt-0.5 text-xs text-muted">{label}</div>
    </div>
  );
}
