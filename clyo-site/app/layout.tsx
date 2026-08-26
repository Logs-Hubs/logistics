import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Movr: coordina il porto senza il telefono",
  description:
    "Movr mette appuntamenti multi-terminal, tracking del mezzo e rientro dei container vuoti in un'unica vista, per gli spedizionieri doganali genovesi.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className="h-full scroll-smooth antialiased lg:snap-y lg:snap-mandatory">
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
