"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertOctagon, AlertTriangle, ArrowLeft, CheckCircle2, Circle, FileText, MapPin, Snowflake, Truck, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContainer } from "@/lib/container/store";
import { motiviBloccoFatturazione } from "@/lib/container/motore";
import { compatibile, LABEL_FASE_ORDINE, NOME_PORTO, readinessCompleta, type OrdineContainer } from "@/lib/container/tipi";

function euro(n: number) {
  return n.toLocaleString("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

export function OrdineDetailClient({ id }: { id: string }) {
  const {
    ordini,
    autisti,
    mezzi,
    trovaOrdine,
    segnalaCarrierRelease,
    segnalaCustomsRelease,
    segnalaTerminalDisponibile,
    prenotaSlot,
    assegnaAutista,
    segnalaRitiro,
    segnalaConsegna,
    segnalaRientroVuoto,
    segnalaEirRaccolto,
    segnalaPodRaccolto,
    segnalaFatturato,
  } = useContainer();

  const [autistaScelto, setAutistaScelto] = useState("");
  const [mezzoScelto, setMezzoScelto] = useState("");

  const ordine = trovaOrdine(id);

  if (!ordine) {
    return (
      <div className="mx-auto max-w-4xl px-8 py-8">
        <p className="text-sm text-muted">Ordine {id} non trovato.</p>
        <Link href="/container" className="mt-2 inline-flex items-center gap-1.5 text-sm text-teal hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" />
          Torna al centro comando container
        </Link>
      </div>
    );
  }

  const readiness = ordine.readiness;
  const completa = readinessCompleta(readiness);
  const autista = autisti.find((a) => a.id === ordine.autistaId);
  const mezzo = mezzi.find((m) => m.id === ordine.mezzoId);

  return (
    <div className="mx-auto max-w-4xl px-8 py-8">
      <Link href="/container" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-navy">
        <ArrowLeft className="h-3.5 w-3.5" />
        Centro comando container
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-navy">{ordine.id}</h1>
        <span className="inline-flex items-center rounded-full bg-navy/10 px-2.5 py-1 text-xs font-medium text-navy">
          {LABEL_FASE_ORDINE[ordine.faseOperativa]}
        </span>
        {ordine.richiedeReefer && (
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
            <Snowflake className="h-3 w-3" />
            Reefer
          </span>
        )}
        {ordine.richiedeAdr && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
            <AlertOctagon className="h-3 w-3" />
            ADR
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted">
        {ordine.cliente} · {ordine.containerId} ({ordine.tipoContainer}) · {NOME_PORTO[ordine.porto]} — {ordine.terminal}
        {ordine.tariffaConcordata !== null && ` · ${euro(ordine.tariffaConcordata)}`}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {ordini.map((o) => (
          <Link
            key={o.id}
            href={`/container/ordini/${o.id}`}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium",
              o.id === id ? "border-navy bg-navy text-white" : "border-border bg-white text-muted hover:bg-[#F7F9FA]"
            )}
          >
            {o.id}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="space-y-4 md:col-span-1">
          <InfoCard
            icon={MapPin}
            titolo="Ordine"
            righe={[
              ["Tipo", ordine.tipo === "import" ? "Import" : "Export"],
              ["Last free day", ordine.ultimoFreeDay],
              ["Creato il", ordine.creatoIl.slice(0, 10)],
            ]}
          />
          <InfoCard
            icon={Truck}
            titolo="Assegnazione"
            righe={[
              ["Autista", autista?.nome ?? "Non assegnato"],
              ["Mezzo", mezzo?.targa ?? "Non assegnato"],
            ]}
          />

          {ordine.faseOperativa === "pronto_dispatch" && !ordine.autistaId && (
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <p className="mb-2 text-sm font-semibold text-navy">Assegna autista e mezzo</p>
              <div className="space-y-2">
                <select
                  value={autistaScelto}
                  onChange={(e) => setAutistaScelto(e.target.value)}
                  className="w-full rounded-lg border border-border px-2.5 py-1.5 text-xs"
                >
                  <option value="">Autista...</option>
                  {autisti.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nome}
                    </option>
                  ))}
                </select>
                <select
                  value={mezzoScelto}
                  onChange={(e) => setMezzoScelto(e.target.value)}
                  className="w-full rounded-lg border border-border px-2.5 py-1.5 text-xs"
                >
                  <option value="">Mezzo...</option>
                  {mezzi.map((m) => {
                    const ok = compatibile(ordine, m);
                    return (
                      <option key={m.id} value={m.id} disabled={!ok}>
                        {m.targa}
                        {!ok ? " — non compatibile" : ""}
                      </option>
                    );
                  })}
                </select>
                {(ordine.richiedeReefer || ordine.richiedeAdr) && (
                  <p className="flex items-start gap-1.5 text-[11px] text-amber-700">
                    <AlertTriangle className="mt-0.5 h-3 w-3 flex-shrink-0" />
                    {ordine.richiedeReefer && "Richiede mezzo con presa reefer. "}
                    {ordine.richiedeAdr && "Richiede mezzo abilitato ADR."}
                  </p>
                )}
                <button
                  onClick={() => autistaScelto && mezzoScelto && assegnaAutista(ordine.id, autistaScelto, mezzoScelto)}
                  disabled={!autistaScelto || !mezzoScelto}
                  className="w-full rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Assegna
                </button>
              </div>
            </div>
          )}

          <AzioneFase
            ordine={ordine}
            onRitiro={() => segnalaRitiro(ordine.id)}
            onConsegna={() => segnalaConsegna(ordine.id, ordine.attesaMinuti ?? undefined)}
            onRientroVuoto={() => segnalaRientroVuoto(ordine.id)}
            onFatturato={() => segnalaFatturato(ordine.id)}
          />
        </div>

        <div className="space-y-6 md:col-span-2">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">Container readiness</p>
            {completa ? (
              <p className="mb-3 flex items-center gap-1.5 text-sm text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Readiness completa: il container è ritirabile.
              </p>
            ) : (
              <p className="mb-3 text-sm text-muted">In attesa che tutti i segnali siano confermati.</p>
            )}
            <div className="space-y-2">
              <RigaReadiness
                label="Carrier release"
                attivo={readiness.carrierRelease}
                onSegnala={!readiness.carrierRelease ? () => segnalaCarrierRelease(ordine.id) : undefined}
              />
              <RigaReadiness
                label="Customs release"
                attivo={readiness.customsRelease}
                onSegnala={!readiness.customsRelease ? () => segnalaCustomsRelease(ordine.id) : undefined}
              />
              <RigaReadiness
                label="Terminal disponibile"
                attivo={readiness.terminalDisponibile}
                onSegnala={!readiness.terminalDisponibile ? () => segnalaTerminalDisponibile(ordine.id) : undefined}
              />
              <RigaReadiness
                label={readiness.slotDataOra ? `Slot prenotato — ${readiness.slotDataOra.replace("T", " ").slice(0, 16)}` : "Slot prenotato"}
                attivo={readiness.slotPrenotato}
                onSegnala={
                  !readiness.slotPrenotato
                    ? () => prenotaSlot(ordine.id, new Date().toISOString())
                    : undefined
                }
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">Timeline esecuzione</p>
            <ol className="space-y-2 text-xs">
              <TappaTimeline label="Ritiro" valore={ordine.oraRitiro} />
              <TappaTimeline label="Consegna" valore={ordine.oraConsegna} />
              <TappaTimeline label="Rientro vuoto" valore={ordine.oraRientroVuoto} />
            </ol>
          </div>

          {(ordine.attesaMinuti !== null || ordine.accessorialDaFatturare !== null) && (
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">Accessorial</p>
              <dl className="space-y-2 text-sm">
                {ordine.attesaMinuti !== null && (
                  <div className="flex justify-between">
                    <dt className="text-muted">Attesa registrata</dt>
                    <dd className="font-medium text-foreground">{ordine.attesaMinuti} minuti</dd>
                  </div>
                )}
                {ordine.accessorialDaFatturare !== null && (
                  <div className="flex justify-between">
                    <dt className="text-muted">Da fatturare</dt>
                    <dd className={cn("font-medium", ordine.accessorialDaFatturare > 0 ? "text-amber-700" : "text-emerald-700")}>
                      {euro(ordine.accessorialDaFatturare)}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {ordine.faseOperativa !== "attesa_readiness" && ordine.faseOperativa !== "pronto_dispatch" && (
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                <FileText className="h-3.5 w-3.5" />
                Documenti — condizione per fatturare
              </p>
              <div className="space-y-2">
                <RigaReadiness label="EIR raccolto (verbale di stato al ritiro)" attivo={ordine.eirRaccolto} onSegnala={!ordine.eirRaccolto ? () => segnalaEirRaccolto(ordine.id) : undefined} />
                <RigaReadiness label="POD raccolto (prova di consegna)" attivo={ordine.podRaccolto} onSegnala={!ordine.podRaccolto ? () => segnalaPodRaccolto(ordine.id) : undefined} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, titolo, righe }: { icon: React.ElementType; titolo: string; righe: [string, string][] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy">
        <Icon className="h-4 w-4 text-teal" />
        {titolo}
      </div>
      <dl className="space-y-2">
        {righe.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-2 text-xs">
            <dt className="text-muted">{k}</dt>
            <dd className="text-right font-medium text-foreground">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function RigaReadiness({ label, attivo, onSegnala }: { label: string; attivo: boolean; onSegnala?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-white px-3 py-2">
      <span className="flex items-center gap-2 text-xs">
        {attivo ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Circle className="h-4 w-4 text-slate-300" />}
        <span className={attivo ? "text-foreground" : "text-muted"}>{label}</span>
      </span>
      {onSegnala && (
        <button onClick={onSegnala} className="rounded-lg bg-navy px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-navy-dark">
          Segna ottenuto
        </button>
      )}
    </div>
  );
}

function TappaTimeline({ label, valore }: { label: string; valore: string | null }) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-border bg-white px-4 py-2.5">
      {valore ? <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" /> : <Circle className="h-3.5 w-3.5 flex-shrink-0 text-slate-300" />}
      <span className={cn("font-medium", valore ? "text-foreground" : "text-muted")}>{label}</span>
      <span className="ml-auto text-muted">{valore ? valore.replace("T", " ").slice(0, 16) : "—"}</span>
    </li>
  );
}

function AzioneFase({
  ordine,
  onRitiro,
  onConsegna,
  onRientroVuoto,
  onFatturato,
}: {
  ordine: OrdineContainer;
  onRitiro: () => void;
  onConsegna: () => void;
  onRientroVuoto: () => void;
  onFatturato: () => void;
}) {
  if (ordine.faseOperativa === "pronto_dispatch" && ordine.autistaId) {
    return (
      <button onClick={onRitiro} className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark">
        <User className="h-4 w-4" />
        Segna ritiro effettuato
      </button>
    );
  }
  if (ordine.faseOperativa === "in_esecuzione") {
    return (
      <button onClick={onConsegna} className="w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark">
        Segna consegna effettuata
      </button>
    );
  }
  if (ordine.faseOperativa === "consegnato") {
    return (
      <button onClick={onRientroVuoto} className="w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark">
        Segna rientro vuoto
      </button>
    );
  }
  if (ordine.faseOperativa === "vuoto_rientrato") {
    const motivi = motiviBloccoFatturazione(ordine);
    const pronto = motivi.length === 0;
    return (
      <div className="space-y-2">
        <button
          onClick={onFatturato}
          disabled={!pronto}
          className="w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          Segna come fatturato
        </button>
        {!pronto && (
          <ul className="space-y-1 rounded-lg bg-amber-50/60 p-3 text-[11px] text-amber-800">
            {motivi.map((m) => (
              <li key={m} className="flex items-start gap-1.5">
                <AlertTriangle className="mt-0.5 h-3 w-3 flex-shrink-0" />
                {m}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  return null;
}
