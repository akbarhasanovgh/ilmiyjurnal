import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-page text-ink flex flex-col">
      <header className="border-b border-rule">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <Link to="/" className="space-y-2 group">
            <span className="label-mono">ISSN 2010-5584 · Ilmiy-nazariy jurnal</span>
            <h1 className="font-serif text-3xl md:text-4xl tracking-tight leading-none text-balance group-hover:text-ink-soft transition-colors">
              O‘zbek tili va adabiyoti
            </h1>
          </Link>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink-soft">
            <Link to="/" className="hover:text-ink transition-colors" activeOptions={{ exact: true }} activeProps={{ className: "text-ink" }}>Bosh sahifa</Link>
            <Link to="/for-authors" className="hover:text-ink transition-colors" activeProps={{ className: "text-ink" }}>Mualliflarga</Link>
            <Link to="/about" className="hover:text-ink transition-colors" activeProps={{ className: "text-ink" }}>Jurnal haqida</Link>
            <Link to="/auth" className="hover:text-ink transition-colors" activeProps={{ className: "text-ink" }}>Kirish</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-rule mt-24">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-3">
            <p className="text-sm font-medium tracking-widest uppercase">O‘T va A</p>
            <p className="text-xs text-ink-muted leading-relaxed max-w-[40ch]">
              O‘zbekiston Respublikasi Fanlar akademiyasi tashkil etgan filologik tadqiqotlar bo‘yicha ilmiy nashr.
            </p>
          </div>
          <div className="space-y-3">
            <p className="label-mono">Indekslash</p>
            <ul className="text-xs space-y-1.5 text-ink-soft">
              <li>Google Scholar</li>
              <li>DOAJ</li>
              <li>OpenAlex</li>
            </ul>
          </div>
          <div className="space-y-3">
            <p className="label-mono">Tahririyat manzili</p>
            <p className="text-xs text-ink-muted leading-relaxed">
              Toshkent sh., Shahrisabz ko‘chasi, 33-uy.<br />
              info@ota-jurnal.uz
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
