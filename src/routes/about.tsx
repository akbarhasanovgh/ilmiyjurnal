import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/public-shell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Jurnal haqida — O‘zbek tili va adabiyoti" },
      {
        name: "description",
        content:
          "«O‘zbek tili va adabiyoti» ilmiy-nazariy jurnali haqida.",
      },
    ],
  }),
  component: About,
});

const FACTS: { label: string; value: string; mono?: boolean }[] = [
  { label: "ISSN", value: "2010-5584", mono: true },
  { label: "Chastota", value: "6 son / yil" },
  { label: "Ta’sis yili", value: "1958" },
  { label: "Taqriz modeli", value: "Ikki tomonlama anonim" },
  { label: "Til", value: "O‘zbek, ingliz, rus" },
  { label: "Yo‘nalishlar", value: "Filologiya, Pedagogika" },
];

function About() {
  return (
    <PublicShell>
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-8 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12.5px] text-ink-muted mb-6">
          <Link to="/" className="hover:text-ink transition-colors">
            Bosh sahifa
          </Link>
          <span className="text-ink-faint">›</span>
          <span className="text-ink">Jurnal haqida</span>
        </nav>

        {/* Hero */}
        <div className="rounded-3xl bg-[color:var(--surface-sunken)] p-8 md:p-12 mb-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[color:var(--accent-oxblood)] text-page text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            Jurnal haqida
          </span>
          <h1
            className="font-semibold leading-tight tracking-tight text-ink"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
          >
            O‘zbek tili va adabiyoti
          </h1>
          <p className="mt-5 text-[15px] text-ink-soft leading-relaxed max-w-[68ch]">
            «O‘zbek tili va adabiyoti» — filologiya va pedagogika sohalaridagi
            ilmiy-nazariy nashr. Jurnal 1958-yildan buyon o‘zbek tili,
            adabiyoti, folklori va matnshunosligining dolzarb masalalarini
            yoritib keladi. Har bir maqola ikki tomonlama anonim taqrizdan
            o‘tadi.
          </p>
        </div>

        {/* Facts grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {FACTS.map((f) => (
            <div
              key={f.label}
              className="rounded-3xl bg-[color:var(--page-elevated)] border border-rule p-6 shadow-[0_1px_0_rgba(23,20,18,0.03)]"
            >
              <p className="text-[10px] uppercase tracking-[0.22em] text-ink-faint mb-2">
                {f.label}
              </p>
              <p
                className={
                  "text-[15px] font-semibold text-ink " +
                  (f.mono ? "font-mono tracking-wider" : "")
                }
              >
                {f.value}
              </p>
            </div>
          ))}
        </section>

        {/* Mission */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-[color:var(--page-elevated)] border border-rule p-8">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] mb-4">
              Missiya
            </h2>
            <p className="text-[14px] text-ink-soft leading-relaxed">
              O‘zbek filologiyasi va pedagogika sohalarida sifatli, ochiq va
              qat’iy taqrizdan o‘tgan tadqiqotlarni chop etish; yangi
              tadqiqotchilarni qo‘llab-quvvatlash; ilmiy an’anani milliy
              madaniyat kontekstida davom ettirish.
            </p>
          </div>

          <div className="rounded-3xl bg-[color:var(--surface-sunken)] p-8">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] mb-4">
              Tahririyat
            </h2>
            <p className="text-[14px] text-ink-soft leading-relaxed">
              Bosh muharrir, mas’ul kotib va soha muharrirlaridan iborat
              tahririyat kengashi. Har bir maqolaga yo‘nalish bo‘yicha muharrir
              tayinlanadi va taqriz jarayoni ochiq, kuzatiladigan tartibda
              olib boriladi.
            </p>
            <Link
              to="/for-authors"
              className="mt-6 inline-flex items-center text-[11px] font-bold uppercase tracking-[0.2em] text-ink hover:text-[color:var(--accent-oxblood)] transition-colors"
            >
              Mualliflar uchun ko‘rsatmalar →
            </Link>
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
