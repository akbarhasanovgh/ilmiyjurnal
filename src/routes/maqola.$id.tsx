import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye, Download, ArrowLeft } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { findPaper, type ArchivePaper, type ArchiveIssue } from "@/lib/archive-preview";
import { incrementArticleView, incrementArticleDownload, getArticleStats } from "@/lib/article-views";
import { getArticleThumb } from "@/lib/article-thumbs";

export const Route = createFileRoute("/maqola/$id")({
  loader: ({ params }) => {
    const found = findPaper(params.id);
    if (!found) throw notFound();
    return found;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Maqola topilmadi" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { paper, issue } = loaderData;
    const description =
      paper.excerpt ??
      `${paper.title} — ${paper.authors}. Filologiya va Pedagogika, ${issue.volume}-jild ${issue.number}-son (${issue.month} ${issue.year}).`;
    return {
      meta: [
        { title: `${paper.title} — Filologiya va Pedagogika` },
        { name: "description", content: description.slice(0, 160) },
        { property: "og:title", content: paper.title },
        { property: "og:description", content: description.slice(0, 160) },
        { property: "og:type", content: "article" },
      ],
    };
  },
  notFoundComponent: PaperNotFound,
  component: PaperPage,
});

function PaperNotFound() {
  return (
    <PublicShell>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-16">
        <p className="label-mono mb-3">Maqola</p>
        <h1
          className="font-semibold mb-4 text-ink"
          style={{ fontSize: "2rem" }}
        >
          Bu maqola topilmadi
        </h1>
        <p className="text-[14px] text-ink-soft mb-6">
          So‘ralgan maqola arxivda mavjud emas yoki manzil xato kiritilgan.
        </p>
        <Link
          to="/joriy-son"
          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent-oxblood)] text-page px-4 py-2 text-[13px] font-semibold hover:opacity-90 transition-opacity"
        >
          Joriy songa qaytish
        </Link>
      </div>
    </PublicShell>
  );
}

