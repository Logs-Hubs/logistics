import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clyo — Coordina il porto senza il telefono",
  description:
    "Clyo mette appuntamenti multi-terminal, tracking del mezzo e rientro dei container vuoti in un'unica vista, per gli spedizionieri doganali genovesi.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className="h-full antialiased">
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
