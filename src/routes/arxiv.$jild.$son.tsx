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
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
        <div className="mb-3">
          <Link
            to="/arxiv"
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-muted hover:text-[color:var(--accent-oxblood)] transition-colors"
          >
            ← Arxiv
          </Link>
        </div>

        <div className="border-b border-ink pb-5 mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label-mono mb-2">
              {issue.month} {issue.year}
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
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.22em] text-ink-faint">
              Maqolalar
            </p>
            <p className="text-2xl font-mono">{issue.papers.length}</p>
          </div>
        </div>

        <div className="border-y border-rule">
          {issue.papers.map((p, idx) => (
            <ArticleCard
              key={p.manuscriptId}
              article={{
                id: 100 + idx,
                kind: p.field,
                title: p.title,
                authors: p.authors,
                doi: "https://www.google.com/",
                doiUrl: "https://www.google.com/",
                views: 20 + idx * 5,
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
