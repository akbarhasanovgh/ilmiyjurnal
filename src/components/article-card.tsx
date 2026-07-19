import { useState } from "react";
import { Eye, Download } from "lucide-react";

export type ArticleCardData = {
  id: string | number;
  title: string;
  authors: string;
  doi?: string | null;
  doiUrl?: string | null;
  views?: number;
  downloads?: number;
  abstract?: string;
  kind?: string; // e.g. "MAQOLA"
};

/**
 * Public-facing article preview card.
 * Matches the reference layout: kind pill + ID, big title,
 * author, DOI link, views/downloads, abstract with "Batafsil" toggle.
 */
export function ArticleCard({ article }: { article: ArticleCardData }) {
  const [expanded, setExpanded] = useState(false);
  const abstract = article.abstract ?? "";
  const isLong = abstract.length > 320;
  const shown = expanded || !isLong ? abstract : abstract.slice(0, 320).trimEnd();

  return (
    <article className="border-b border-rule py-10 first:pt-0">
      {/* Kind + ID */}
      <div className="flex items-center gap-3 mb-6">
        <span className="inline-flex items-center px-3 py-1 rounded-md bg-[color:var(--accent-oxblood)] text-white text-[10px] font-bold uppercase tracking-[0.2em]">
          {article.kind ?? "Maqola"}
        </span>
        <span className="text-xs font-mono text-ink-faint tracking-wider">
          ID: {article.id}
        </span>
      </div>

      {/* Title */}
      <h2
        className="font-bold uppercase leading-[1.15] text-balance mb-4"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)",
          letterSpacing: "-0.005em",
        }}
      >
        {article.title}
      </h2>

      {/* Author */}
      <p className="text-sm font-medium mb-5">{article.authors}</p>

      {/* DOI */}
      {article.doi && (
        <div className="inline-flex items-center gap-2 bg-[color:var(--accent-oxblood)]/8 rounded-md px-3.5 py-2 mb-6 border border-[color:var(--accent-oxblood)]/15">
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[color:var(--accent-oxblood)]">
            DOI:
          </span>
          {article.doiUrl ? (
            <a
              href={article.doiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline break-all"
            >
              {article.doi}
            </a>
          ) : (
            <span className="text-sm text-blue-600 break-all">{article.doi}</span>
          )}
        </div>
      )}

      {/* Metrics */}
      <div className="flex items-center gap-6 mb-6 pb-6 border-b border-rule">
        <div className="flex items-center gap-2 text-sm">
          <Eye size={16} className="text-[color:var(--accent-oxblood)]" strokeWidth={1.75} />
          <span className="font-semibold">{article.views ?? 0}</span>
          <span className="text-ink-muted">(Ko‘rishlar)</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Download size={16} className="text-[color:var(--accent-oxblood)]" strokeWidth={1.75} />
          <span className="font-semibold">{article.downloads ?? 0}</span>
          <span className="text-ink-muted">(Yuklab olishlar)</span>
        </div>
      </div>

      {/* Abstract */}
      {abstract && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3 border-b border-ink pb-1 inline-block">
            Abstract
          </p>
          <p className="text-sm leading-relaxed text-ink-soft max-w-[75ch]">
            {shown}
            {isLong && !expanded && <span className="text-ink-faint"> …</span>}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-3 text-sm font-semibold text-[color:var(--accent-oxblood)] hover:text-[color:var(--accent-oxblood-strong)] transition-colors"
            >
              {expanded ? "Yopish" : "Batafsil"}
            </button>
          )}
        </div>
      )}
    </article>
  );
}
