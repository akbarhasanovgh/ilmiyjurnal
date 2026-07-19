import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logoAsset from "@/assets/logo.png.asset.json";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";

const NAV = [
  { to: "/", label: "Bosh sahifa", exact: true as const },
  { to: "/joriy-son", label: "Joriy son" },
  { to: "/arxiv", label: "Arxiv" },
  { to: "/for-authors", label: "Mualliflar uchun" },
  { to: "/about", label: "Jurnal haqida" },
];

export function PublicShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-page text-ink flex flex-col">
      {/* Editorial masthead */}
      <header className="sticky top-0 z-40 bg-page/90 backdrop-blur-md border-b border-rule">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center gap-4 lg:gap-8">
          {/* Brand logo */}
          <Link to="/" className="flex items-center shrink-0 group">
            <img
              src={logoAsset.url}
              alt="Til va adabiyot ta'limi"
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 mx-auto">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={n.exact ? { exact: true } : undefined}
                className="relative px-3 py-2 text-[13px] lg:text-[13.5px] text-ink-soft hover:text-ink transition-colors"
                activeProps={{
                  className:
                    "relative px-3 py-2 text-[13px] lg:text-[13.5px] font-medium text-ink after:content-[''] after:absolute after:left-3 after:right-3 after:-bottom-[13px] after:h-[2px] after:bg-[color:var(--accent-oxblood)]",
                }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Link
              to="/auth"
              className="hidden sm:inline-flex px-3 py-2 text-[13px] text-ink-soft hover:text-ink transition-colors"
            >
              Kirish
            </Link>

            <Link
              to="/auth"
              search={{ next: "/submissions/new" } as never}
              className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--accent-oxblood)] hover:bg-[color:var(--accent-oxblood-strong)] text-page px-3 sm:px-4 py-2 text-[12.5px] sm:text-[13px] font-medium tracking-tight transition-colors active:scale-[0.97]"
            >
              <span className="hidden sm:inline">Maqola yuborish</span>
              <span className="sm:hidden">Yuborish</span>
              <span aria-hidden className="translate-x-0 group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>

            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-full bg-surface-sunken text-ink hover:bg-surface-tint transition-colors"
                  aria-label="Menyuni ochish"
                >
                  <Menu className="h-[18px] w-[18px]" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(88vw,320px)] bg-page border-l border-rule p-0">
                <SheetTitle className="sr-only">Asosiy menyu</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between px-5 h-16 border-b border-rule">
                    <span className="text-[15px] font-semibold tracking-tight">Menyu</span>
                    <SheetClose asChild>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-surface-sunken text-ink hover:bg-surface-tint transition-colors"
                        aria-label="Yopish"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </SheetClose>
                  </div>

                  <nav className="flex-1 overflow-auto py-4 px-3">
                    <ul className="space-y-1">
                      {NAV.map((n) => (
                        <li key={n.to}>
                          <SheetClose asChild>
                            <Link
                              to={n.to}
                              activeOptions={n.exact ? { exact: true } : undefined}
                              className="flex items-center rounded-xl px-4 py-3 text-[14px] text-ink-soft hover:bg-surface-tint hover:text-ink transition-colors"
                              activeProps={{
                                className:
                                  "flex items-center rounded-xl px-4 py-3 text-[14px] font-medium bg-accent-oxblood-soft text-[color:var(--accent-oxblood)]",
                              }}
                            >
                              {n.label}
                            </Link>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  <div className="p-4 border-t border-rule space-y-2">
                    <SheetClose asChild>
                      <Link
                        to="/auth"
                        className="flex items-center justify-center w-full rounded-xl px-4 py-3 text-[14px] font-medium text-ink bg-surface-sunken hover:bg-surface-tint transition-colors"
                      >
                        Kirish
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        to="/auth"
                        search={{ next: "/submissions/new" } as never}
                        className="flex items-center justify-center w-full rounded-xl px-4 py-3 text-[14px] font-medium text-page bg-[color:var(--accent-oxblood)] hover:bg-[color:var(--accent-oxblood-strong)] transition-colors"
                      >
                        Maqola yuborish
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-24 px-4 md:px-8 pb-8">
        <div className="max-w-6xl mx-auto rounded-3xl bg-[color:var(--surface-sunken)] p-10 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={logoAsset.url}
                  alt="Til va adabiyot ta'limi"
                  className="h-8 w-auto object-contain"
                />
                <p className="text-[15px] font-semibold tracking-tight">
                  Til va adabiyot ta'limi
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
