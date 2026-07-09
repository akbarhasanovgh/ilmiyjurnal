import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AuthorShell } from "@/components/author-shell";
import { ARCHIVE_VOLUMES, type ArchivePaper } from "@/lib/archive-preview";

export const Route = createFileRoute("/_authenticated/kutubxona")({
  head: () => ({ meta: [{ title: "Jurnal arxivi" }, { name: "robots", content: "noindex" }] }),
  component: Kutubxona,
});

type Row = ArchivePaper & { volume: number; number: number; year: number; month: string };

function Kutubxona() {
  const rows: Row[] = useMemo(
    () =>
      ARCHIVE_VOLUMES.flatMap((v) =>
        v.issues.flatMap((i) =>
          i.papers.map((p) => ({
            ...p,
            volume: v.volume,
            number: i.number,
            year: i.year,
            month: i.month,
          })),
        ),
      ),
    [],
  );

  const [issueFilter, setIssueFilter] = useState<Set<string>>(new Set());
  const [fieldFilter, setFieldFilter] = useState<Set<string>>(new Set());

  const issues = useMemo(() => {
    const seen = new Map<string, { key: string; label: string; count: number }>();
    for (const r of rows) {
      const key = `${r.volume}-${r.number}`;
      const prev = seen.get(key);
      if (prev) prev.count += 1;
      else seen.set(key, { key, label: `${r.volume}-jild, ${r.number}-son`, count: 1 });
    }
    return Array.from(seen.values());
  }, [rows]);

  const fields = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of rows) m.set(r.field, (m.get(r.field) ?? 0) + 1);
    return Array.from(m.entries()).map(([label, count]) => ({ label, count }));
  }, [rows]);

  const filtered = rows.filter((r) => {
    if (issueFilter.size > 0 && !issueFilter.has(`${r.volume}-${r.number}`)) return false;
    if (fieldFilter.size > 0 && !fieldFilter.has(r.field)) return false;
    return true;
  });

  const toggle = (set: Set<string>, key: string, setState: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setState(next);
  };

  return (
    <AuthorShell>
      <div className="px-10 md:px-14 py-12">
        <header className="mb-10 max-w-3xl">
          <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-muted-foreground">
            Jurnal arxivi
          </p>
          <h1 className="font-serif text-[36px] leading-tight tracking-tight mt-3 text-foreground">
            Maqolalar
          </h1>
          <p className="text-[14px] text-muted-foreground mt-3 leading-relaxed">
            Nashr etilgan sonlardagi maqolalar ro‘yxati. Har bir maqola tegishli
            sonning ichida ochiladi.
          </p>
        </header>

        <div className="grid grid-cols-12 gap-10">
          {/* Facets */}
          <aside className="col-span-12 md:col-span-3 space-y-8">
            <FilterGroup title="Jild va son">
              {issues.map((i) => (
                <FilterRow
                  key={i.key}
                  label={i.label}
                  count={i.count}
                  checked={issueFilter.has(i.key)}
                  onChange={() => toggle(issueFilter, i.key, setIssueFilter)}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Yo‘nalish">
              {fields.map((f) => (
                <FilterRow
                  key={f.label}
                  label={f.label}
                  count={f.count}
                  checked={fieldFilter.has(f.label)}
                  onChange={() => toggle(fieldFilter, f.label, setFieldFilter)}
                />
              ))}
            </FilterGroup>
          </aside>

          {/* List */}
          <section className="col-span-12 md:col-span-9">
            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border/70 p-12 text-center">
                <p className="font-serif text-[18px] text-foreground">
                  Filtrlar bo‘yicha maqola topilmadi
                </p>
                <p className="text-[13px] text-muted-foreground mt-2">
                  Filtrni tozalab, boshqadan urinib ko‘ring.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border/60 border-y border-border/60">
                {filtered.map((r) => (
                  <li key={r.manuscriptId} className="py-7">
                    <div className="flex items-baseline justify-between gap-6 mb-3">
                      <p className="text-[10.5px] font-semibold tracking-[0.16em] uppercase text-muted-foreground">
                        {r.field}
                      </p>
                      <p className="text-[11.5px] font-mono tracking-wide text-muted-foreground shrink-0">
                        {r.manuscriptId}
                      </p>
                    </div>
                    <h2 className="font-serif text-[22px] leading-snug tracking-tight text-foreground">
                      {r.title}
                    </h2>
                    <p className="text-[13.5px] text-foreground mt-2">{r.authors}</p>
                    {r.affiliation && (
                      <p className="text-[12.5px] text-muted-foreground mt-1 italic">
                        {r.affiliation}
                      </p>
                    )}
                    {r.excerpt && (
                      <p className="text-[13.5px] text-muted-foreground mt-3 leading-relaxed max-w-[68ch]">
                        {r.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-5 mt-5 text-[12px] text-muted-foreground">
                      <span>
                        {r.volume}-jild, {r.number}-son · {r.month} {r.year}
                      </span>
                      <span className="font-mono">bet {r.pages}</span>
                      <Link
                        to="/arxiv/$jild/$son"
                        params={{ jild: String(r.volume), son: String(r.number) }}
                        className="ml-auto text-[12.5px] text-foreground underline underline-offset-4 decoration-1 hover:decoration-2 transition-all"
                      >
                        Sonda ko‘rish →
                      </Link>
                    </div>
                    {r.keywords && r.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {r.keywords.map((k) => (
                          <span
                            key={k}
                            className="text-[11px] px-2 py-0.5 rounded-full border border-border/60 text-muted-foreground"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </AuthorShell>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-foreground mb-3">
        {title}
      </p>
      <ul className="space-y-1.5">{children}</ul>
    </div>
  );
}

function FilterRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <li>
      <label className="flex items-center gap-2.5 text-[13px] text-foreground cursor-pointer group">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-3.5 h-3.5 rounded-sm border-border accent-foreground"
        />
        <span className="flex-1 group-hover:text-foreground transition-colors">
          {label}
        </span>
        <span className="text-[11.5px] font-mono text-muted-foreground">({count})</span>
      </label>
    </li>
  );
}
