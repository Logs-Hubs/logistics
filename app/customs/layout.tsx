import { CustomsProvider } from "@/lib/customs/store";

export default function CustomsLayout({ children }: { children: React.ReactNode }) {
  return <CustomsProvider>{children}</CustomsProvider>;
}
