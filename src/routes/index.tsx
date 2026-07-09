import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/public-shell";

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
  kind: "research" | "review";
  field: string;
  title: string;
  authors: string;
  affiliation?: string;
  excerpt: string;
  keywords: string[];
  date: string;
  issue: string;
  manuscriptId: string;
  views: number;
  downloads: number;
  citations: number;
};

// Editorial preview entries. Illustrative until the archive is populated
// with real published records — Phase 0 does not yet include publication.
const HERO: PaperPreview = {
  kind: "research",
  field: "Tilshunoslik",
  title:
    "O‘zbek tilida zamon kategoriyasining zamonaviy talqinlari: kognitiv va struktural yondashuvlar",
  authors: "Akmal Karimov · Dilnoza Rasulova",
  affiliation:
    "Alisher Navoiy nomidagi Toshkent davlat o‘zbek tili va adabiyoti universiteti",
  excerpt:
    "Ushbu maqolada o‘zbek tili grammatikasidagi zamon kategoriyasining an’anaviy va zamonaviy tilshunoslikdagi talqinlari qiyosiy tahlil qilinadi. Fe’l zamonlarining nutqiy vaziyatga bog‘liqligi masalasi struktural va kognitiv yondashuvlar asosida yoritilgan.",
  keywords: ["o‘zbek tili", "grammatika", "zamon kategoriyasi", "morfologiya"],
  date: "9 iyul 2026",
  issue: "70-jild · 3-son",
  manuscriptId: "OTA-2026-0042",
  views: 1420,
  downloads: 892,
  citations: 14,
};

const RECENT: PaperPreview[] = [
  {
    kind: "review",
    field: "Adabiyotshunoslik",
    title:
      "Alisher Navoiy g‘azallarida ramziy obrazlar tizimi: matnshunoslik yondashuvi",
    authors: "Dilnoza Rasulova",
    affiliation: "Samarqand davlat universiteti",
    excerpt:
      "Alisher Navoiyning «Xazoyin ul-maoniy» devonidagi g‘azallarda takrorlanuvchi ramziy obrazlarning matnlararo aloqalari va sharh an’anasidagi o‘rni tahlil qilinadi.",
    keywords: ["Alisher Navoiy", "g‘azal", "matnshunoslik"],
    date: "3 iyul 2026",
    issue: "70-jild · 3-son",
    manuscriptId: "OTA-2026-0041",
    views: 986,
    downloads: 512,
    citations: 8,
  },
  {
    kind: "research",
    field: "Matnshunoslik",
    title:
      "XIX asr Buxoro qo‘lyozmalarida imlo tizimi: tanqidiy nashr masalalari",
    authors: "Bahodir Ergashev",
    affiliation:
      "O‘zbekiston Respublikasi Fanlar akademiyasi Sharqshunoslik instituti",
    excerpt:
      "Buxoro madrasalarida ko‘chirilgan qo‘lyozmalardagi imlo o‘zgarishlari va ularning tanqidiy nashr amaliyotidagi aks etishi tahlil qilinadi.",
    keywords: ["qo‘lyozma", "tanqidiy nashr", "imlo"],
    date: "27 iyun 2026",
    issue: "70-jild · 2-son",
    manuscriptId: "OTA-2026-0038",
    views: 742,
    downloads: 388,
    citations: 5,
  },
  {
    kind: "research",
    field: "Folklorshunoslik",
    title:
      "Qoraqalpoq xalq dostonlaridagi ovozli formulalar: qiyosiy tahlil",
    authors: "Nodira Yusupova · Rustam Sattorov",
    affiliation: "Qoraqalpoq davlat universiteti",
    excerpt:
      "O‘zbek va qoraqalpoq epik an’analaridagi takrorlanuvchi ovozli formulalar tizimi qiyoslanadi.",
    keywords: ["folklor", "doston", "og‘zaki ijod"],
    date: "18 iyun 2026",
    issue: "70-jild · 2-son",
    manuscriptId: "OTA-2026-0035",
    views: 604,
    downloads: 271,
    citations: 3,
  },
];

const FIELDS: [string, string][] = [
  ["Tilshunoslik", "1240"],
  ["Adabiyotshunoslik", "986"],
  ["Matnshunoslik", "412"],
  ["Folklorshunoslik", "308"],
  ["Tarjimashunoslik", "184"],
  ["Dialektologiya", "156"],
];

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

