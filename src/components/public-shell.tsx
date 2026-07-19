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
      {/* Editorial masthead — two-tier */}
      <header className="sticky top-0 z-40 bg-page/85 backdrop-blur-md border-b border-rule">
        {/* Utility strip */}
        <div className="border-b border-rule/70">
          <div className="max-w-6xl mx-auto px-4 md:px-8 h-8 flex items-center justify-between text-[10.5px] font-mono tracking-[0.18em] uppercase text-ink-faint">
            <span>ISSN 2010-5584 · Peer-reviewed</span>
            <div className="flex items-center gap-5">
              <span className="hidden sm:inline">Toshkent · 2026</span>
              <Link to="/auth" className="hover:text-ink transition-colors">
                Kirish
              </Link>
            </div>
          </div>
        </div>

        {/* Main row */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center gap-8">
          <Link to="/" className="flex items-baseline gap-3 shrink-0 group">
            <span className="text-[17px] font-semibold tracking-tight leading-none">
              O‘zbek tili
              <span className="text-ink-muted"> va adabiyoti</span>
            </span>
            <span className="hidden lg:inline text-[10px] font-mono tracking-[0.2em] uppercase text-ink-faint">
              Ilmiy jurnal
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 mx-auto">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={n.exact ? { exact: true } : undefined}
                className="relative px-3 py-2 text-[13.5px] text-ink-soft hover:text-ink transition-colors"
                activeProps={{
                  className:
                    "relative px-3 py-2 text-[13.5px] font-medium text-ink after:content-[''] after:absolute after:left-3 after:right-3 after:-bottom-[13px] after:h-[2px] after:bg-[color:var(--accent-oxblood)]",
                }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/auth"
              search={{ next: "/submissions/new" } as never}
              className="group inline-flex items-center gap-2 rounded-full bg-ink hover:bg-[color:var(--accent-oxblood)] text-page px-4 py-2 text-[13px] font-medium tracking-tight transition-colors"
            >
              Maqola yuborish
              <span aria-hidden className="translate-x-0 group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
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
