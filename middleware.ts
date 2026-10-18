import { NextRequest, NextResponse } from "next/server";

// Basic Auth davanti a tutta la piattaforma: il repo e' pubblico, quindi le
// credenziali vivono solo nelle Environment Variables di Vercel (BASIC_AUTH_USER /
// BASIC_AUTH_PASS), mai nel codice. Se non sono configurate, l'accesso resta aperto
// (comodo in sviluppo locale).
export function middleware(request: NextRequest) {
  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASS;

  if (!user || !pass) {
    return NextResponse.next();
  }

  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    const decoded = Buffer.from(auth.slice(6), "base64").toString("utf-8");
    const separatorIndex = decoded.indexOf(":");
    const u = decoded.slice(0, separatorIndex);
    const p = decoded.slice(separatorIndex + 1);
    if (u === user && p === pass) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Autenticazione richiesta", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Movr"' },
  });
}

export const config = {
  // Lascia fuori gli asset statici e le API del driver (hanno gia' la loro auth
  // via DRIVER_API_KEY, e l'app iOS non puo' rispondere a un prompt Basic Auth).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/driver).*)"],
};
