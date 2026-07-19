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

        <div className="border-y border-rule">
          {issue.papers.map((p, idx) => (
            <ArticleCard
              key={p.manuscriptId}
              article={{
                id: 150 + idx,
                kind: "Maqola",
                title: p.title,
                authors: p.authors,
                doi: "https://www.google.com/",
                doiUrl: "https://www.google.com/",
                views: 40 + idx * 7,
                downloads: 0,
                abstract: p.excerpt,
              }}
            />
          ))}
        </div>


        <p className="mt-8 text-[10px] uppercase tracking-[0.22em] text-ink-faint">
          Tahririy ko‘rinish
        </p>
      </div>
    </PublicShell>
  );
}
