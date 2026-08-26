import { ArrowRight, AlertTriangle, PackageX, Split, Users, CheckCircle2, ImageOff } from "lucide-react";
import { CalendarMockup, PhoneMockup, TimelineMockup } from "@/components/mockups";
import { Nav, Footer } from "@/components/layout";

export const metadata = {
  title: "Movr a Genova: coordinamento portuale per spedizionieri doganali",
  description:
    "Porto Vecchio, PSA Prà e Savona-Vado in un'unica vista: appuntamenti, tracking del mezzo e rientro container vuoti per gli spedizionieri doganali genovesi.",
};

export default function GenovaPage() {
  return (
    <div>
      <Nav genovaLink={false} />
      <Hero />
      <StatsSection />
      <ProblemSection />
      <FeatureSlide
        id="prodotto"
        kicker="Slot booking multi-terminal"
        titolo="Porto Vecchio, Prà, Savona-Vado: un calendario solo."
        testo="Prenoti lo slot una volta, il vettore riceve orario e istruzioni gate in automatico. Niente più tre piattaforme da controllare a turno."
        mockup={<CalendarMockup />}
      />
      <FeatureSlide
        kicker="Tracking del mezzo"
        titolo="Il container vuoto, finalmente visibile."
        testo="Targa tracciata al ritiro dal gate. Rientro del vuoto segnalato dal driver, visibile in tempo reale: il pezzo che il PCS oggi lascia scoperto."
        mockup={<TimelineMockup />}
        reverse
        alt
      />
      <CTASection />
      <Footer genovaLink={false} />
    </div>
  );
}

function Hero() {
  return (
    <section className="flex overflow-hidden bg-navy-dark lg:min-h-screen lg:snap-start lg:items-center">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <p className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            Genova · Savona-Vado
          </p>
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
            Il porto sa dov&apos;è la merce. <br className="hidden sm:block" />
            Non sa dov&apos;è il tuo camion.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-teal-light">
            Movr mette Porto Vecchio, PSA Prà e Savona-Vado in un&apos;unica vista: appuntamenti, mezzi e container
            vuoti, senza più una telefonata per ognuno.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#contatti"
              className="flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent-dark"
            >
              Prenota una demo per la tua azienda genovese
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-8 -z-10 rounded-full bg-accent/10 blur-3xl" />
          {/* TODO: sostituire con una foto vera del porto di Genova (varco, gru, banchina) */}
          <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-white/5 shadow-2xl">
            <ImageOff className="h-6 w-6 text-white/40" />
            <p className="max-w-[70%] px-6 text-center text-xs text-white/40 sm:max-w-[55%]">Foto del porto da inserire</p>
          </div>
          <div className="absolute -bottom-8 -right-6 hidden w-[190px] drop-shadow-2xl sm:block">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

const STATS = [
  { v: "~3M", l: "TEU movimentati tra Genova e Savona-Vado nel 2025, record storico" },
  { v: "~3.700", l: "camion al giorno attraverso i varchi portuali di Genova" },
  { v: "30+", l: "associazioni di spedizionieri/autotrasportatori in Italia. Spediporto è quella genovese" },
  { v: "0", l: "piattaforme come Movr già focalizzate sui porti italiani. Il gap è aperto" },
];

function StatsSection() {
  return (
    <section className="bg-navy py-14 lg:snap-start">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-3xl font-bold text-white">{s.v}</div>
              <div className="mt-2 text-xs leading-relaxed text-teal-light">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PAIN = [
  {
    icon: AlertTriangle,
    titolo: "I coni d'ombra del PCS",
    testo:
      "Federlogistica Liguria lo segnala da tempo: il Port Community System traccia la merce, non il mezzo. Tempi di validità viaggio ridotti da 8 a 4 giorni, app Eva obbligatoria, senza che i flussi operativi fossero adeguati.",
  },
  {
    icon: PackageX,
    titolo: "Il vuoto non torna da solo",
    testo:
      "Tra Porto Vecchio, Prà e Savona-Vado, il rientro del container vuoto resta un buco totale: gestito a telefono, con rischio concreto di detention.",
  },
  {
    icon: Split,
    titolo: "Tre terminal, tre sistemi",
    testo: "Genova Porto Vecchio, PSA Prà, Savona-Vado: ognuno con la propria piattaforma di appuntamenti, la propria logica, i propri orari.",
  },
  {
    icon: Users,
    titolo: "Gli shock che non perdonano",
    testo:
      "Lo sciopero di ottobre 2025 ha bloccato i varchi per giorni. A Ferragosto servono piani straordinari. Senza visibilità in tempo reale, li subisci due volte.",
  },
];

function ProblemSection() {
  return (
    <section className="flex bg-background py-20 lg:min-h-screen lg:snap-start lg:items-center lg:py-0">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">Il problema, qui a Genova</p>
          <h2 className="text-3xl font-bold text-navy">Non teoria. Problemi documentati sul campo.</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PAIN.map((p) => (
            <div key={p.titolo} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50">
                <p.icon className="h-4.5 w-4.5 text-rose-500" />
              </div>
              <h3 className="text-sm font-semibold text-navy">{p.titolo}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{p.testo}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureSlide({
  id,
  kicker,
  titolo,
  testo,
  mockup,
  reverse = false,
  alt = false,
}: {
  id?: string;
  kicker: string;
  titolo: string;
  testo: string;
  mockup: React.ReactNode;
  reverse?: boolean;
  alt?: boolean;
}) {
  return (
    <section id={id} className={`flex py-16 lg:min-h-screen lg:snap-start lg:items-center lg:py-0 ${alt ? "bg-background" : "bg-white"}`}>
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        <div className={reverse ? "lg:order-2" : ""}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">{kicker}</p>
          <h3 className="text-2xl font-bold text-navy sm:text-3xl">{titolo}</h3>
          <p className="mt-3 max-w-md leading-relaxed text-muted">{testo}</p>
        </div>
        <div className={reverse ? "lg:order-1" : ""}>{mockup}</div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section id="contatti" className="flex bg-white py-20 lg:min-h-screen lg:snap-start lg:items-center lg:py-0">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-bold text-navy">Sei uno spedizioniere doganale a Genova?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Parliamone in 15 minuti. Ti mostriamo la piattaforma, tu ci dici se risolve un problema vero per la tua
          azienda. Se sei associato Spediporto, ancora meglio: è la rete da cui vogliamo partire.
        </p>
        <a
          href="mailto:ciao@movr.app"
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-white hover:bg-accent-dark"
        >
          Scrivici a ciao@movr.app
          <ArrowRight className="h-4 w-4" />
        </a>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          Gratis per i primi design partner genovesi · nessun impegno
        </p>
      </div>
    </section>
  );
}