function TypeDot({ kind }: { kind: "research" | "review" }) {
  const isResearch = kind === "research";
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden
        className={
          "inline-block h-[9px] w-[9px] rounded-full border " +
          (isResearch
            ? "border-[color:var(--accent-oxblood)] bg-[color:var(--accent-oxblood)]/15"
            : "border-ink-faint bg-transparent")
        }
      />
      <span
        className={
          "text-[10px] font-bold uppercase tracking-[0.22em] " +
          (isResearch ? "text-[color:var(--accent-oxblood)]" : "text-ink-muted")
        }
      >
        {isResearch ? "Ilmiy maqola" : "Sharh maqola"}
      </span>
    </span>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-ink-faint">
        {label}
      </span>
      <span className="mt-1 font-mono text-[15px] tracking-wider text-ink">
        {value}
      </span>
    </div>
  );
}

function Home() {
  return (
    <PublicShell>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-14">
        {/* Search bar */}
        <div className="mb-16 border border-ink flex items-stretch">
          <label
            htmlFor="q"
            className="hidden md:flex items-center px-4 border-r border-ink text-[10px] uppercase tracking-[0.22em] font-bold text-ink-muted"
          >
            Qidiruv
          </label>
          <input
            id="q"
            type="search"
            placeholder="Maqola, muallif, kalit so‘z yoki mavzu bo‘yicha qidiring"
            className="flex-1 bg-transparent px-4 py-4 text-sm placeholder:text-ink-faint focus:outline-none"
          />
          <button
            type="button"
            className="bg-ink text-page px-6 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[color:var(--accent-oxblood)] transition-colors"
          >
            Qidirish
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-14 gap-y-16">
          {/* MAIN COLUMN */}
          <section className="lg:col-span-8">
            {/* HERO PAPER */}
            <article className="pb-14 mb-14 border-b border-ink">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6">
                <TypeDot kind={HERO.kind} />
                <span className="text-[11px] font-mono tracking-wider text-ink-faint">
                  {HERO.manuscriptId}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                  {HERO.issue}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                  {HERO.field}
                </span>
              </div>

              <h2
                className="text-balance mb-6 leading-[1.05] tracking-tight cursor-pointer hover:text-[color:var(--accent-oxblood)] transition-colors"
                style={{
                  fontFamily: "var(--font-editorial)",
                  fontSize: "clamp(2.25rem, 4.6vw, 3.75rem)",
                  fontWeight: 400,
                }}
              >
                {HERO.title}
              </h2>

              <p
                className="mb-4 text-[15px] leading-[1.7] text-ink-soft max-w-[62ch]"
              >
                {HERO.excerpt}
              </p>

              <div className="mb-8 text-sm">
                <span className="font-medium text-ink">{HERO.authors}</span>
                {HERO.affiliation && (
                  <p className="mt-1 text-xs text-ink-muted leading-relaxed">
                    {HERO.affiliation}
                  </p>
                )}
              </div>

              {/* Metric band */}
              <div className="grid grid-cols-3 border-y border-rule py-4 mb-6 max-w-md">
                <Metric label="Ko‘rildi" value={fmt(HERO.views)} />
                <Metric label="Yuklandi" value={fmt(HERO.downloads)} />
                <Metric label="Iqtibos" value={fmt(HERO.citations)} />
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <button className="inline-flex items-center bg-ink text-page px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[color:var(--accent-oxblood)] transition-colors">
                  PDF o‘qish
                </button>
                <button className="text-[11px] font-bold uppercase tracking-[0.2em] border-b border-ink pb-0.5 hover:text-[color:var(--accent-oxblood)] hover:border-[color:var(--accent-oxblood)] transition-colors">
                  Annotatsiya
                </button>
                <button className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-muted hover:text-ink transition-colors">
                  Iqtibos olish
                </button>
                <span className="ml-auto text-[11px] font-mono tracking-wider text-ink-faint">
                  {HERO.date}
                </span>
              </div>
            </article>

            {/* RECENT LIST */}
            <div className="flex items-baseline justify-between border-b border-rule-strong pb-2 mb-8">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.22em]">
                So‘nggi tadqiqotlar
              </h3>
              <Link
                to="/"
                className="text-[10px] uppercase tracking-[0.22em] text-ink-faint hover:text-ink"
              >
                Barchasi
              </Link>
            </div>

            <div>
              {RECENT.map((p, i) => (
                <article
                  key={p.manuscriptId}
                  className={
                    "group py-8 " +
                    (i !== RECENT.length - 1 ? "border-b border-rule" : "")
                  }
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
                    <TypeDot kind={p.kind} />
                    <span className="text-[11px] font-mono tracking-wider text-ink-faint">
                      {p.manuscriptId}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                      {p.field}
                    </span>
                  </div>

                  <h4
                    className="mb-3 leading-[1.15] text-balance cursor-pointer group-hover:text-[color:var(--accent-oxblood)] transition-colors"
                    style={{
                      fontFamily: "var(--font-editorial)",
                      fontSize: "1.65rem",
                      fontWeight: 400,
                    }}
                  >
                    {p.title}
                  </h4>

                  <div className="text-sm mb-1">
                    <span className="font-medium">{p.authors}</span>
                  </div>
                  {p.affiliation && (
                    <p className="text-xs text-ink-muted mb-3 leading-relaxed">
                      {p.affiliation}
                    </p>
                  )}

                  <p className="text-sm text-ink-soft leading-[1.65] max-w-[64ch] mb-5">
                    {p.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div className="flex items-center gap-5 font-mono text-[11px] tracking-wider text-ink-muted">
                      <span>
                        <span className="text-ink-faint">Ko‘rildi</span>{" "}
                        {fmt(p.views)}
                      </span>
                      <span>
                        <span className="text-ink-faint">Yuklandi</span>{" "}
                        {fmt(p.downloads)}
                      </span>
                      <span>
                        <span className="text-ink-faint">Iqtibos</span>{" "}
                        {fmt(p.citations)}
                      </span>
                    </div>
                    <span className="ml-auto text-[11px] font-mono tracking-wider text-ink-faint">
                      {p.date}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* RAIL */}
          <aside className="lg:col-span-4 space-y-14">
            <div className="border-t border-ink pt-5">
              <p className="label-mono mb-3">Joriy son</p>
              <p
                className="leading-[1.05] mb-2 tracking-tight"
                style={{
                  fontFamily: "var(--font-editorial)",
                  fontSize: "2rem",
                  fontWeight: 400,
                }}
              >
                70-jild · 3-son
              </p>
              <p className="text-xs text-ink-muted mb-5">Iyul 2026 · ISSN 2010-5584</p>
              <div className="flex gap-5 text-[11px] font-bold uppercase tracking-[0.2em]">
                <button className="border-b border-ink pb-0.5 hover:text-[color:var(--accent-oxblood)] hover:border-[color:var(--accent-oxblood)] transition-colors">
                  Sonni ko‘rish
                </button>
                <button className="text-ink-muted hover:text-ink transition-colors">
                  PDF
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between border-b border-rule-strong pb-2 mb-3">
                <p className="label-mono">Yo‘nalishlar</p>
                <span className="text-[10px] text-ink-faint">Maqolalar</span>
              </div>
              <ul>
                {FIELDS.map(([name, count]) => (
                  <li
                    key={name}
                    className="flex items-baseline justify-between py-2.5 border-b border-rule group cursor-pointer"
                  >
                    <span className="text-sm group-hover:text-[color:var(--accent-oxblood)] transition-colors">
                      {name}
                    </span>
                    <span className="text-[11px] font-mono text-ink-faint tracking-wider">
                      {count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="label-mono mb-3">Taqriz modeli</p>
              <p className="text-sm text-ink-soft leading-[1.7]">
                Ikki tomonlama anonim (double-blind) taqriz. Muallif va taqrizchi
                bir-biri haqida ma’lumotga ega bo‘lmaydi.
              </p>
              <div className="mt-5">
                <Link
                  to="/for-authors"
                  className="inline-flex text-[11px] font-bold uppercase tracking-[0.2em] border-b border-ink pb-0.5 hover:text-[color:var(--accent-oxblood)] hover:border-[color:var(--accent-oxblood)] transition-colors"
                >
                  Mualliflar uchun ko‘rsatmalar
                </Link>
              </div>
            </div>

            <div className="border-t border-rule-strong pt-5">
              <p className="label-mono mb-3">Indekslash</p>
              <ul className="grid grid-cols-2 gap-y-1.5 text-xs text-ink-soft">
                <li>Google Scholar</li>
                <li>DOAJ</li>
                <li>OpenAlex</li>
                <li>Crossref</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </PublicShell>
  );
}
