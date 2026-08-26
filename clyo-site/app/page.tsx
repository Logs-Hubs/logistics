import { ArrowRight, Ship, PackageX, Split, Phone, CalendarCheck, Smartphone, Undo2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { DashboardMockup, CalendarMockup, PhoneMockup, TimelineMockup } from "@/components/mockups";
import { Nav, Footer } from "@/components/layout";

export default function LandingPage() {
  return (
    <div>
      <Nav />
      <Hero />
      <ProblemSection />
      <FeatureSlide
        id="prodotto"
        kicker="Slot booking multi-terminal"
        titolo="Un calendario. Non tre."
        testo="Prenoti lo slot una volta, il vettore riceve orario e istruzioni gate in automatico, invece di controllare a mano tre piattaforme diverse."
        mockup={<CalendarMockup />}
      />
      <FeatureSlide
        kicker="App driver"
        titolo="Il tuo autista non ti chiama più."
        testo="Notifica push non appena confermi l'appuntamento. Arrivo e ritiro segnalati dal telefono: tu lo sai subito, senza alzare la cornetta."
        mockup={<PhoneMockup />}
        reverse
        alt
      />
      <FeatureSlide
        kicker="Tracking del mezzo"
        titolo="Il container vuoto, per la prima volta tracciato."
        testo="Targa registrata al ritiro. Rientro del vuoto segnalato dal driver e visibile in tempo reale sulla timeline della spedizione."
        mockup={<TimelineMockup />}
      />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="flex overflow-hidden bg-navy-dark lg:min-h-screen lg:snap-start lg:items-center">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <p className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            Per chi coordina, non possiede
          </p>
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
            Meno telefonate. <br className="hidden sm:block" />
            Più container in movimento.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-teal-light">
            Movr mette appuntamenti multi-terminal, tracking del mezzo e rientro dei container vuoti in
            un&apos;unica vista, per chi coordina spedizioni senza avere una flotta propria.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#contatti"
              className="flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent-dark"
            >
              Prenota una demo di 15 minuti
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#prodotto"
              className="rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/5"
            >
              Guarda come funziona
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-8 -z-10 rounded-full bg-teal/20 blur-3xl" />
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}

const PAIN = [
  {
    icon: Ship,
    titolo: "Il sistema vede la merce. Non il mezzo.",
    testo: "Nessuna targa, nessun autista tracciato: sai dov'è il container, non chi lo sta portando al gate.",
  },
  {
    icon: PackageX,
    titolo: "Il container vuoto sparisce",
    testo: "Dopo la consegna, il rientro del vuoto non lo traccia nessuno, finché non arriva la fattura di detention.",
  },
  {
    icon: Split,
    titolo: "Un sistema per ogni terminal",
    testo: "Ogni terminal ha la sua piattaforma di appuntamenti, la sua logica, i suoi orari. Tu le tieni tutte a mente.",
  },
  {
    icon: Phone,
    titolo: "Il coordinamento vive nel telefono",
    testo: "Vettori, autisti, clienti: chiamate, email, WhatsApp. Zero vista d'insieme su cosa succede oggi.",
  },
];

function ProblemSection() {
  return (
    <section id="problema" className="flex bg-background py-20 lg:min-h-screen lg:snap-start lg:items-center lg:py-0">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">Il problema</p>
          <h2 className="text-3xl font-bold text-navy">Il tuo lavoro è coordinare. Il tuo strumento è ancora il telefono.</h2>
          <p className="mt-3 text-muted">Quattro sistemi diversi, zero vista d&apos;insieme. Il rischio lo paghi tu.</p>
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

const STEPS = [
  { numero: "1", titolo: "15 minuti, non 15 slide", testo: "Ti mostriamo Movr che gira davvero, con dati vicini ai tuoi." },
  { numero: "2", titolo: "Lo usi sul prossimo carico", testo: "Gratis, zero contratto. Provi solo il pezzo che ti serve: appuntamenti e notifiche." },
  { numero: "3", titolo: "Un canale diretto con chi lo costruisce", testo: "15 minuti a settimana di feedback. Quello che non va, cambia la settimana dopo, non nel prossimo rilascio annuale." },
];

function HowItWorksSection() {
  return (
    <section id="come-funziona" className="flex bg-background py-20 lg:min-h-screen lg:snap-start lg:items-center lg:py-0">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">Come funziona</p>
          <h2 className="text-3xl font-bold text-navy">Non un altro gestionale da mesi di onboarding.</h2>
          <p className="mt-3 text-muted">
            Cerchiamo i primi design partner: aziende che usano Movr gratis in cambio di un canale diretto per
            dirci cosa serve davvero.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.numero} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                {s.numero}
              </div>
              <h3 className="text-base font-semibold text-navy">{s.titolo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.testo}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section id="contatti" className="flex bg-white py-20 lg:min-h-screen lg:snap-start lg:items-center lg:py-0">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <div className="mb-4 flex justify-center gap-2">
          {[CalendarCheck, Smartphone, Undo2].map((Icon, i) => (
            <div key={i} className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/10">
              <Icon className="h-4.5 w-4.5 text-teal" />
            </div>
          ))}
        </div>
        <h2 className="text-3xl font-bold text-navy">Coordini spedizioni senza avere una flotta?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Ne parliamo in 15 minuti. Ti mostriamo la piattaforma, tu ci dici se risolve un problema vero per la tua
          azienda: niente slide, niente impegno.
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
          Gratis per i primi design partner · nessun impegno
        </p>
        <p className="mt-6 text-sm text-muted">
          Sei uno spedizioniere doganale a Genova?{" "}
          <Link href="/genova" className="font-semibold text-teal hover:underline">
            Guarda la pagina dedicata →
          </Link>
        </p>
      </div>
    </section>
  );
}
