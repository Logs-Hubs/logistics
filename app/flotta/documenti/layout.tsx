import { DocumentiProvider } from "@/lib/flotta/documenti/store";

export default function DocumentiLayout({ children }: { children: React.ReactNode }) {
  return <DocumentiProvider>{children}</DocumentiProvider>;
}
