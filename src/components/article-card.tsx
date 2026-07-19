import { useState } from "react";
import { Eye, Download } from "lucide-react";
import { Link } from "@tanstack/react-router";

export type ArticleCardData = {
  id: string | number;
  title: string;
  authors: string;
  doi?: string | null;
  doiUrl?: string | null;
  views?: number;
  downloads?: number;
  abstract?: string;
  kind?: string;
  /** manuscriptId for linking to /maqola/$slug */
  slug?: string;
};

/**
 * Public-facing article card.
 * Warm cream surface, oxblood MAQOLA pill, blush DOI chip,
 * generous rounding to match the system DNA.
 */
export function ArticleCard({ article }: { article: ArticleCardData }) {
  const [expanded, setExpanded] = useState(false);
  const abstract = article.abstract ?? "";
  const isLong = abstract.length > 320;
  const shown = expanded || !isLong ? abstract : abstract.slice(0, 320).trimEnd();
  const slug = article.slug;


  return (
    <article className="rounded-3xl bg-[color:var(--page-elevated)] border border-rule p-8 md:p-10 shadow-[0_1px_0_rgba(23,20,18,0.03)]">
      {/* Kind + ID */}
      <div className="flex items-center gap-3 mb-5">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[color:var(--accent-oxblood)] text-page text-[10px] font-bold uppercase tracking-[0.2em]">
          {article.kind ?? "Maqola"}
        </span>
        <span className="text-xs font-mono text-ink-faint tracking-wider">
          ID: {article.id}
        </span>
      </div>

      {/* Title */}
      <h2
        className="font-semibold leading-[1.2] text-balance mb-3 text-ink"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(1.15rem, 1.9vw, 1.5rem)",
          letterSpacing: "-0.01em",
        }}
      >
        {slug ? (
          <Link
            to="/maqola/$id"
            params={{ id: slug }}
            className="hover:text-[color:var(--accent-oxblood)] transition-colors"
          >
            {article.title}
          </Link>
        ) : (
          article.title
        )}
      </h2>


      {/* Author */}
      <p className="text-[13.5px] text-ink-soft mb-5">{article.authors}</p>

      {/* DOI */}
      {article.doi && (
        <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-6 bg-[color:var(--accent-oxblood-soft)] border border-[color:var(--accent-oxblood)]/15">
          <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[color:var(--accent-oxblood)]">
            DOI
          </span>
          {article.doiUrl ? (
            <a
              href={article.doiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-[color:var(--accent-oxblood-strong)] hover:underline break-all"
            >
              {article.doi}
            </a>
          ) : (
            <span className="text-[13px] text-[color:var(--accent-oxblood-strong)] break-all">
              {article.doi}
            </span>
          )}
        </div>
      )}

      {/* Metrics */}
      <div className="flex items-center gap-5 mb-6 pb-6 border-b border-rule">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--surface-sunken)] px-3 py-1.5 text-[12.5px]">
          <Eye size={15} className="text-[color:var(--accent-oxblood)]" strokeWidth={1.75} />
          <span className="font-semibold">{article.views ?? 0}</span>
          <span className="text-ink-muted">Ko‘rishlar</span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--surface-sunken)] px-3 py-1.5 text-[12.5px]">
          <Download size={15} className="text-[color:var(--accent-oxblood)]" strokeWidth={1.75} />
          <span className="font-semibold">{article.downloads ?? 0}</span>
          <span className="text-ink-muted">Yuklamalar</span>
        </div>
      </div>

      {/* Abstract */}
      {abstract && (
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] mb-3 text-ink-muted">
            Abstract
          </p>
          <p className="text-[13.5px] leading-relaxed text-ink-soft max-w-[75ch]">
            {shown}
            {isLong && !expanded && <span className="text-ink-faint"> …</span>}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-[color:var(--accent-oxblood)] hover:text-[color:var(--accent-oxblood-strong)] transition-colors"
            >
              {expanded ? "Yopish" : "Batafsil"}
              <span aria-hidden>→</span>
            </button>
          )}
        </div>
      )}

      {slug && (
        <div className="mt-6 pt-6 border-t border-rule">
          <Link
            to="/maqola/$id"
            params={{ id: slug }}
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent-oxblood)] text-page px-4 py-2 text-[12.5px] font-semibold hover:opacity-90 transition-opacity"
          >
            Maqolani ochish
            <span aria-hidden>→</span>
          </Link>
        </div>
      )}
    </article>
  );
}

