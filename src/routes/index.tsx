import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PublicShell } from "@/components/public-shell";
import { ArticleCard } from "@/components/article-card";
import { CURRENT_ISSUE } from "@/lib/archive-preview";
import { getTopViewedArticles } from "@/lib/article-views";
import coverAsset from "@/assets/issue-13-32-cover.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Filologiya va Pedagogika — Ilmiy-metodik elektron jurnal" },
      {
        name: "description",
        content:
          "“Filologiya va Pedagogika” ilmiy-metodik elektron jurnali. O‘zbekiston Respublikasi Maktabgacha va maktab ta’limi vazirligi “Til va adabiyot ta’limi” davlat muassasasi muassisligida nashr etiladi. e-ISSN 3060-4885.",
      },
    ],
  }),
  component: Home,
});

const FIELDS: [string, string, number][] = [
  ["Filologiya", "10.00.00", CURRENT_ISSUE.papers.filter((p) => p.field === "Filologiya").length],
  ["Pedagogika", "13.00.00", CURRENT_ISSUE.papers.filter((p) => p.field === "Pedagogika").length],
];

function Home() {
  const issue = CURRENT_ISSUE;
  const previewPapers = issue.papers.slice(0, 3);

  const papersById = new Map(issue.papers.map((p) => [p.manuscriptId, p]));
  const { data: topViews = [] } = useQuery({
    queryKey: ["top-viewed", 5],
    queryFn: () => getTopViewedArticles(5),
    staleTime: 60_000,
  });
  const mostViewed = topViews
    .map((row) => ({ paper: papersById.get(row.manuscript_id), views: row.view_count }))
    .filter((r): r is { paper: NonNullable<typeof r.paper>; views: number } => Boolean(r.paper));


  return (
    <PublicShell>
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-8 pb-16">
        {/* Hero */}
        <div className="rounded-3xl bg-[color:var(--surface-sunken)] p-8 md:p-12 mb-10">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-[44rem]">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[color:var(--accent-oxblood)] text-page text-[10px] font-bold uppercase tracking-[0.2em] mb-5">
                Ilmiy-metodik elektron jurnal
              </span>
              <h1
                className="font-semibold leading-[1.1] tracking-tight text-ink"
                style={{ fontSize: "clamp(2rem, 4.2vw, 3rem)" }}
              >
                Filologiya va Pedagogika
              </h1>
              <p className="mt-4 text-[15px] text-ink-soft leading-relaxed max-w-[60ch]">
                O‘zbekiston Respublikasi Maktabgacha va maktab ta’limi vazirligi
                “Til va adabiyot ta’limi” davlat muassasasi muassisligida
                nashr etiladi. OAK 2024-yil 30-noyabrdagi 364/5-qarori bilan
                10.00.00 — Filologiya va 13.00.00 — Pedagogika fanlari bo‘yicha
                dissertatsiyalar asosiy natijalarini chop etish tavsiya etilgan
                milliy ilmiy nashr. e-ISSN 3060-4885.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/joriy-son"
                  className="inline-flex items-center rounded-full bg-[color:var(--accent-oxblood)] text-page px-5 py-2.5 text-[13px] font-semibold hover:opacity-90 transition-opacity"
                >
                  Joriy sonni ochish
                </Link>
                {issue.pdfUrl && (
                  <a
                    href={issue.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-rule-strong bg-[color:var(--page-elevated)] px-5 py-2.5 text-[13px] font-semibold text-ink hover:bg-[color:var(--page)] transition-colors"
                  >
                    PDFni yuklab olish
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-end gap-8">
              <div className="flex flex-col gap-3 text-right">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-ink-faint">Joriy son</p>
                  <p className="text-2xl font-semibold text-ink mt-1">{issue.volume} · {issue.number}</p>
                  <p className="text-[12px] text-ink-muted mt-0.5">{issue.month} {issue.year}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-ink-faint">Maqolalar</p>
                  <p className="text-2xl font-semibold text-ink mt-1 tabular-nums">{issue.papers.length}</p>
                </div>
              </div>
              <Link
                to="/joriy-son"
                className="block w-[168px] md:w-[184px] aspect-[210/297] overflow-hidden rounded-2xl border border-rule bg-[color:var(--page-elevated)] shadow-[0_8px_28px_rgba(23,20,18,0.12)] hover:shadow-[0_14px_36px_rgba(23,20,18,0.18)] transition-shadow"
                aria-label="Joriy son muqovasi"
              >
                <img
                  src={coverAsset.url}
                  alt={`${issue.volume}-jild · ${issue.number}-son muqovasi`}
                  className="h-full w-full object-cover"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LATEST */}
          <section className="lg:col-span-8">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-ink">
                Joriy sondan
              </h2>
              <Link
                to="/joriy-son"
                className="text-[11px] uppercase tracking-[0.2em] font-semibold text-ink-muted hover:text-[color:var(--accent-oxblood)] transition-colors"
              >
                Barchasi →
              </Link>
            </div>

            <div className="space-y-6">
              {previewPapers.map((p, i) => (
                <ArticleCard
                  key={p.manuscriptId}
                  article={{
                    id: p.manuscriptId,
                    kind: p.field,
                    title: p.title,
                    authors: `${p.authors} · ${issue.volume}-jild · ${issue.number}-son`,
                    doi: "",
                    doiUrl: "",
                    views: 40 + i * 9,
                    downloads: 12 + i * 3,
                    abstract: p.excerpt ?? "",
                    slug: p.manuscriptId,
                    coverUrl: coverAsset.url,
                    issueLabel: `${issue.volume}-jild · ${issue.number}-son`,
                  }}
                />
              ))}

            </div>
          </section>

          {/* RAIL */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Current issue card */}
            <div className="rounded-3xl bg-[color:var(--page-elevated)] border border-rule p-6">
              <p className="label-mono mb-3 text-ink-faint">Joriy son</p>
              <p className="font-semibold text-ink text-xl leading-tight">
                {issue.volume}-jild · {issue.number}-son
              </p>
              <p className="text-[13px] text-ink-muted mt-1 mb-5">{issue.month} {issue.year}</p>
              <Link
                to="/joriy-son"
                className="inline-flex w-full items-center justify-center rounded-full bg-[color:var(--accent-oxblood)] text-page px-4 py-2.5 text-[12px] font-semibold hover:opacity-90 transition-opacity"
              >
                Sonni ko‘rish
              </Link>
            </div>

            {/* Fields card */}
            <div className="rounded-3xl bg-[color:var(--page-elevated)] border border-rule p-6">
              <div className="flex items-baseline justify-between mb-4">
                <p className="label-mono text-ink-faint">Yo‘nalishlar</p>
                <span className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                  Maqolalar
                </span>
              </div>
              <ul className="space-y-1">
                {FIELDS.map(([name, shifr, count]) => (
                  <li
                    key={name}
                    className="flex items-center justify-between rounded-2xl px-3 py-2.5 hover:bg-[color:var(--surface-sunken)] transition-colors gap-3 cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-ink truncate">
                        {name}
                      </p>
                      <p className="text-[10px] font-mono text-ink-faint tracking-wider mt-0.5">
                        {shifr}
                      </p>
                    </div>
                    <span className="text-[13px] font-mono text-ink-muted tabular-nums">
                      {count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Most viewed */}
            <div className="rounded-3xl bg-[color:var(--page-elevated)] border border-rule p-6">
              <div className="flex items-baseline justify-between mb-4">
                <p className="label-mono text-ink-faint">Eng ko‘p ko‘rilgan</p>
                <span className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                  Ko‘rishlar
                </span>
              </div>
              {mostViewed.length === 0 ? (
                <p className="text-[13px] text-ink-muted leading-relaxed px-1">
                  Statistika hali to‘planmoqda. Maqolalar ochilgan sari eng
                  ko‘p o‘qilganlari shu yerda paydo bo‘ladi.
                </p>
              ) : (
                <ol className="space-y-1">
                  {mostViewed.map(({ paper, views }, idx) => (
                    <li key={paper.manuscriptId}>
                      <Link
                        to="/maqola/$id"
                        params={{ id: paper.manuscriptId }}
                        className="flex items-start gap-3 rounded-2xl px-3 py-2.5 hover:bg-[color:var(--surface-sunken)] transition-colors"
                      >
                        <span className="text-[11px] font-mono text-ink-faint tabular-nums mt-0.5 w-4 shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-medium text-ink leading-snug line-clamp-2">
                            {paper.title}
                          </p>
                          <p className="text-[10px] font-mono text-ink-faint tracking-wider mt-1 tabular-nums">
                            {views.toLocaleString("uz-UZ")} ko‘rish
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </aside>
        </div>
      </div>
    </PublicShell>
  );
}
