"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Clock3,
  CheckCircle2,
  FileStack,
  Sparkles,
  UploadCloud,
  ArrowRight,
  Ship,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCustoms } from "@/lib/customs/store";
import { calcolaReadiness, fasciaReadiness, spiegaBlocco, PASSI_ELABORAZIONE } from "@/lib/customs/motore";
import type { CasoDoganale } from "@/lib/customs/tipi";

type Bucket = "attenzione" | "revisione" | "pronte";

function bucketDi(caso: CasoDoganale): Bucket {
  if (caso.stato === "pronto_per_dogana" || caso.stato === "inviato" || caso.stato === "sdoganato") return "pronte";
  const score = calcolaReadiness(caso);
  const bloccante = caso.problemi.some((p) => p.stato === "aperto" && (p.severita === "bloccante" || p.severita === "errore"));
  if (bloccante || score < 50) return "attenzione";
  if (score < 100) return "revisione";
  return "pronte";
}

export function CustomsDashboardClient() {
  const { casi, simulaIntake } = useCustoms();
  const router = useRouter();
  const [passoElaborazione, setPassoElaborazione] = useState<number | null>(null);

  const attenzione = casi.filter((c) => bucketDi(c) === "attenzione");
  const revisione = casi.filter((c) => bucketDi(c) === "revisione");
  const pronte = casi.filter((c) => bucketDi(c) === "pronte");
  const problemiAperti = casi.reduce((s, c) => s + c.problemi.filter((p) => p.stato === "aperto").length, 0);

  const attivitaRecente = casi
    .flatMap((c) => c.attivita.map((a) => ({ ...a, casoId: c.id, riferimento: c.riferimento })))
    .sort((a, b) => (a.quando < b.quando ? 1 : -1))
    .slice(0, 8);

  function avviaSimulazione() {
    if (passoElaborazione !== null) return;
    setPassoElaborazione(0);
    PASSI_ELABORAZIONE.forEach((_, i) => {
      window.setTimeout(() => setPassoElaborazione(i + 1), (i + 1) * 380);
    });
    window.setTimeout(() => {
      const id = simulaIntake();
      setPassoElaborazione(null);
      router.push(`/customs/${id}`);
    }, (PASSI_ELABORAZIONE.length + 1) * 380);
  }

  return (
    <div className="mx-auto max-w-7xl px-8 py-8">
      <header className="mb-8">
        <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy">
          <Sparkles className="h-3.5 w-3.5" />
          Movr Dogana · Customs Brain
        </p>
        <h1 className="text-2xl font-bold text-navy">Casi doganali</h1>
        <p className="mt-1 text-sm text-muted">
          Livello a monte del workflow Porti: trasforma documenti disordinati in un caso doganale strutturato, validato e pronto per procedere.
        </p>
      </header>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={AlertTriangle} label="Attenzione richiesta" value={attenzione.length} color="text-rose-600" bg="bg-rose-50" />
        <StatCard icon={Clock3} label="In revisione" value={revisione.length} color="text-amber-600" bg="bg-amber-50" />
        <StatCard icon={CheckCircle2} label="Pronte per la dogana" value={pronte.length} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard icon={FileStack} label="Problemi aperti totali" value={problemiAperti} color="text-navy" bg="bg-navy/5" />
      </div>

      <div className="mb-8 rounded-2xl bg-navy p-8 text-white shadow-lg">
        <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-light">Document intake</p>
            <h2 className="mt-1 text-xl font-bold">Trascina qualsiasi cosa. Ricevi un caso pronto per la dogana.</h2>
            <p className="mt-2 max-w-xl text-sm text-teal-light/90">
              Fatture, packing list, bill of lading, certificati, scansioni, ZIP con più versioni: l&apos;IA li identifica, estrae i dati,
              li confronta e segnala cosa manca — senza costruire l&apos;ennesimo sistema di gestione documentale.
            </p>
          </div>
          <button
            onClick={avviaSimulazione}
            disabled={passoElaborazione !== null}
            className="flex flex-shrink-0 items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UploadCloud className="h-4 w-4" />
            Simula: rilascia una cartella di documenti
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
          <Sezione titolo="Attenzione richiesta" casi={attenzione} vuoto="Nessun caso bloccato al momento." />
          <Sezione titolo="In revisione" casi={revisione} vuoto="Nessun caso in revisione al momento." />
          <Sezione titolo="Pronte per la dogana" casi={pronte} vuoto="Nessun caso ancora pronto." />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-navy">Attività recente</h2>
            {attivitaRecente.length === 0 ? (
              <p className="text-xs text-muted">Nessuna attività ancora.</p>
            ) : (
              <ul className="space-y-3">
                {attivitaRecente.map((a) => (
                  <li key={a.id} className="text-xs">
                    <Link href={`/customs/${a.casoId}`} className="font-semibold text-navy hover:underline">
                      {a.riferimento}
                    </Link>
                    <p className={cn("mt-0.5 leading-relaxed", a.fonte === "ai" ? "text-teal" : "text-muted")}>{a.testo}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-5 text-xs text-muted shadow-sm">
            <p className="mb-1.5 font-semibold text-navy">Come funziona il motore</p>
            <p>
              Estrazione e validazione sono simulate su dati realistici (nessuna chiamata a un LLM reale in questa demo). Il punteggio
              di readiness è calcolato da funzioni deterministiche sui problemi aperti e sulle classificazioni ancora da approvare, mai
              inventato.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Sezione({ titolo, casi, vuoto }: { titolo: string; casi: CasoDoganale[]; vuoto: string }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
        {titolo} ({casi.length})
      </h2>
      {casi.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted">{vuoto}</div>
      ) : (
        <div className="space-y-3">
          {casi.map((c) => (
            <CasoCard key={c.id} caso={c} />
          ))}
        </div>
      )}
    </section>
  );
}

function CasoCard({ caso }: { caso: CasoDoganale }) {
  const score = calcolaReadiness(caso);
  const fascia = fasciaReadiness(score);
  const motivi = spiegaBlocco(caso);
  const coloreBarraS = { buono: "bg-emerald-500", medio: "bg-teal", attenzione: "bg-amber-500", bloccato: "bg-rose-500" }[fascia.tono];

  return (
    <Link
      href={`/customs/${caso.id}`}
      className="block rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-teal/40"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-navy">{caso.riferimento}</h3>
            {caso.spedizioneId && (
              <span className="inline-flex items-center gap-1 rounded-full bg-teal/10 px-2 py-0.5 text-[11px] font-medium text-teal">
                <Ship className="h-3 w-3" />
                {caso.spedizioneId}
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-xs text-muted">
            {caso.importatore.nome} ← {caso.esportatore.nome}
          </p>
          {motivi.length > 0 && <p className="mt-1.5 truncate text-xs text-rose-600">{motivi[0]}</p>}
        </div>
        <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
          <span className="text-lg font-bold text-navy">{score}</span>
          <ArrowRight className="h-3.5 w-3.5 text-muted" />
        </div>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div className={cn("h-full rounded-full", coloreBarraS)} style={{ width: `${score}%` }} />
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
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className={cn("mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg", bg)}>
        <Icon className={cn("h-4.5 w-4.5", color)} />
      </div>
      <div className="text-2xl font-bold text-navy">{value}</div>
      <div className="mt-0.5 text-xs text-muted">{label}</div>
    </div>
  );
}
