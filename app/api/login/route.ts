import { NextRequest, NextResponse } from "next/server";
import { creaCookieSessione, NOME_COOKIE_SESSIONE } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const user = form.get("user");
  const pass = form.get("pass");
  const next = typeof form.get("next") === "string" ? (form.get("next") as string) : "/";

  const attesoUser = process.env.BASIC_AUTH_USER;
  const attesoPass = process.env.BASIC_AUTH_PASS;

  const loginUrl = new URL("/login", request.url);

  if (!attesoUser || !attesoPass || user !== attesoUser || pass !== attesoPass) {
    loginUrl.searchParams.set("error", "1");
    if (next !== "/") loginUrl.searchParams.set("next", next);
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  // Destinazione sicura: solo un percorso interno, mai un URL assoluto (evita open redirect).
  const destinazione = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  const response = NextResponse.redirect(new URL(destinazione, request.url), { status: 303 });
  response.cookies.set(NOME_COOKIE_SESSIONE, await creaCookieSessione(attesoPass), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
