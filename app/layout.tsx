import type { Metadata } from "next";
import { headers } from "next/headers";
import { Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { OperationsProvider } from "@/lib/store";
import { CustomsProvider } from "@/lib/customs/store";
import { getSpedizioni, getTerminals, getVettori } from "@/lib/queries";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  title: "Movr · Demo",
  description: "Piattaforma per coordinare appuntamenti, tracking e container tra spedizionieri, vettori e terminal portuali di Genova.",
};

// Dati letti da Supabase ad ogni richiesta: niente cache statica per una demo che deve
// riflettere subito le conferme/i ritiri appena registrati.
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // /login non ha bisogno (ne' deve dipendere) dai dati Supabase o dalla Sidebar: e' l'unica
  // pagina raggiungibile senza sessione, deve restare leggera e funzionare anche se Supabase ha
  // un problema. Il pathname arriva dall'header che il middleware imposta sulla request.
  const pathname = (await headers()).get("x-pathname");
  const isLogin = pathname === "/login";

  if (isLogin) {
    return (
      <html lang="it" className={`${bebas.variable} h-full antialiased`}>
        <body className="h-full bg-navy-dark text-foreground">{children}</body>
      </html>
    );
  }

  const [spedizioni, terminals, vettori] = await Promise.all([getSpedizioni(), getTerminals(), getVettori()]);

  return (
    <html lang="it" className={`${bebas.variable} h-full antialiased`}>
      <body className="flex h-screen overflow-hidden bg-background text-foreground">
        <OperationsProvider spedizioniIniziali={spedizioni} terminals={terminals} vettori={vettori}>
          <CustomsProvider>
            <Sidebar />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </CustomsProvider>
        </OperationsProvider>
      </body>
    </html>
  );
}
