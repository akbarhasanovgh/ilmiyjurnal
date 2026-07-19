import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/public-shell";
import { ArticleCard } from "@/components/article-card";
import { CURRENT_ISSUE } from "@/lib/archive-preview";

export const Route = createFileRoute("/joriy-son")({
  head: () => ({
    meta: [
      {
        title: `Joriy son — ${CURRENT_ISSUE.volume}-jild · ${CURRENT_ISSUE.number}-son`,
      },
      {
        name: "description",
        content: `O‘zbek tili va adabiyoti jurnalining joriy soni: ${CURRENT_ISSUE.volume}-jild, ${CURRENT_ISSUE.number}-son (${CURRENT_ISSUE.month} ${CURRENT_ISSUE.year}). ${CURRENT_ISSUE.papers.length} ta maqola.`,
      },
    ],
  }),
  component: CurrentIssuePage,
});

function CurrentIssuePage() {
  const issue = CURRENT_ISSUE;
  return (
    <PublicShell>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
        <div className="border-b border-ink pb-5 mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label-mono mb-2 text-[color:var(--accent-oxblood)]">
              Joriy son · {issue.month} {issue.year}
            </p>
            <h1
              className="font-medium leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 2.75rem)",
              }}
            >
              {issue.volume}-jild · {issue.number}-son
            </h1>
            <p className="mt-3 text-sm text-ink-soft max-w-[64ch]">
              Ushbu sondagi maqolalar tahririyat tomonidan tayyorlangan va
              ikki tomonlama anonim taqrizdan o‘tgan.
            </p>
          </div>
          <div className="flex items-end gap-8">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                Maqolalar
              </p>
              <p className="text-2xl font-mono">{issue.papers.length}</p>
            </div>
            <Link
              to="/arxiv"
              className="text-[11px] font-bold uppercase tracking-[0.2em] border-b border-ink pb-0.5 hover:text-[color:var(--accent-oxblood)] hover:border-[color:var(--accent-oxblood)] transition-colors"
            >
              Arxiv
            </Link>
          </div>
        </div>

        <ol className="border-y border-rule">
          {issue.papers.map((p, idx) => (
            <li
              key={p.manuscriptId}
              className={
                "py-8 " +
                (idx !== issue.papers.length - 1 ? "border-b border-rule" : "")
              }
            >
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-[10px] font-mono text-ink-faint tracking-wider">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--accent-oxblood)] border border-[color:var(--accent-oxblood)]/25 px-2 py-0.5">
                  {p.field}
                </span>
                <span className="text-[11px] font-mono text-ink-faint tracking-wider">
                  {p.manuscriptId}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-ink-faint ml-auto">
                  bet {p.pages}
                </span>
              </div>

              <h2
                className="text-[1.4rem] md:text-[1.6rem] leading-[1.2] font-medium mb-2 text-balance"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {p.title}
              </h2>

              <p className="text-sm mb-1">
                <span className="font-medium">{p.authors}</span>
              </p>
              {p.affiliation && (
                <p className="text-xs text-ink-muted mb-3 leading-relaxed">
                  {p.affiliation}
                </p>
              )}
              {p.excerpt && (
                <p className="text-sm text-ink-soft leading-relaxed max-w-[68ch] mb-3">
                  {p.excerpt}
                </p>
              )}
              {p.keywords && p.keywords.length > 0 && (
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {p.keywords.map((k, i) => (
                    <span key={k} className="text-[11px] text-ink-muted">
                      {k}
                      {i < p.keywords!.length - 1 && (
                        <span className="text-ink-faint ml-3">·</span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>

        <p className="mt-8 text-[10px] uppercase tracking-[0.22em] text-ink-faint">
          Tahririy ko‘rinish
        </p>
      </div>
    </PublicShell>
  );
}
