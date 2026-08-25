import Link from "next/link";
import { Anchor } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
        <Anchor className="h-4 w-4 text-white" />
      </div>
      <span className="text-lg font-bold tracking-tight text-navy">Clyo</span>
    </Link>
  );
}

export function Nav({ genovaLink = true }: { genovaLink?: boolean }) {
  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
          <Link href="/#problema" className="hover:text-navy">
            Il problema
          </Link>
          <Link href="/#prodotto" className="hover:text-navy">
            Prodotto
          </Link>
          {genovaLink && (
            <Link href="/genova" className="hover:text-navy">
              Genova
            </Link>
          )}
        </nav>
        <a
          href="#contatti"
          className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-dark"
        >
          Richiedi una demo
        </a>
      </div>
    </header>
  );
}

export function Footer({ genovaLink = true }: { genovaLink?: boolean }) {
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <Logo />
        <div className="flex items-center gap-5 text-xs text-muted">
          {genovaLink ? (
            <Link href="/genova" className="hover:text-navy">
              Clyo a Genova
            </Link>
          ) : (
            <Link href="/" className="hover:text-navy">
              ← Clyo
            </Link>
          )}
          <span>Genova, Italia · © 2026</span>
        </div>
      </div>
    </footer>
  );
}
