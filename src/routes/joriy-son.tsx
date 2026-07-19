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
        content: `“Filologiya va Pedagogika” jurnalining joriy soni: ${CURRENT_ISSUE.volume}-jild, ${CURRENT_ISSUE.number}-son (${CURRENT_ISSUE.month} ${CURRENT_ISSUE.year}). ${CURRENT_ISSUE.papers.length} ta maqola. e-ISSN 3060-4885.`,
      },
    ],
  }),
  component: CurrentIssuePage,
});

function CurrentIssuePage() {
  const issue = CURRENT_ISSUE;
  return (
    <PublicShell>
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-8 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12.5px] text-ink-muted mb-6">
          <Link to="/" className="hover:text-ink transition-colors">Bosh sahifa</Link>
          <span className="text-ink-faint">›</span>
          <span className="text-ink">Joriy son</span>
        </nav>

        {/* Issue hero */}
        <div className="rounded-3xl bg-[color:var(--surface-sunken)] p-8 md:p-10 mb-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[color:var(--accent-oxblood)] text-page text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                Joriy son
              </span>
              <h1
                className="font-semibold leading-tight tracking-tight text-ink"
                style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
              >
                {issue.volume}-jild · {issue.number}-son
              </h1>
              <p className="mt-2 text-[14px] text-ink-muted">
                {issue.month} {issue.year}
              </p>
              <p className="mt-4 text-[14px] text-ink-soft max-w-[64ch] leading-relaxed">
                “Filologiya va Pedagogika” ilmiy-metodik elektron jurnalining
                navbatdagi soni. Ushbu sondagi maqolalar tahririyat tomonidan
                tayyorlangan va ikki tomonlama anonim taqrizdan o‘tgan.
                Nashr sanasi: {issue.publishedAt ? new Date(issue.publishedAt).toLocaleDateString("uz-UZ") : "15.07.2026"}.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-faint">Maqolalar</p>
                <p className="text-3xl font-semibold tabular-nums text-ink mt-1">{issue.papers.length}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  to="/arxiv"
                  className="inline-flex items-center justify-center rounded-full border border-rule-strong bg-[color:var(--page-elevated)] px-4 py-2 text-[13px] font-semibold text-ink hover:bg-[color:var(--page)] transition-colors"
                >
                  Arxiv →
                </Link>
                {issue.pdfUrl && (
                  <a
                    href={issue.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent-oxblood)] text-page px-4 py-2 text-[13px] font-semibold hover:opacity-90 transition-opacity"
                  >
                    PDFni yuklab olish
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Article list */}
        <div className="space-y-6">
          {issue.papers.map((p, idx) => (
            <ArticleCard
              key={p.manuscriptId}
              article={{
                id: 150 + idx,
                kind: p.field,
                title: p.title,
                authors: p.authors,
                doi: "",
                doiUrl: "",
                views: 40 + idx * 7,
                downloads: 0,
                abstract: p.excerpt,
                slug: p.manuscriptId,
              }}
            />
          ))}

        </div>
      </div>
    </PublicShell>
  );
}
