import { NextRequest, NextResponse } from "next/server";
import { NOME_COOKIE_SESSIONE, verificaCookieSessione } from "@/lib/auth";

// Login davanti a tutta la piattaforma: una pagina brandizzata (/login) al posto del popup nativo
// di Basic Auth, che resta comunque la stessa unica password condivisa (BASIC_AUTH_USER/PASS nelle
// Environment Variables di Vercel, mai nel codice — il repo e' pubblico). Se non sono configurate,
// l'accesso resta aperto (comodo in sviluppo locale), come prima.
export async function proxy(request: NextRequest) {
  // x-pathname permette al root layout (Server Component, non vede l'URL corrente di suo) di
  // riconoscere /login e saltare Sidebar/fetch dati, senza duplicare l'intero albero dei layout
  // per una singola pagina. Serve in ogni ramo qui sotto, non solo in quello autenticato.
  const headers = new Headers(request.headers);
  headers.set("x-pathname", request.nextUrl.pathname);
  const next = () => NextResponse.next({ request: { headers } });

  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASS;

  if (!user || !pass) {
    return next();
  }

  // /login e /api/login devono restare raggiungibili senza sessione, altrimenti nessuno
  // potrebbe mai autenticarsi (loop di redirect).
  if (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/api/login") {
    return next();
  }

  const cookie = request.cookies.get(NOME_COOKIE_SESSIONE)?.value;
  if (await verificaCookieSessione(cookie, pass)) {
    return next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Lascia fuori gli asset statici e le API del driver (hanno gia' la loro auth
  // via DRIVER_API_KEY, e l'app iOS non puo' rispondere a un prompt di login).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png|api/driver).*)"],
};
