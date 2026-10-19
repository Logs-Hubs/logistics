import { Container } from "lucide-react";

export const metadata = {
  title: "Accedi · Movr",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-dark px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
            <Container className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-xl text-white">Movr</span>
        </div>

        <form action="/api/login" method="POST" className="rounded-xl bg-white/5 p-7">
          <h1 className="font-display text-lg text-white">Accedi alla piattaforma</h1>
          <p className="mt-1 text-sm text-teal-light/80">Credenziali fornite dal tuo referente Movr.</p>

          {error ? (
            <p className="mt-4 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-300">
              Utente o password non corretti.
            </p>
          ) : null}

          <input type="hidden" name="next" value={next ?? "/"} />

          <div className="mt-5 space-y-3">
            <div>
              <label htmlFor="user" className="mb-1.5 block text-xs font-medium text-teal-light/90">
                Utente
              </label>
              <input
                id="user"
                name="user"
                type="text"
                autoComplete="username"
                autoFocus
                required
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-teal-light/40 focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="pass" className="mb-1.5 block text-xs font-medium text-teal-light/90">
                Password
              </label>
              <input
                id="pass"
                name="pass"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-teal-light/40 focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal"
          >
            Accedi
          </button>
        </form>
      </div>
    </div>
  );
}
