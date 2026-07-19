import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Bosh sahifa", exact: true as const },
  { to: "/joriy-son", label: "Joriy son" },
  { to: "/arxiv", label: "Arxiv" },
  { to: "/for-authors", label: "Mualliflar uchun" },
  { to: "/about", label: "Jurnal haqida" },
];

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-page text-ink flex flex-col">
      {/* Top bar — floating pill-nav feel */}
      <header className="pt-5 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 rounded-full bg-[color:var(--page-elevated)] border border-rule px-5 py-2.5 shadow-[0_1px_0_rgba(23,20,18,0.04)]">
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <span
                aria-hidden
                className="grid place-items-center w-8 h-8 rounded-full bg-[color:var(--accent-oxblood)] text-page text-[13px] font-bold tracking-tight"
              >
                O
              </span>
              <span className="text-[13px] font-semibold tracking-tight text-ink group-hover:text-[color:var(--accent-oxblood)] transition-colors">
                O‘zbek tili va adabiyoti
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 ml-4">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={n.exact ? { exact: true } : undefined}
                  className="px-3 py-1.5 rounded-full text-[13px] text-ink-soft hover:text-ink hover:bg-[color:var(--surface-sunken)] transition-colors"
                  activeProps={{
                    className:
                      "px-3 py-1.5 rounded-full text-[13px] font-medium bg-[color:var(--surface-sunken)] text-ink",
                  }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <Link
                to="/auth"
                className="hidden sm:inline-flex px-3 py-1.5 rounded-full text-[13px] text-ink-soft hover:text-ink hover:bg-[color:var(--surface-sunken)] transition-colors"
              >
                Kirish
              </Link>
              <Link
                to="/auth"
                search={{ next: "/submissions/new" } as never}
                className="inline-flex items-center rounded-full bg-[color:var(--accent-oxblood)] hover:bg-[color:var(--accent-oxblood-strong)] text-page px-4 py-1.5 text-[13px] font-semibold transition-colors"
              >
                Maqola yuborish
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-24 px-4 md:px-8 pb-8">
        <div className="max-w-6xl mx-auto rounded-3xl bg-[color:var(--surface-sunken)] p-10 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="grid place-items-center w-8 h-8 rounded-full bg-[color:var(--accent-oxblood)] text-page text-[13px] font-bold"
                >
                  O
                </span>
                <p className="text-[15px] font-semibold tracking-tight">
                  O‘zbek tili va adabiyoti
                </p>
              </div>
              <p className="text-[13px] text-ink-muted leading-relaxed max-w-[42ch]">
                O‘zbek filologiyasi, tilshunoslik va adabiyotshunoslik bo‘yicha
                ilmiy tadqiqotlar uchun raqamli arxiv va tahririyat infratuzilmasi.
              </p>
              <p className="text-[11px] font-mono text-ink-faint tracking-wider">
                ISSN 2010-5584
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-ink">
                Indekslash
              </p>
              <ul className="text-[13px] space-y-1.5 text-ink-soft">
                <li>Google Scholar</li>
                <li>DOAJ</li>
                <li>OpenAlex</li>
                <li>Crossref (DOI)</li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-ink">
                Tahririyat
              </p>
              <p className="text-[13px] text-ink-muted leading-relaxed">
                Toshkent sh., Shahrisabz ko‘chasi, 33-uy
                <br />
                info@ota-jurnal.uz
              </p>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-rule flex flex-wrap justify-between gap-2 text-[11px] tracking-wide text-ink-faint">
            <span>© 1960–2026 · Barcha huquqlar himoyalangan</span>
            <span className="font-mono">Arxiv 1958 — 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
