import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/public-shell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Jurnal haqida — O‘zbek tili va adabiyoti" },
      { name: "description", content: "«O‘zbek tili va adabiyoti» ilmiy-nazariy jurnali haqida." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <PublicShell>
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
        <div>
          <p className="label-mono">Jurnal haqida</p>
          <h1 className="font-serif text-4xl leading-tight mt-2">O‘zbek tili va adabiyoti</h1>
        </div>
        <p className="font-serif text-lg leading-relaxed text-ink-soft">
          «O‘zbek tili va adabiyoti» — filologiya sohasidagi ilmiy-nazariy nashr
          bo‘lib, o‘zbek tili, adabiyoti, folklor va matnshunoslikning dolzarb
          masalalarini yoritadi.
        </p>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-rule pt-8">
          <div>
            <dt className="label-mono">ISSN</dt>
            <dd className="text-sm mt-1 font-mono">2010-5584</dd>
          </div>
          <div>
            <dt className="label-mono">Chastota</dt>
            <dd className="text-sm mt-1">6 son / yil</dd>
          </div>
          <div>
            <dt className="label-mono">Taqriz modeli</dt>
            <dd className="text-sm mt-1">Ikki tomonlama anonim (double-blind)</dd>
          </div>
          <div>
            <dt className="label-mono">Til</dt>
            <dd className="text-sm mt-1">O‘zbek (asosiy), ingliz, rus</dd>
          </div>
        </dl>
      </div>
    </PublicShell>
  );
}
