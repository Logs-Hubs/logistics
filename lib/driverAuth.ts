import "server-only";
import { NextRequest } from "next/server";

// Autenticazione minima per l'app driver iOS: una chiave condivisa passata
// come Bearer token. Sufficiente per un test interno TestFlight con pochi
// autisti noti, non è pensata per un rollout pubblico.
export function verificaDriverAuth(request: NextRequest): boolean {
  const atteso = process.env.DRIVER_API_KEY;
  if (!atteso) return false;
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return false;
  return header.slice("Bearer ".length) === atteso;
}
