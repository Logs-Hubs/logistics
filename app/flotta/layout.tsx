import { PianoProvider } from "@/lib/flotta/store";
import { DocumentiProvider } from "@/lib/flotta/documenti/store";

// DocumentiProvider era annidato solo sotto /flotta/documenti finché nient'altro doveva leggerlo.
// Ora l'Exception Center di Flotte (sotto /flotta) correla anche il fatturato bloccato: promosso
// qui, un solo livello sopra, così resta comunque fuori dal root layout (Porti/Dogana non lo usano).
export default function FlottaLayout({ children }: { children: React.ReactNode }) {
  return (
    <PianoProvider>
      <DocumentiProvider>{children}</DocumentiProvider>
    </PianoProvider>
  );
}