function PaperPage() {
  const { paper, issue } = Route.useLoaderData() as {
    paper: ArchivePaper;
    issue: ArchiveIssue;
  };

  const shifr = paper.field === "Filologiya" ? "10.00.00" : "13.00.00";

  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ["article-stats", paper.manuscriptId],
    queryFn: () => getArticleStats(paper.manuscriptId),
    staleTime: 30_000,
  });
  const viewCount = stats?.view_count ?? 0;
  const downloadCount = stats?.download_count ?? 0;

  useEffect(() => {
    let cancelled = false;
    incrementArticleView(paper.manuscriptId).then(() => {
      if (!cancelled) refetchStats();
    });
    return () => {
      cancelled = true;
    };
  }, [paper.manuscriptId, refetchStats]);

  const handleDownloadClick = () => {
    incrementArticleDownload(paper.manuscriptId).then(() => refetchStats());
  };

  return (
    <PublicShell>
      <article className="max-w-3xl mx-auto px-4 md:px-8 pt-8 pb-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12.5px] text-ink-muted mb-8 flex-wrap">
          <Link to="/" className="hover:text-ink transition-colors">Bosh sahifa</Link>
          <span className="text-ink-faint">›</span>
          <Link
            to="/arxiv/$jild/$son"
            params={{ jild: String(issue.volume), son: String(issue.number) }}
            className="hover:text-ink transition-colors"
          >
            {issue.volume}-jild · {issue.number}-son
          </Link>
          <span className="text-ink-faint">›</span>
          <span className="text-ink truncate max-w-[24ch]">{paper.title}</span>
        </nav>

        {/* Meta pills */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[color:var(--accent-oxblood)] text-page text-[10px] font-bold uppercase tracking-[0.2em]">
            {paper.field}
          </span>
          <span className="text-[11px] font-mono text-ink-faint tracking-wider">
            {shifr}
          </span>
          <span className="text-ink-faint">·</span>
          <span className="text-[11px] font-mono text-ink-faint tracking-wider">
            ID: {paper.manuscriptId}
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-semibold leading-[1.15] tracking-tight text-ink text-balance mb-5"
          style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.4rem)" }}
        >
          {paper.title}
        </h1>

        {/* Authors */}
        <p className="text-[15px] text-ink-soft mb-2">{paper.authors}</p>
        {paper.affiliation && (
          <p className="text-[13px] text-ink-muted mb-2">{paper.affiliation}</p>
        )}
        <p className="text-[13px] text-ink-muted mb-8">
          Filologiya va Pedagogika · {issue.volume}-jild · {issue.number}-son ·{" "}
          {issue.month} {issue.year} · b. {paper.pages}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 mb-10 pb-10 border-b border-rule">
          {issue.pdfUrl && (
            <a
              href={issue.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDownloadClick}
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent-oxblood)] text-page px-4 py-2 text-[13px] font-semibold hover:opacity-90 transition-opacity"
            >
              <Download size={15} strokeWidth={2} />
              PDF (butun son)
            </a>
          )}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--surface-sunken)] px-3 py-1.5 text-[12.5px]">
            <Eye size={15} className="text-[color:var(--accent-oxblood)]" strokeWidth={1.75} />
            <span className="text-ink-muted tabular-nums">
              {viewCount.toLocaleString("uz-UZ")} ko‘rish
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--surface-sunken)] px-3 py-1.5 text-[12.5px]">
            <Download size={15} className="text-[color:var(--accent-oxblood)]" strokeWidth={1.75} />
            <span className="text-ink-muted tabular-nums">
              {downloadCount.toLocaleString("uz-UZ")} yuklama
            </span>
          </div>
        </div>

        {/* First-page preview */}
        {(() => {
          const thumb = getArticleThumb(paper.manuscriptId);
          if (!thumb) return null;
          const href = issue.pdfUrl;
          const Wrapper = href ? "a" : "div";
          return (
            <section className="mb-10">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] mb-4 text-ink-muted">
                Birinchi sahifa
              </p>
              <Wrapper
                {...(href
                  ? {
                      href,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      onClick: handleDownloadClick,
                      "aria-label": "Maqolaning birinchi sahifasi — PDFni ochish",
                    }
                  : {})}
                className="block w-[240px] md:w-[280px] aspect-[210/297] overflow-hidden rounded-2xl border border-rule bg-[color:var(--page-elevated)] shadow-[0_10px_32px_rgba(23,20,18,0.14)] hover:shadow-[0_16px_44px_rgba(23,20,18,0.22)] transition-shadow"
              >
                <img
                  src={thumb}
                  alt={`${paper.title} — birinchi sahifa`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </Wrapper>
            </section>
          );
        })()}


        <section className="mb-10">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] mb-4 text-ink-muted">
            Annotatsiya
          </p>
          {paper.excerpt ? (
            <p className="text-[15px] leading-[1.75] text-ink-soft">
              {paper.excerpt}
            </p>
          ) : (
            <p className="text-[14px] leading-relaxed text-ink-muted italic">
              Ushbu maqolaning to‘liq annotatsiyasi elektron nashrning PDF
              faylida keltirilgan. Maqolani to‘liq o‘qish uchun yuqoridagi
              “PDF (butun son)” tugmasi orqali sonni yuklab oling va{" "}
              <span className="not-italic font-medium text-ink">
                b. {paper.pages}
              </span>{" "}
              sahifadan boshlanuvchi maqolani o‘qing.
            </p>
          )}
        </section>

        {/* Keywords */}
        {paper.keywords && paper.keywords.length > 0 && (
          <section className="mb-10">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] mb-3 text-ink-muted">
              Kalit so‘zlar
            </p>
            <div className="flex flex-wrap gap-2">
              {paper.keywords.map((k) => (
                <span
                  key={k}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-[color:var(--surface-sunken)] text-[12.5px] text-ink-soft"
                >
                  {k}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Citation */}
        <section className="mb-10 rounded-3xl bg-[color:var(--surface-sunken)] p-6 md:p-8">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] mb-3 text-ink-muted">
            Iqtibos
          </p>
          <p className="text-[13.5px] leading-relaxed text-ink-soft font-mono">
            {paper.authors}. {paper.title}. // Filologiya va Pedagogika. —{" "}
            {issue.year}. — {issue.volume}-jild, {issue.number}-son. — B.{" "}
            {paper.pages}.
          </p>
        </section>

        {/* Back link */}
        <Link
          to="/arxiv/$jild/$son"
          params={{ jild: String(issue.volume), son: String(issue.number) }}
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-muted hover:text-[color:var(--accent-oxblood)] transition-colors"
        >
          <ArrowLeft size={15} />
          {issue.volume}-jild · {issue.number}-son dagi barcha maqolalar
        </Link>
      </article>
    </PublicShell>
  );
}
