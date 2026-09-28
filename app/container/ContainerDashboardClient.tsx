"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertOctagon, ArrowRight, Box, CheckCircle2, Package, Plus, ShieldAlert, Snowflake, Sparkles, Truck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContainer } from "@/lib/container/store";
import { giorniA, LABEL_SEVERITA_ECCEZIONE_CONTAINER, type EccezioneContainer } from "@/lib/container/motore";
import {
  LABEL_FASE_ORDINE,
  NOME_PORTO,
  readinessCompleta,
  type FaseOrdine,
  type NuovoOrdineInput,
  type OrdineContainer,
  type PortoContainer,
} from "@/lib/container/tipi";

function euro(n: number) {
  return n.toLocaleString("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

// L'ordine delle colonne è il workflow centrale di product/container-trucking-v1.md: ogni
// schermata deve rispondere a "dove si trova questo ordine nella catena", non essere una tabella
// piatta in ordine di inserimento (gap #4 dell'audit in quel documento, §10).
const FASI_ORDINATE: FaseOrdine[] = ["attesa_readiness", "pronto_dispatch", "in_esecuzione", "consegnato", "vuoto_rientrato", "fatturato"];

const PORTI_FILTRO: { value: PortoContainer | "tutti"; label: string }[] = [
  { value: "tutti", label: "Tutti i porti" },
  { value: "genova", label: "Genova" },
  { value: "savona-vado", label: "Savona-Vado" },
  { value: "la-spezia", label: "La Spezia" },
];

export function ContainerDashboardClient() {
  const { ordini, eccezioni, creaOrdine } = useContainer();
  const router = useRouter();
  const [filtroPorto, setFiltroPorto] = useState<PortoContainer | "tutti">("tutti");
  const [modaleAperto, setModaleAperto] = useState(false);

  const ordiniFiltrati = filtroPorto === "tutti" ? ordini : ordini.filter((o) => o.porto === filtroPorto);

  const aperti = ordini.filter((o) => o.faseOperativa !== "fatturato" && o.faseOperativa !== "vuoto_rientrato");
  const inEsecuzione = ordini.filter((o) => o.faseOperativa === "in_esecuzione").length;
  const daFatturare = ordini.reduce((s, o) => s + (o.accessorialDaFatturare ?? 0), 0);
  const critiche = eccezioni.filter((e) => e.severita === "critica").length;

  function creaEApri(input: NuovoOrdineInput) {
    const nuovoId = creaOrdine(input);
    setModaleAperto(false);
    router.push(`/container/ordini/${nuovoId}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-8 py-8">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy">
            <Sparkles className="h-3.5 w-3.5" />
            Movr Container · AI Transport Manager per l&apos;autotrasporto container
          </p>
          <h1 className="text-2xl font-bold text-navy">Centro comando container</h1>
          <p className="mt-1 text-sm text-muted">
            Dispatcher di un&apos;azienda di autotrasporto container: dall&apos;ordine ricevuto alla fattura pronta,
            Genova · Savona-Vado · La Spezia.
          </p>
        </div>
        <button
          onClick={() => setModaleAperto(true)}
          className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark"
        >
          <Plus className="h-4 w-4" />
          Nuovo ordine
        </button>
      </header>

      <AttenzioneOggi eccezioni={eccezioni} />

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard icon={Package} label="Ordini aperti" value={String(aperti.length)} color="text-navy" bg="bg-navy/5" />
        <StatCard icon={Truck} label="In esecuzione" value={String(inEsecuzione)} color="text-navy" bg="bg-navy/5" />
        <StatCard icon={ShieldAlert} label="Eccezioni critiche" value={String(critiche)} color="text-rose-600" bg="bg-rose-50" />
        <StatCard icon={CheckCircle2} label="Accessorial da fatturare" value={euro(daFatturare)} color="text-amber-600" bg="bg-amber-50" />
        <StatCard icon={Box} label="Ordini totali" value={String(ordini.length)} color="text-navy" bg="bg-navy/5" />
      </div>

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Ordini per fase ({ordiniFiltrati.length})</h2>
          <div className="flex flex-wrap gap-1.5">
            {PORTI_FILTRO.map((p) => (
              <button
                key={p.value}
                onClick={() => setFiltroPorto(p.value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  filtroPorto === p.value ? "border-navy bg-navy text-white" : "border-border bg-white text-muted hover:bg-[#F7F9FA]"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {FASI_ORDINATE.map((fase) => (
            <ColonnaFase key={fase} fase={fase} ordini={ordiniFiltrati.filter((o) => o.faseOperativa === fase)} />
          ))}
        </div>
      </section>

      {modaleAperto && <ModaleNuovoOrdine onChiudi={() => setModaleAperto(false)} onCrea={creaEApri} />}
    </div>
  );
}

function ColonnaFase({ fase, ordini }: { fase: FaseOrdine; ordini: OrdineContainer[] }) {
  const chiusa = fase === "vuoto_rientrato" || fase === "fatturato";
  const ordinati = [...ordini].sort((a, b) =>
    chiusa ? b.aggiornatoIl.localeCompare(a.aggiornatoIl) : giorniA(a.ultimoFreeDay) - giorniA(b.ultimoFreeDay)
  );

  return (
    <div className="w-72 flex-shrink-0">
      <div className="mb-2 flex items-center justify-between px-1">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">{LABEL_FASE_ORDINE[fase]}</h3>
        <span className="rounded-full bg-navy/5 px-2 py-0.5 text-[11px] font-semibold text-navy">{ordini.length}</span>
      </div>
      <div className="space-y-2">
        {ordinati.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted">Vuoto</div>
        ) : (
          ordinati.map((o) => <CardOrdine key={o.id} ordine={o} chiusa={chiusa} />)
        )}
      </div>
    </div>
  );
}

function CardOrdine({ ordine, chiusa }: { ordine: OrdineContainer; chiusa: boolean }) {
  const giorni = giorniA(ordine.ultimoFreeDay);
  const urgenzaStile = giorni < 0 ? "text-rose-600" : giorni <= 1 ? "text-amber-600" : "text-muted";

  return (
    <Link href={`/container/ordini/${ordine.id}`} className="block rounded-xl border border-border bg-card p-3 shadow-sm transition-colors hover:border-teal/40">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-navy">{ordine.id}</span>
        <div className="flex items-center gap-1">
          {ordine.richiedeReefer && (
            <span title="Richiede mezzo reefer">
              <Snowflake className="h-3 w-3 text-sky-500" />
            </span>
          )}
          {ordine.richiedeAdr && (
            <span title="Merce ADR">
              <AlertOctagon className="h-3 w-3 text-amber-600" />
            </span>
          )}
        </div>
      </div>
      <p className="mt-1 truncate text-xs text-foreground">{ordine.cliente}</p>
      <p className="mt-0.5 truncate text-[11px] text-muted">
        {ordine.containerId} · {NOME_PORTO[ordine.porto]}
      </p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <SemaforoReadiness ordine={ordine} />
        {!chiusa && (
          <span className={cn("text-[11px] font-semibold", urgenzaStile)}>
            {giorni < 0 ? `LFD scaduto` : giorni === 0 ? "LFD oggi" : giorni === 1 ? "LFD domani" : `LFD tra ${giorni}g`}
          </span>
        )}
      </div>
    </Link>
  );
}

function SemaforoReadiness({ ordine }: { ordine: OrdineContainer }) {
  const puntini: { attivo: boolean; titolo: string }[] = [
    { attivo: ordine.readiness.carrierRelease, titolo: "Carrier release" },
    { attivo: ordine.readiness.customsRelease, titolo: "Customs release" },
    { attivo: ordine.readiness.terminalDisponibile, titolo: "Terminal disponibile" },
    { attivo: ordine.readiness.slotPrenotato, titolo: "Slot prenotato" },
  ];
  return (
    <div className="flex items-center gap-1" title={readinessCompleta(ordine.readiness) ? "Readiness completa" : "Readiness incompleta"}>
      {puntini.map((p, i) => (
        <span key={i} title={p.titolo} className={cn("h-2 w-2 rounded-full", p.attivo ? "bg-emerald-500" : "bg-slate-200")} />
      ))}
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

function AttenzioneOggi({ eccezioni }: { eccezioni: EccezioneContainer[] }) {
  if (eccezioni.length === 0) {
    return (
      <div className="mb-8 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
        Nessuna eccezione al momento: tutti gli ordini sono sotto controllo.
      </div>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
        <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
        Attenzione oggi ({eccezioni.length})
      </h2>
      <div className="space-y-2.5">
        {eccezioni.map((e) => {
          const stile = {
            critica: "border-rose-200 bg-rose-50/50",
            alta: "border-amber-200 bg-amber-50/40",
            media: "border-border bg-card",
          }[e.severita];
          const badgeStile = {
            critica: "bg-rose-600 text-white",
            alta: "bg-amber-100 text-amber-700",
            media: "bg-slate-100 text-slate-700",
          }[e.severita];
          return (
            <Link
              key={e.id}
              href={e.href}
              className={cn(
                "flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 shadow-sm transition-colors hover:border-teal/40",
                stile
              )}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", badgeStile)}>
                    {LABEL_SEVERITA_ECCEZIONE_CONTAINER[e.severita]}
                  </span>
                  <h3 className="text-sm font-semibold text-navy">{e.titolo}</h3>
                </div>
                <p className="mt-1 text-xs text-muted">{e.ragioni.join(" · ")}</p>
                <p className="mt-1 text-xs font-medium text-teal">{e.azioneConsigliata}</p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-3">
                {e.esposizioneEuro !== null && (
                  <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">{euro(e.esposizioneEuro)}</span>
                )}
                <ArrowRight className="h-4 w-4 text-muted" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

const PORTI_TERMINAL: Record<PortoContainer, string[]> = {
  genova: ["PSA Pra'", "SECH"],
  "savona-vado": ["Vado Gateway"],
  "la-spezia": ["LSCT", "Terminal del Golfo"],
};

function ModaleNuovoOrdine({ onChiudi, onCrea }: { onChiudi: () => void; onCrea: (input: NuovoOrdineInput) => void }) {
  const [cliente, setCliente] = useState("");
  const [containerId, setContainerId] = useState("");
  const [tipoContainer, setTipoContainer] = useState("40' HC");
  const [porto, setPorto] = useState<PortoContainer>("genova");
  const [terminal, setTerminal] = useState(PORTI_TERMINAL.genova[0]);
  const [tipo, setTipo] = useState<"import" | "export">("import");
  const [richiedeReefer, setRichiedeReefer] = useState(false);
  const [richiedeAdr, setRichiedeAdr] = useState(false);
  const [ultimoFreeDay, setUltimoFreeDay] = useState("");
  const [tariffa, setTariffa] = useState("");

  const valido = cliente.trim() !== "" && containerId.trim() !== "" && ultimoFreeDay !== "";

  function cambiaPorto(p: PortoContainer) {
    setPorto(p);
    setTerminal(PORTI_TERMINAL[p][0]);
  }

  function submit() {
    if (!valido) return;
    onCrea({
      cliente: cliente.trim(),
      containerId: containerId.trim(),
      tipoContainer,
      porto,
      terminal,
      tipo,
      richiedeReefer,
      richiedeAdr,
      ultimoFreeDay,
      tariffaConcordata: tariffa.trim() === "" ? null : Number(tariffa),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/40 p-4" onClick={onChiudi}>
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-navy">Nuovo ordine</h2>
            <p className="mt-0.5 text-xs text-muted">
              Intake strutturato manuale — l&apos;ordine entra con readiness a zero, come arriva davvero il primo giorno.
            </p>
          </div>
          <button onClick={onChiudi} className="rounded-lg p-1 text-muted hover:bg-[#F7F9FA]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Cliente">
              <input value={cliente} onChange={(e) => setCliente(e.target.value)} className="w-full rounded-lg border border-border px-2.5 py-1.5 text-xs" placeholder="Es. Zi-Ma S.p.A." />
            </Campo>
            <Campo label="Container ID">
              <input value={containerId} onChange={(e) => setContainerId(e.target.value.toUpperCase())} className="w-full rounded-lg border border-border px-2.5 py-1.5 text-xs" placeholder="MSCU1234567" />
            </Campo>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Campo label="Tipo container">
              <select value={tipoContainer} onChange={(e) => setTipoContainer(e.target.value)} className="w-full rounded-lg border border-border px-2.5 py-1.5 text-xs">
                <option>20&apos; dry</option>
                <option>40&apos; dry</option>
                <option>40&apos; HC</option>
                <option>20&apos; reefer</option>
                <option>40&apos; reefer</option>
              </select>
            </Campo>
            <Campo label="Import / export">
              <select value={tipo} onChange={(e) => setTipo(e.target.value as "import" | "export")} className="w-full rounded-lg border border-border px-2.5 py-1.5 text-xs">
                <option value="import">Import</option>
                <option value="export">Export</option>
              </select>
            </Campo>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Campo label="Porto">
              <select value={porto} onChange={(e) => cambiaPorto(e.target.value as PortoContainer)} className="w-full rounded-lg border border-border px-2.5 py-1.5 text-xs">
                <option value="genova">Genova</option>
                <option value="savona-vado">Savona-Vado</option>
                <option value="la-spezia">La Spezia</option>
              </select>
            </Campo>
            <Campo label="Terminal">
              <select value={terminal} onChange={(e) => setTerminal(e.target.value)} className="w-full rounded-lg border border-border px-2.5 py-1.5 text-xs">
                {PORTI_TERMINAL[porto].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Campo>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Campo label="Last free day">
              <input type="date" value={ultimoFreeDay} onChange={(e) => setUltimoFreeDay(e.target.value)} className="w-full rounded-lg border border-border px-2.5 py-1.5 text-xs" />
            </Campo>
            <Campo label="Tariffa concordata (EUR)">
              <input value={tariffa} onChange={(e) => setTariffa(e.target.value)} inputMode="numeric" className="w-full rounded-lg border border-border px-2.5 py-1.5 text-xs" placeholder="Opzionale" />
            </Campo>
          </div>

          <div className="flex gap-4 pt-1">
            <label className="flex items-center gap-1.5 text-xs text-foreground">
              <input type="checkbox" checked={richiedeReefer} onChange={(e) => setRichiedeReefer(e.target.checked)} />
              Richiede mezzo reefer
            </label>
            <label className="flex items-center gap-1.5 text-xs text-foreground">
              <input type="checkbox" checked={richiedeAdr} onChange={(e) => setRichiedeAdr(e.target.checked)} />
              Merce ADR
            </label>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onChiudi} className="rounded-lg border border-border bg-white px-4 py-2 text-xs font-semibold text-navy hover:bg-[#F7F9FA]">
            Annulla
          </button>
          <button
            onClick={submit}
            disabled={!valido}
            className="rounded-lg bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            Crea ordine
          </button>
        </div>
      </div>
    </div>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}
