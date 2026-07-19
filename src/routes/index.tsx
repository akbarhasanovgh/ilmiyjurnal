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
  field: string;
  title: string;
  authors: string;
  affiliation?: string;
  excerpt: string;
  keywords: string[];
  date: string;
  issue: string;
  manuscriptId: string;
};

// Editorial preview entries. These are illustrative until the archive is
// populated with real published records — Phase 0's vertical workflow does
// not yet include publication. They are labeled as such in the section
// heading so nothing is presented as a real DOI'd article.
const PREVIEW_PAPERS: PaperPreview[] = [
  {
    field: "Filologiya",
    title: "O‘zbek tilida zamon kategoriyasining zamonaviy talqinlari",
    authors: "Akmal Karimov · Dilnoza Rasulova",
    affiliation:
      "Alisher Navoiy nomidagi Toshkent davlat o‘zbek tili va adabiyoti universiteti",
    excerpt:
      "Ushbu maqolada o‘zbek tili grammatikasidagi zamon kategoriyasining an’anaviy va zamonaviy tilshunoslikdagi talqinlari qiyosiy tahlil qilinadi. Fe’l zamonlarining nutqiy vaziyatga bog‘liqligi masalasi struktural va kognitiv yondashuvlar asosida yoritilgan.",
    keywords: ["o‘zbek tili", "grammatika", "zamon kategoriyasi", "morfologiya"],
    date: "9 iyul 2026",
    issue: "70-jild · 3-son",
    manuscriptId: "OTA-2026-0042",
  },
  {
    field: "Filologiya",
    title:
      "Alisher Navoiy g‘azallarida ramziy obrazlar tizimi: matnshunoslik yondashuvi",
    authors: "Dilnoza Rasulova",
    affiliation: "Samarqand davlat universiteti",
    excerpt:
      "Maqolada Alisher Navoiyning «Xazoyin ul-maoniy» devonidagi g‘azallarda takrorlanuvchi ramziy obrazlarning matnlararo aloqalari va sharh an’anasidagi o‘rni tahlil qilinadi.",
    keywords: ["Alisher Navoiy", "g‘azal", "matnshunoslik", "ramziy obraz"],
    date: "3 iyul 2026",
    issue: "70-jild · 3-son",
    manuscriptId: "OTA-2026-0041",
  },
  {
    field: "Filologiya",
    title:
      "XIX asr Buxoro qo‘lyozmalarida imlo tizimi: tanqidiy nashr masalalari",
    authors: "Bahodir Ergashev",
    affiliation:
      "O‘zbekiston Respublikasi Fanlar akademiyasi Sharqshunoslik instituti",
    excerpt:
      "Buxoro madrasalarida ko‘chirilgan qo‘lyozmalardagi imlo o‘zgarishlari va ularning tanqidiy nashr amaliyotidagi aks etishi tahlil qilinadi. Muallif matnlararo qiyoslash uslubini taklif etadi.",
    keywords: ["qo‘lyozma", "tanqidiy nashr", "imlo", "XIX asr"],
    date: "27 iyun 2026",
    issue: "70-jild · 2-son",
    manuscriptId: "OTA-2026-0038",
  },
  {
    field: "Filologiya",
    title:
      "Qoraqalpoq xalq dostonlaridagi ovozli formulalar: qiyosiy tahlil",
    authors: "Nodira Yusupova · Rustam Sattorov",
    affiliation: "Qoraqalpoq davlat universiteti",
    excerpt:
      "O‘zbek va qoraqalpoq epik an’analaridagi takrorlanuvchi ovozli formulalar tizimi qiyoslanadi. Tadqiqot og‘zaki ijro amaliyotining o‘rganilishiga metodologik hissa qo‘shadi.",
    keywords: ["folklor", "doston", "og‘zaki ijod", "qoraqalpoq"],
    date: "18 iyun 2026",
    issue: "70-jild · 2-son",
    manuscriptId: "OTA-2026-0035",
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

function Home() {
  return (
    <PublicShell>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
        {/* Search bar — quiet, prominent */}
        <div className="mb-14 border border-ink flex items-stretch">
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
            className="flex-1 bg-transparent px-4 py-3.5 text-sm placeholder:text-ink-faint focus:outline-none"
          />
          <button
            type="button"
            className="bg-ink text-page px-5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[color:var(--accent-oxblood)] transition-colors"
          >
            Qidirish
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-14">
          {/* LATEST RESEARCH — dominant column */}
          <section className="lg:col-span-8">
            <div className="flex items-baseline justify-between border-b border-ink pb-2 mb-8">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.22em]">
                So‘nggi tadqiqotlar
              </h2>
              <span className="text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                Tahririy ko‘rinish
              </span>
            </div>

            <div>
              {PREVIEW_PAPERS.map((p, i) => (
                <article
                  key={p.manuscriptId}
                  className={
                    "group py-8 " +
                    (i !== PREVIEW_PAPERS.length - 1 ? "border-b border-rule" : "")
                  }
                >
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--accent-oxblood)] border border-[color:var(--accent-oxblood)]/25 px-2 py-0.5">
                      {p.field}
                    </span>
                    <span className="text-[11px] font-mono text-ink-faint tracking-wider">
                      {p.manuscriptId}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                      {p.issue}
                    </span>
                  </div>

                  <h3
                    className="text-[1.55rem] md:text-[1.75rem] leading-[1.15] font-medium mb-3 text-balance group-hover:text-[color:var(--accent-oxblood)] transition-colors cursor-pointer"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {p.title}
                  </h3>

                  <div className="text-sm mb-2">
                    <span className="font-medium">{p.authors}</span>
                  </div>
                  {p.affiliation && (
                    <p className="text-xs text-ink-muted mb-3 leading-relaxed">
                      {p.affiliation}
                    </p>
                  )}

                  <p className="text-sm text-ink-soft leading-relaxed max-w-[68ch] mb-4">
                    {p.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-x-3 gap-y-1 mb-5">
                    {p.keywords.map((k, idx) => (
                      <span key={k} className="text-[11px] text-ink-muted">
                        {k}
                        {idx < p.keywords.length - 1 && (
                          <span className="text-ink-faint ml-3">·</span>
                        )}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold uppercase tracking-[0.2em]">
                    <button className="hover:text-[color:var(--accent-oxblood)] transition-colors">
                      Annotatsiya
                    </button>
                    <button className="hover:text-[color:var(--accent-oxblood)] transition-colors">
                      PDF
                    </button>
                    <button className="hover:text-[color:var(--accent-oxblood)] transition-colors">
                      Iqtibos
                    </button>
                    <span className="ml-auto text-ink-faint font-normal normal-case tracking-normal">
                      {p.date}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* RAIL — current issue, fields, editorial */}
          <aside className="lg:col-span-4 space-y-12">
            <div>
              <p className="label-mono mb-3">Joriy son</p>
              <p
                className="font-medium leading-tight mb-1"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                }}
              >
                70-jild · 3-son
              </p>
              <p className="text-xs text-ink-muted mb-4">Iyul 2026</p>
              <div className="flex gap-4 text-[11px] font-bold uppercase tracking-[0.2em]">
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
                    className="flex items-baseline justify-between py-2 border-b border-rule group cursor-pointer"
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

            <div className="border-t border-ink pt-4">
              <p className="label-mono mb-3">Taqriz modeli</p>
              <p className="text-sm text-ink-soft leading-relaxed">
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
          </aside>
        </div>
      </div>
    </PublicShell>
  );
}
