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
      else seen.set(key, { key, label: `${r.volume}-jild · ${r.number}-son`, count: 1 });
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

  const clearAll = () => {
    setIssueFilter(new Set());
    setFieldFilter(new Set());
  };
  const hasFilters = issueFilter.size + fieldFilter.size > 0;

  return (
    <AuthorShell>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        {/* Hero */}
        <div className="rounded-3xl bg-[color:var(--surface-sunken)] p-8 md:p-10 mb-8">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="max-w-[42rem]">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[color:var(--accent-oxblood)] text-page text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                Jurnal arxivi
              </span>
              <h1
                className="font-semibold leading-tight tracking-tight text-ink"
                style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)" }}
              >
                Maqolalar
              </h1>
              <p className="mt-3 text-[14px] text-ink-soft leading-relaxed max-w-[60ch] mx-auto">
                Nashr etilgan sonlardagi maqolalar ro‘yxati. Yo‘nalish yoki son
                bo‘yicha filtrlang.
              </p>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-faint">Maqolalar</p>
                <p className="text-3xl font-semibold text-ink mt-1 tabular-nums">{filtered.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Facets */}
          <aside className="col-span-12 md:col-span-3 space-y-4">
            <div className="rounded-3xl bg-[color:var(--page-elevated)] border border-rule p-6">
              <div className="flex items-baseline justify-between mb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink">Filtrlar</p>
                {hasFilters && (
                  <button
                    onClick={clearAll}
                    className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[color:var(--accent-oxblood)] hover:opacity-80"
                  >
                    Tozalash
                  </button>
                )}
              </div>
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
              <div className="h-px bg-[color:var(--rule)] my-5" />
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
            </div>
          </aside>

          {/* List */}
          <section className="col-span-12 md:col-span-9 space-y-4">
            {filtered.length === 0 ? (
              <div className="rounded-3xl bg-[color:var(--page-elevated)] border border-rule p-12 text-center">
                <p className="text-lg font-semibold text-ink">Maqola topilmadi</p>
                <p className="text-[13px] text-ink-muted mt-2">
                  Filtrni tozalab, boshqadan urinib ko‘ring.
                </p>
              </div>
            ) : (
              filtered.map((r) => (
                <article
                  key={r.manuscriptId}
                  className="rounded-3xl bg-[color:var(--page-elevated)] border border-rule p-6 md:p-8 shadow-[0_1px_0_rgba(23,20,18,0.03)]"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[color:var(--accent-oxblood)] text-page text-[10px] font-bold uppercase tracking-[0.2em]">
                      {r.field}
                    </span>
                    <span className="text-[11.5px] font-mono tracking-wider text-ink-faint">
                      {r.manuscriptId}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-[22px] font-semibold leading-snug tracking-tight text-ink">
                    {r.title}
                  </h2>
                  <p className="text-[13.5px] text-ink mt-3">{r.authors}</p>
                  {r.affiliation && (
                    <p className="text-[12.5px] text-ink-muted mt-1 italic">{r.affiliation}</p>
                  )}
                  {r.excerpt && (
                    <p className="text-[13.5px] text-ink-soft mt-3 leading-relaxed max-w-[70ch]">
                      {r.excerpt}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 mt-5 text-[12px] text-ink-muted">
                    <span>
                      {r.volume}-jild · {r.number}-son · {r.month} {r.year}
                    </span>
                    <span className="font-mono">bet {r.pages}</span>
                    <Link
                      to="/arxiv/$jild/$son"
                      params={{ jild: String(r.volume), son: String(r.number) }}
                      className="ml-auto inline-flex items-center rounded-full border border-rule-strong bg-[color:var(--surface-sunken)] px-4 py-1.5 text-[12px] font-semibold text-ink hover:border-[color:var(--accent-oxblood)] hover:text-[color:var(--accent-oxblood)] transition-colors"
                    >
                      Sonda ko‘rish →
                    </Link>
                  </div>
                  {r.keywords && r.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {r.keywords.map((k) => (
                        <span
                          key={k}
                          className="text-[11px] px-2.5 py-0.5 rounded-full bg-[color:var(--surface-sunken)] text-ink-muted"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))
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
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-muted mb-3">
        {title}
      </p>
      <ul className="space-y-1">{children}</ul>
    </div>
  );
}

function FilterRow({
  label, count, checked, onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <li>
      <label
        className={`flex items-center gap-2.5 text-[13px] cursor-pointer px-2.5 py-1.5 rounded-2xl transition-colors ${
          checked ? "bg-[color:var(--surface-sunken)] text-ink" : "text-ink-soft hover:bg-[color:var(--surface-sunken)]"
        }`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-3.5 h-3.5 rounded-sm accent-[color:var(--accent-oxblood)]"
        />
        <span className="flex-1">{label}</span>
        <span className="text-[11px] font-mono text-ink-faint">({count})</span>
      </label>
    </li>
  );
}
