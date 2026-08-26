import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { OperationsProvider } from "@/lib/store";
import { getSpedizioni, getTerminals, getVettori } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Movr · Demo",
  description: "Piattaforma per coordinare appuntamenti, tracking e container tra spedizionieri, vettori e terminal portuali di Genova.",
};

// Dati letti da Supabase ad ogni richiesta: niente cache statica per una demo che deve
// riflettere subito le conferme/i ritiri appena registrati.
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [spedizioni, terminals, vettori] = await Promise.all([getSpedizioni(), getTerminals(), getVettori()]);

  return (
    <html lang="it" className="h-full antialiased">
      <body className="flex h-screen overflow-hidden bg-background text-foreground">
        <OperationsProvider spedizioniIniziali={spedizioni} terminals={terminals} vettori={vettori}>
          <Sidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </OperationsProvider>
      </body>
    </html>
  );
}
