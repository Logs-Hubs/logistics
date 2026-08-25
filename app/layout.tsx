import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { OperationsProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Port Trucking OS — Demo",
  description: "Piattaforma per coordinare appuntamenti, tracking e container tra spedizionieri, vettori e terminal portuali di Genova.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className="h-full antialiased">
      <body className="flex min-h-screen bg-background text-foreground">
        <OperationsProvider>
          <Sidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </OperationsProvider>
      </body>
    </html>
  );
}
