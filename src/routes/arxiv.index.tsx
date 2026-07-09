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
  return (
    <PublicShell>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
        <div className="border-b border-ink pb-4 mb-10">
          <p className="label-mono mb-2">Arxiv</p>
          <h1
            className="font-medium leading-tight text-balance"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
            }}
          >
            Nashr etilgan jildlar
          </h1>
          <p className="mt-3 text-sm text-ink-soft max-w-[70ch] leading-relaxed">
            Jurnal 1958-yildan buyon chop etilib kelinmoqda. Har bir jild yil
            davomida chiqarilgan sonlarni birlashtiradi. Jildni tanlab, undagi
            sonlar va maqolalar ro‘yxatini ochishingiz mumkin.
          </p>
        </div>

        <ul className="divide-y divide-rule border-y border-rule">
          {ARCHIVE_VOLUMES.map((v) => {
            const hasIssues = v.issues.length > 0;
            return (
              <li key={v.volume} className="py-6">
                <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 mb-3">
                  <span
                    className="font-medium"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.75rem",
                      lineHeight: 1,
                    }}
                  >
                    {v.volume}-jild
                  </span>
                  <span className="text-[11px] font-mono tracking-wider text-ink-faint">
                    {v.year}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-ink-muted">
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
                          className="inline-flex items-baseline gap-3 border border-rule-strong px-4 py-2 hover:border-[color:var(--accent-oxblood)] hover:text-[color:var(--accent-oxblood)] transition-colors"
                        >
                          <span className="text-sm font-medium">
                            {i.number}-son
                          </span>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                            {i.month} {i.year}
                          </span>
                          <span className="text-[11px] font-mono text-ink-faint tracking-wider">
                            {i.papers.length}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-ink-faint italic">
                    Ushbu jildning raqamli nusxalari arxivga kiritilmoqda.
                  </p>
                )}
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-[10px] uppercase tracking-[0.22em] text-ink-faint">
          Tahririy ko‘rinish · Arxiv 1958 — 2026
        </p>
      </div>
    </PublicShell>
  );
}
