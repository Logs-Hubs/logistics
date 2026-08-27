"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarClock, Ship, Smartphone, Anchor, Truck, Stamp, FileStack } from "lucide-react";
import { cn } from "@/lib/utils";

type ModuloKey = "porti" | "flotta" | "dogana";

const NAV: Record<ModuloKey, { href: string; label: string; icon: React.ElementType }[]> = {
  porti: [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/calendario", label: "Appuntamenti", icon: CalendarClock },
    { href: "/spedizioni/SP-2463", label: "Tracking spedizione", icon: Ship },
    { href: "/driver", label: "Vista driver", icon: Smartphone },
  ],
  flotta: [{ href: "/flotta", label: "Centro comando flotta", icon: Truck }],
  dogana: [{ href: "/customs", label: "Casi doganali", icon: FileStack }],
};

const ICONA_MODULO: Record<ModuloKey, React.ElementType> = { porti: Anchor, flotta: Truck, dogana: Stamp };
const SOTTOTITOLO_MODULO: Record<ModuloKey, string> = {
  porti: "Genova · Savona-Vado",
  flotta: "Autotrasportatori PMI",
  dogana: "Customs Brain",
};
const FOOTER_MODULO: Record<ModuloKey, { titolo: string; sub: string }> = {
  porti: { titolo: "Spediservices Genova", sub: "Account demo · design partner" },
  flotta: { titolo: "Verticale in valutazione", sub: "Dati demo, non collegato a Supabase" },
  dogana: { titolo: "Estrazione documenti mock", sub: "Non collegato a Supabase, agganciato alle spedizioni Porti" },
};

const SWITCHER: { modulo: ModuloKey; href: string; label: string }[] = [
  { modulo: "porti", href: "/", label: "Porti" },
  { modulo: "flotta", href: "/flotta", label: "Flotte" },
  { modulo: "dogana", href: "/customs", label: "Dogana" },
];

function moduloAttivo(pathname: string): ModuloKey {
  if (pathname.startsWith("/flotta")) return "flotta";
  if (pathname.startsWith("/customs")) return "dogana";
  return "porti";
}

export function Sidebar() {
  const pathname = usePathname();
  const modulo = moduloAttivo(pathname);
  const nav = NAV[modulo];
  const Icona = ICONA_MODULO[modulo];
  const footer = FOOTER_MODULO[modulo];

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-shrink-0 flex-col bg-navy-dark text-white">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
          <Icona className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold leading-tight">Movr</div>
          <div className="text-[11px] text-teal-light/80">{SOTTOTITOLO_MODULO[modulo]}</div>
        </div>
      </div>

      <div className="mx-3 mb-4 flex gap-1 rounded-lg bg-white/5 p-1 text-xs font-medium">
        {SWITCHER.map((s) => (
          <Link
            key={s.modulo}
            href={s.href}
            className={cn(
              "flex-1 rounded-md px-2 py-1.5 text-center transition-colors",
              modulo === s.modulo ? "bg-white/15 text-white" : "text-teal-light/70 hover:text-white"
            )}
          >
            {s.label}
          </Link>
        ))}
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {nav.map((item) => {
          const section = "/" + item.href.split("/")[1];
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(section) && section !== "/";
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-white/10 text-white" : "text-teal-light/90 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 mb-4 rounded-lg bg-white/5 px-4 py-3">
        <div className="text-xs font-semibold text-white/90">{footer.titolo}</div>
        <div className="mt-0.5 text-[11px] text-teal-light/70">{footer.sub}</div>
      </div>
    </aside>
  );
}
