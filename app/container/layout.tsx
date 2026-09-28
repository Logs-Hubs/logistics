import { ContainerProvider } from "@/lib/container/store";

export default function ContainerLayout({ children }: { children: React.ReactNode }) {
  return <ContainerProvider>{children}</ContainerProvider>;
}
