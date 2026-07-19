import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PublicShell } from "@/components/public-shell";
import { ArticleCard } from "@/components/article-card";
import { findIssue, type ArchiveIssue } from "@/lib/archive-preview";

export const Route = createFileRoute("/arxiv/$jild/$son")({
  loader: ({ params }) => {
    const volume = Number(params.jild);
    const number = Number(params.son);
    if (!Number.isFinite(volume) || !Number.isFinite(number)) throw notFound();
    const issue = findIssue(volume, number);
    if (!issue) throw notFound();
    return { issue };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Son topilmadi — Arxiv" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { issue } = loaderData;
    const title = `${issue.volume}-jild · ${issue.number}-son (${issue.month} ${issue.year}) — Arxiv`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: `${issue.volume}-jild ${issue.number}-son maqolalari: ${issue.papers
            .map((p) => p.title)
            .slice(0, 3)
            .join("; ")}`,
        },
      ],
    };
  },
  notFoundComponent: IssueNotFound,
  component: IssuePage,
});

function IssueNotFound() {
  return (
    <PublicShell>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16">
        <p className="label-mono mb-3">Arxiv</p>
        <h1
          className="font-medium mb-4"
          style={{ fontFamily: "var(--font-display)", fontSize: "2rem" }}
        >
          Bu son topilmadi
        </h1>
        <p className="text-sm text-ink-soft mb-6">
          So‘ralgan jild yoki son arxivda mavjud emas.
        </p>
        <Link
          to="/arxiv"
          className="inline-flex text-[11px] font-bold uppercase tracking-[0.2em] border-b border-ink pb-0.5 hover:text-[color:var(--accent-oxblood)] hover:border-[color:var(--accent-oxblood)] transition-colors"
        >
          Arxivga qaytish
        </Link>
      </div>
    </PublicShell>
  );
}

function IssuePage() {
  const { issue } = Route.useLoaderData() as { issue: ArchiveIssue };
  return (
    <PublicShell>
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-8 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12.5px] text-ink-muted mb-6">
          <Link to="/" className="hover:text-ink transition-colors">Bosh sahifa</Link>
          <span className="text-ink-faint">›</span>
          <Link to="/arxiv" className="hover:text-ink transition-colors">Arxiv</Link>
          <span className="text-ink-faint">›</span>
          <span className="text-ink">{issue.volume}-jild · {issue.number}-son</span>
        </nav>

        {/* Issue hero */}
        <div className="rounded-3xl bg-[color:var(--surface-sunken)] p-8 md:p-10 mb-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-ink-muted mb-3">
                {issue.month} {issue.year}
              </p>
              <h1
                className="font-semibold leading-tight tracking-tight text-ink"
                style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
              >
                {issue.volume}-jild · {issue.number}-son
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-faint">Maqolalar</p>
                <p className="text-3xl font-semibold tabular-nums mt-1">{issue.papers.length}</p>
              </div>
              {issue.pdfUrl && (
                <a
                  href={issue.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-[color:var(--accent-oxblood)] text-page px-4 py-2 text-[13px] font-semibold hover:opacity-90 transition-opacity"
                >
                  PDFni yuklab olish
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Article list */}
        <div className="space-y-6">
          {issue.papers.map((p, idx) => (
            <ArticleCard
              key={p.manuscriptId}
              article={{
                id: 100 + idx,
                kind: p.field,
                title: p.title,
                authors: p.authors,
                doi: "",
                doiUrl: "",
                views: 20 + idx * 5,
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

