import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Maqolalar", exact: true as const },
  { to: "/joriy-son", label: "Joriy son" },
  { to: "/arxiv", label: "Arxiv" },
  { to: "/for-authors", label: "Mualliflar uchun" },
  { to: "/about", label: "Jurnal haqida" },
];

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-page text-ink flex flex-col">
      <header className="border-b border-rule">
        <div className="max-w-6xl mx-auto px-6 md:px-10 pt-10 pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <Link to="/" className="block group">
              <h1
                className="font-bold tracking-tight leading-[0.95] text-balance uppercase group-hover:text-[color:var(--accent-oxblood)] transition-colors"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                }}
              >
                O‘zbek tili va adabiyoti
              </h1>
              <p className="mt-2 text-[11px] md:text-xs uppercase tracking-[0.22em] font-medium text-ink-muted">
                O‘zbek tili, adabiyoti va filologiyasi bo‘yicha ilmiy jurnal
              </p>
            </Link>
            <div className="md:pl-8 md:border-l border-rule">
              <span className="block text-[10px] uppercase tracking-[0.22em] font-bold text-ink-faint mb-1">
                Joriy son
              </span>
              <span className="text-sm font-medium text-[color:var(--accent-oxblood)]">
                70-jild · 3-son · 2026
              </span>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-between gap-y-3">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] uppercase tracking-[0.15em] font-medium">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={n.exact ? { exact: true } : undefined}
                  className="text-ink hover:text-[color:var(--accent-oxblood)] transition-colors"
                  activeProps={{
                    className: "text-[color:var(--accent-oxblood)] border-b border-[color:var(--accent-oxblood)] pb-0.5",
                  }}
                >
                  {n.label}
                </Link>
              ))}
              <Link
                to="/auth"
                className="text-ink-muted hover:text-ink transition-colors"
              >
                Kirish
              </Link>
            </div>
            <Link
              to="/auth"
              search={{ next: "/submissions/new" } as never}
              className="inline-flex items-center bg-ink text-page px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[color:var(--accent-oxblood)] transition-colors"
            >
              Maqola yuborish
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-rule mt-24">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-3">
            <p
              className="uppercase tracking-tight font-bold"
              style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem" }}
            >
              O‘zbek tili va adabiyoti
            </p>
            <p className="text-xs text-ink-muted leading-relaxed max-w-[42ch]">
              O‘zbek filologiyasi, tilshunoslik va adabiyotshunoslik bo‘yicha
              ilmiy tadqiqotlar uchun raqamli arxiv va tahririyat infratuzilmasi.
            </p>
            <p className="text-[10px] font-mono text-ink-faint tracking-wider">
              ISSN 2010-5584
            </p>
          </div>
          <div className="space-y-3">
            <p className="label-mono">Indekslash</p>
            <ul className="text-xs space-y-1.5 text-ink-soft">
              <li>Google Scholar</li>
              <li>DOAJ</li>
              <li>OpenAlex</li>
              <li>Crossref (DOI)</li>
            </ul>
          </div>
          <div className="space-y-3">
            <p className="label-mono">Tahririyat</p>
            <p className="text-xs text-ink-muted leading-relaxed">
              Toshkent sh., Shahrisabz ko‘chasi, 33-uy
              <br />
              info@ota-jurnal.uz
            </p>
          </div>
        </div>
        <div className="border-t border-rule">
          <div className="max-w-6xl mx-auto px-6 md:px-10 py-4 flex flex-wrap justify-between gap-2 text-[10px] uppercase tracking-[0.22em] text-ink-faint">
            <span>© 1960–2026 · Barcha huquqlar himoyalangan</span>
            <span className="font-mono tracking-wider">Arxiv 1958 — 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
