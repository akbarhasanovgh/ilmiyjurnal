import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/public-shell";
import { ARCHIVE_VOLUMES } from "@/lib/archive-preview";

export const Route = createFileRoute("/arxiv/")({
  head: () => ({
    meta: [
      { title: "Arxiv — O‘zbek tili va adabiyoti" },
      {
        name: "description",
        content:
          "Jurnalning nashr etilgan jildlari va sonlari arxivi. Har bir jildni ochib, undagi maqolalarni ko‘ring.",
      },
    ],
  }),
  component: ArchiveIndex,
});

function ArchiveIndex() {
  const totalIssues = ARCHIVE_VOLUMES.reduce((acc, v) => acc + v.issues.length, 0);
  const totalPapers = ARCHIVE_VOLUMES.reduce(
    (acc, v) => acc + v.issues.reduce((a, i) => a + i.papers.length, 0),
    0,
  );

  return (
    <PublicShell>
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-8 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12.5px] text-ink-muted mb-6">
          <Link to="/" className="hover:text-ink transition-colors">
            Bosh sahifa
          </Link>
          <span className="text-ink-faint">›</span>
          <span className="text-ink">Arxiv</span>
        </nav>

        {/* Hero */}
        <div className="rounded-3xl bg-[color:var(--surface-sunken)] p-8 md:p-10 mb-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-[42rem]">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[color:var(--accent-oxblood)] text-page text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                Arxiv
              </span>
              <h1
                className="font-semibold leading-tight tracking-tight text-ink"
                style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
              >
                Nashr etilgan jildlar
              </h1>
              <p className="mt-4 text-[14px] text-ink-soft leading-relaxed max-w-[64ch]">
                “Filologiya va Pedagogika” jurnalining raqamli arxivi. Har bir
                jild yil davomida chiqarilgan sonlarni birlashtiradi. Jildni
                tanlab, undagi sonlar va maqolalar ro‘yxatini ochishingiz
                mumkin.
              </p>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-faint">Jildlar</p>
                <p className="text-3xl font-semibold text-ink mt-1 tabular-nums">
                  {ARCHIVE_VOLUMES.length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-faint">Sonlar</p>
                <p className="text-3xl font-semibold text-ink mt-1 tabular-nums">
                  {totalIssues}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-faint">Maqolalar</p>
                <p className="text-3xl font-semibold text-ink mt-1 tabular-nums">
                  {totalPapers}
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Volume list */}
        <ul className="space-y-4">
          {ARCHIVE_VOLUMES.map((v) => {
            const hasIssues = v.issues.length > 0;
            return (
              <li
                key={v.volume}
                className="rounded-3xl bg-[color:var(--page-elevated)] border border-rule p-6 md:p-8 shadow-[0_1px_0_rgba(23,20,18,0.03)]"
              >
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 mb-5">
                  <span className="text-2xl md:text-3xl font-semibold text-ink leading-none">
                    {v.volume}-jild
                  </span>
                  <span className="text-[12px] font-mono tracking-wider text-ink-faint">
                    {v.year}
                  </span>
                  <span className="ml-auto text-[10px] uppercase tracking-[0.22em] text-ink-muted">
                    {hasIssues
                      ? `${v.issues.length} ta son`
                      : "Sonlar tayyorlanmoqda"}
                  </span>
                </div>

                {hasIssues ? (
                  <ul className="flex flex-wrap gap-2">
                    {v.issues.map((i) => (
                      <li key={i.number}>
                        <Link
                          to="/arxiv/$jild/$son"
                          params={{
                            jild: String(i.volume),
                            son: String(i.number),
                          }}
                          className="inline-flex items-baseline gap-3 rounded-full border border-rule-strong bg-[color:var(--surface-sunken)] px-4 py-2 hover:border-[color:var(--accent-oxblood)] hover:text-[color:var(--accent-oxblood)] transition-colors"
                        >
                          <span className="text-[13px] font-semibold">
                            {i.number}-son
                          </span>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                            {i.month}
                          </span>
                          <span className="text-[11px] font-mono text-ink-faint tabular-nums">
                            {i.papers.length}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[13px] text-ink-faint italic">
                    Ushbu jildning raqamli nusxalari arxivga kiritilmoqda.
                  </p>
                )}
              </li>
            );
          })}
        </ul>

        <p className="mt-10 text-[10px] uppercase tracking-[0.22em] text-ink-faint text-center">
          Arxiv 1958 — 2026
        </p>
      </div>
    </PublicShell>
  );
}
