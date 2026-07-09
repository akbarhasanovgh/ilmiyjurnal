import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicShell } from "@/components/public-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "O‘zbek tili va adabiyoti — Ilmiy-nazariy jurnal" },
      {
        name: "description",
        content:
          "O‘zbek filologiyasi, tilshunoslik, adabiyotshunoslik va matnshunoslik bo‘yicha ilmiy jurnal. ISSN 2010-5584.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <PublicShell>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* FEATURED — placeholder until real content is added */}
          <section className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 label-mono">
                <span>Tahririyat so‘zi</span>
                <span className="size-1 bg-ink-faint rounded-full" aria-hidden />
                <span>2026, 1-son</span>
              </div>
              <h2 className="font-serif text-3xl md:text-5xl font-medium leading-tight text-balance">
                Filologik tadqiqotlar uchun raqamli tahririyat
              </h2>
              <p className="text-base text-ink-soft leading-relaxed max-w-[62ch]">
                «O‘zbek tili va adabiyoti» jurnali — o‘zbek tili, adabiyoti,
                folklor va matnshunoslik sohalaridagi original ilmiy
                tadqiqotlarni nashr etuvchi ilmiy-nazariy nashr. Ushbu tahririyat
                platformasi maqola topshirish, ikki tomonlama anonim taqriz va
                nashr jarayonini shaffof va kuzatilishi mumkin qiladi.
              </p>
            </div>

            <div className="p-8 bg-surface-sunken border border-rule">
              <p className="font-serif text-lg leading-relaxed text-ink-soft italic max-w-[56ch]">
                “Jurnal ochilishi arafasida. Birinchi soni tahririy tayyorgarlik
                bosqichida. Mualliflar maqolalarini bugundan boshlab topshirishlari
                mumkin.”
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/auth"
                  search={{ next: "/submissions/new" }}
                  className="btn-primary hover:bg-ink-soft"
                >
                  Maqola topshirish
                </Link>
                <Link to="/for-authors" className="btn-secondary hover:bg-surface-sunken">
                  Mualliflar uchun ko‘rsatmalar
                </Link>
              </div>
            </div>
          </section>

          <aside className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h3 className="label-mono">Yo‘nalishlar</h3>
              <div className="divide-y divide-rule">
                {[
                  ["Tilshunoslik", "Morfologiya, sintaksis, leksikografiya"],
                  ["Adabiyotshunoslik", "Mumtoz va zamonaviy adabiyot"],
                  ["Matnshunoslik", "Qo‘lyozmalar va tanqidiy nashrlar"],
                  ["Folklor", "Og‘zaki ijod va etnolingvistika"],
                ].map(([title, sub]) => (
                  <div key={title} className="py-4">
                    <p className="text-base font-medium">{title}</p>
                    <p className="text-xs text-ink-muted mt-1">{sub}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-rule p-6 space-y-3">
              <p className="label-mono">Taqriz modeli</p>
              <p className="text-sm text-ink-soft leading-relaxed">
                Ikki tomonlama anonim (double-blind) taqriz. Muallif va taqrizchi
                bir-biri haqida ma’lumotga ega bo‘lmaydi.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </PublicShell>
  );
}
