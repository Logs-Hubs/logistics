"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarClock, Ship, Smartphone, Anchor, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_CLYO = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calendario", label: "Appuntamenti", icon: CalendarClock },
  { href: "/spedizioni/SP-2463", label: "Tracking spedizione", icon: Ship },
  { href: "/driver", label: "Vista driver", icon: Smartphone },
];

const NAV_FLOTTA = [{ href: "/flotta", label: "Centro comando flotta", icon: Truck }];

export function Sidebar() {
  const pathname = usePathname();
  const inFlotta = pathname.startsWith("/flotta");
  const nav = inFlotta ? NAV_FLOTTA : NAV_CLYO;

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-shrink-0 flex-col bg-navy-dark text-white">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
          {inFlotta ? <Truck className="h-5 w-5 text-white" /> : <Anchor className="h-5 w-5 text-white" />}
        </div>
        <div>
          <div className="text-sm font-semibold leading-tight">{inFlotta ? "AI Transport Manager" : "Clyo"}</div>
          <div className="text-[11px] text-teal-light/80">{inFlotta ? "Autotrasportatori PMI" : "Genova · Savona-Vado"}</div>
        </div>
      </div>

      <div className="mx-3 mb-4 flex gap-1 rounded-lg bg-white/5 p-1 text-xs font-medium">
        <Link
          href="/"
          className={cn("flex-1 rounded-md px-2 py-1.5 text-center transition-colors", !inFlotta ? "bg-white/15 text-white" : "text-teal-light/70 hover:text-white")}
        >
          Clyo
        </Link>
        <Link
          href="/flotta"
          className={cn("flex-1 rounded-md px-2 py-1.5 text-center transition-colors", inFlotta ? "bg-white/15 text-white" : "text-teal-light/70 hover:text-white")}
        >
          Fleet AI
        </Link>
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
        {inFlotta ? (
          <>
            <div className="text-xs font-semibold text-white/90">Verticale in valutazione</div>
            <div className="mt-0.5 text-[11px] text-teal-light/70">Dati demo, non collegato a Supabase</div>
          </>
        ) : (
          <>
            <div className="text-xs font-semibold text-white/90">Spediservices Genova</div>
            <div className="mt-0.5 text-[11px] text-teal-light/70">Account demo · design partner</div>
          </>
        )}
      </div>
    </aside>
  );
}
