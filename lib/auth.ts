// Sessione di login per la piattaforma: sostituisce il popup nativo di Basic Auth con un cookie
// firmato, verificabile sia in middleware (Edge runtime) sia nella route API (Node), per questo usa
// Web Crypto (disponibile in entrambi) invece di 'node:crypto'. Stesso livello di sicurezza di prima
// (un'unica password condivisa in BASIC_AUTH_USER/PASS): qui cambia solo l'esperienza di login, non
// il modello di minaccia.

const DURATA_SESSIONE_SECONDI = 60 * 60 * 24 * 7; // 7 giorni
export const NOME_COOKIE_SESSIONE = "movr_session";

async function hmac(secret: string, messaggio: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const firma = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(messaggio));
  return Array.from(new Uint8Array(firma))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function creaCookieSessione(secret: string): Promise<string> {
  const scadenza = Math.floor(Date.now() / 1000) + DURATA_SESSIONE_SECONDI;
  const firma = await hmac(secret, String(scadenza));
  return `${scadenza}.${firma}`;
}

export async function verificaCookieSessione(valore: string | undefined, secret: string): Promise<boolean> {
  if (!valore) return false;
  const [scadenzaStr, firma] = valore.split(".");
  if (!scadenzaStr || !firma) return false;
  const scadenza = Number(scadenzaStr);
  if (!Number.isFinite(scadenza) || scadenza < Math.floor(Date.now() / 1000)) return false;
  const firmaAttesa = await hmac(secret, scadenzaStr);
  return firma === firmaAttesa;
}
