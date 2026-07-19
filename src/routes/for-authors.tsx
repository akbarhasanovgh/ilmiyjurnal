import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/public-shell";

export const Route = createFileRoute("/for-authors")({
  head: () => ({
    meta: [
      { title: "Mualliflar uchun — O‘zbek tili va adabiyoti" },
      {
        name: "description",
        content:
          "Maqola topshirish tartibi, talablar va taqriz jarayoni haqida ko‘rsatmalar.",
      },
    ],
  }),
  component: ForAuthors,
});

const STEPS = [
  {
    n: "01",
    title: "Ro‘yxatdan o‘tish",
    text: "Tahririyat tizimida hisob yarating yoki mavjud hisobingizga kiring.",
  },
  {
    n: "02",
    title: "Shaklni to‘ldiring",
    text: "Yetti bosqichli shakl: shartlar, fayllar, mualliflar, metama’lumotlar, tasdiqnomalar, qo‘shimcha fayllar, taqrizchi takliflari.",
  },
  {
    n: "03",
    title: "Topshirish",
    text: "Maqolangiz OTA-YYYY-NNNN ko‘rinishidagi noyob raqam oladi va tahririyat navbatiga tushadi.",
  },
  {
    n: "04",
    title: "Dastlabki ko‘rik",
    text: "Tahririyat texnik moslikni tekshiradi va mavzuga mos muharrir tayinlaydi.",
  },
  {
    n: "05",
    title: "Anonim taqriz",
    text: "Ikki tomonlama anonim taqriz. Muallif va taqrizchilar bir-birini bilishmaydi.",
  },
  {
    n: "06",
    title: "Qaror",
    text: "Taqrizchi izohlari asosida qaror qabul qilinadi: qabul, qayta ko‘rib chiqish yoki rad.",
  },
];

function ForAuthors() {
  return (
    <PublicShell>
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-8 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12.5px] text-ink-muted mb-6">
          <Link to="/" className="hover:text-ink transition-colors">
            Bosh sahifa
          </Link>
          <span className="text-ink-faint">›</span>
          <span className="text-ink">Mualliflar uchun</span>
        </nav>

        {/* Hero */}
        <div className="rounded-3xl bg-[color:var(--surface-sunken)] p-8 md:p-12 mb-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-[42rem]">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[color:var(--accent-oxblood)] text-page text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                Ko‘rsatma
              </span>
              <h1
                className="font-semibold leading-tight tracking-tight text-ink"
                style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
              >
                Mualliflar uchun
              </h1>
              <p className="mt-4 text-[14px] text-ink-soft leading-relaxed max-w-[60ch]">
                Maqola topshirishdan qaror qabul qilinishigacha bo‘lgan
                bosqichlar, fayl talablari va taqriz jarayoni.
              </p>
            </div>
            <Link
              to="/auth"
              className="inline-flex items-center rounded-full bg-[color:var(--accent-oxblood)] text-page px-5 py-2.5 text-[13px] font-semibold hover:opacity-90 transition-opacity"
            >
              Maqola topshirish
            </Link>
          </div>
        </div>

        {/* Steps */}
        <section className="mb-12">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] mb-6">
            Topshirish tartibi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-3xl bg-[color:var(--page-elevated)] border border-rule p-6 shadow-[0_1px_0_rgba(23,20,18,0.03)]"
              >
                <p className="text-[11px] font-mono tracking-wider text-[color:var(--accent-oxblood)] mb-3">
                  {s.n}
                </p>
                <h3 className="text-lg font-semibold text-ink mb-2">
                  {s.title}
                </h3>
                <p className="text-[13.5px] text-ink-soft leading-relaxed">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Requirements */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-[color:var(--page-elevated)] border border-rule p-8">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] mb-4">
              Fayl talablari
            </h2>
            <ul className="space-y-3 text-[14px] text-ink-soft leading-relaxed">
              <li className="flex gap-3">
                <span className="text-[color:var(--accent-oxblood)] font-bold">·</span>
                <span>Asosiy matn: .docx yoki .pdf, 20 MB gacha.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[color:var(--accent-oxblood)] font-bold">·</span>
                <span>Anonim variant: muallif ma’lumotlarisiz alohida yuklanadi.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[color:var(--accent-oxblood)] font-bold">·</span>
                <span>Rasmlar va jadvallar alohida fayllar sifatida qabul qilinadi.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[color:var(--accent-oxblood)] font-bold">·</span>
                <span>Iqtiboslar APA yoki GOST uslubida rasmiylashtiriladi.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-[color:var(--surface-sunken)] p-8">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] mb-4">
              Yo‘nalishlar
            </h2>
            <ul className="space-y-3">
              <li className="flex items-baseline justify-between gap-4">
                <span className="text-[15px] font-medium text-ink">Filologiya</span>
                <span className="text-[11px] font-mono tracking-wider text-ink-faint">
                  10.00.00
                </span>
              </li>
              <li className="flex items-baseline justify-between gap-4">
                <span className="text-[15px] font-medium text-ink">Pedagogika</span>
                <span className="text-[11px] font-mono tracking-wider text-ink-faint">
                  13.00.00
                </span>
              </li>
            </ul>
            <p className="mt-6 text-[13px] text-ink-soft leading-relaxed">
              Ikki tomonlama anonim (double-blind) taqriz modeli. Muallif va
              taqrizchi bir-biri haqida ma’lumotga ega bo‘lmaydi.
            </p>
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
