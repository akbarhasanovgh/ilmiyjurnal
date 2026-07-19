import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/public-shell";
import { ArticleCard } from "@/components/article-card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "O‘zbek tili va adabiyoti — Ilmiy-nazariy jurnal" },
      {
        name: "description",
        content:
          "O‘zbek tili, adabiyoti va filologiyasi bo‘yicha ilmiy tadqiqotlar arxivi. Maqolalar, sonlar, mualliflar. ISSN 2010-5584.",
      },
    ],
  }),
  component: Home,
});

type PaperPreview = {
  field: string;
  title: string;
  authors: string;
  excerpt: string;
  date: string;
  issue: string;
  manuscriptId: string;
};

const PREVIEW_PAPERS: PaperPreview[] = [
  {
    field: "Filologiya",
    title: "O‘zbek tilida zamon kategoriyasining zamonaviy talqinlari",
    authors: "Akmal Karimov · Dilnoza Rasulova",
    excerpt:
      "Ushbu maqolada o‘zbek tili grammatikasidagi zamon kategoriyasining an’anaviy va zamonaviy tilshunoslikdagi talqinlari qiyosiy tahlil qilinadi. Fe’l zamonlarining nutqiy vaziyatga bog‘liqligi masalasi struktural va kognitiv yondashuvlar asosida yoritilgan.",
    date: "9 iyul 2026",
    issue: "70-jild · 3-son",
    manuscriptId: "OTA-2026-0042",
  },
  {
    field: "Filologiya",
    title:
      "Alisher Navoiy g‘azallarida ramziy obrazlar tizimi: matnshunoslik yondashuvi",
    authors: "Dilnoza Rasulova",
    excerpt:
      "Maqolada Alisher Navoiyning «Xazoyin ul-maoniy» devonidagi g‘azallarda takrorlanuvchi ramziy obrazlarning matnlararo aloqalari va sharh an’anasidagi o‘rni tahlil qilinadi.",
    date: "3 iyul 2026",
    issue: "70-jild · 3-son",
    manuscriptId: "OTA-2026-0041",
  },
  {
    field: "Pedagogika",
    title:
      "XIX asr Buxoro qo‘lyozmalarida imlo tizimi: tanqidiy nashr masalalari",
    authors: "Bahodir Ergashev",
    excerpt:
      "Buxoro madrasalarida ko‘chirilgan qo‘lyozmalardagi imlo o‘zgarishlari va ularning tanqidiy nashr amaliyotidagi aks etishi tahlil qilinadi. Muallif matnlararo qiyoslash uslubini taklif etadi.",
    date: "27 iyun 2026",
    issue: "70-jild · 2-son",
    manuscriptId: "OTA-2026-0038",
  },
];

const FIELDS: [string, string, string][] = [
  ["Filologiya", "10.00.00", "2286"],
  ["Pedagogika", "13.00.00", "1010"],
];

function Home() {
  return (
    <PublicShell>
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-8 pb-16">
        {/* Hero */}
        <div className="rounded-3xl bg-[color:var(--surface-sunken)] p-8 md:p-12 mb-10">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-[42rem]">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[color:var(--accent-oxblood)] text-page text-[10px] font-bold uppercase tracking-[0.2em] mb-5">
                Ilmiy-nazariy jurnal
              </span>
              <h1
                className="font-semibold leading-[1.1] tracking-tight text-ink"
                style={{ fontSize: "clamp(2rem, 4.2vw, 3rem)" }}
              >
                O‘zbek tili va adabiyoti
              </h1>
              <p className="mt-4 text-[15px] text-ink-soft leading-relaxed max-w-[58ch]">
                Filologiya va pedagogika sohalarida ikki tomonlama anonim
                taqrizdan o‘tgan ilmiy tadqiqotlar. 1958-yildan buyon nashr
                etiladi. ISSN 2010-5584.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/joriy-son"
                  className="inline-flex items-center rounded-full bg-[color:var(--accent-oxblood)] text-page px-5 py-2.5 text-[13px] font-semibold hover:opacity-90 transition-opacity"
                >
                  Joriy sonni ochish
                </Link>
                <Link
                  to="/for-authors"
                  className="inline-flex items-center rounded-full border border-rule-strong bg-[color:var(--page-elevated)] px-5 py-2.5 text-[13px] font-semibold text-ink hover:bg-[color:var(--page)] transition-colors"
                >
                  Mualliflar uchun
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-faint">Joriy son</p>
                <p className="text-2xl font-semibold text-ink mt-1">70 · 3</p>
                <p className="text-[12px] text-ink-muted mt-0.5">Iyul 2026</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-faint">Arxiv</p>
                <p className="text-2xl font-semibold text-ink mt-1 tabular-nums">3 296</p>
                <p className="text-[12px] text-ink-muted mt-0.5">maqola</p>
              </div>
            </div>
          </div>
        </div>




        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LATEST */}
          <section className="lg:col-span-8">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-ink">
                So‘nggi tadqiqotlar
              </h2>
              <Link
                to="/arxiv"
                className="text-[11px] uppercase tracking-[0.2em] font-semibold text-ink-muted hover:text-[color:var(--accent-oxblood)] transition-colors"
              >
                Barchasi →
              </Link>
            </div>

            <div className="space-y-6">
              {PREVIEW_PAPERS.map((p, i) => (
                <ArticleCard
                  key={p.manuscriptId}
                  article={{
                    id: p.manuscriptId,
                    kind: p.field,
                    title: p.title,
                    authors: `${p.authors} · ${p.issue} · ${p.date}`,
                    doi: "https://www.google.com/",
                    doiUrl: "https://www.google.com/",
                    views: 40 + i * 9,
                    downloads: 12 + i * 3,
                    abstract: p.excerpt,
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
                70-jild · 3-son
              </p>
              <p className="text-[13px] text-ink-muted mt-1 mb-5">Iyul 2026</p>
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

            {/* Review model card */}
            <div className="rounded-3xl bg-[color:var(--surface-sunken)] p-6">
              <p className="label-mono mb-3 text-ink-faint">Taqriz modeli</p>
              <p className="text-[13px] text-ink-soft leading-relaxed">
                Ikki tomonlama anonim (double-blind) taqriz. Muallif va
                taqrizchi bir-biri haqida ma’lumotga ega bo‘lmaydi.
              </p>
              <Link
                to="/for-authors"
                className="mt-5 inline-flex items-center text-[11px] font-bold uppercase tracking-[0.2em] text-ink hover:text-[color:var(--accent-oxblood)] transition-colors"
              >
                Ko‘rsatmalar →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </PublicShell>
  );
}
