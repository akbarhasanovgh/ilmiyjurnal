import { createFileRoute } from "@tanstack/react-router";
import { PublicShell } from "@/components/public-shell";

export const Route = createFileRoute("/for-authors")({
  head: () => ({
    meta: [
      { title: "Mualliflar uchun — O‘zbek tili va adabiyoti" },
      {
        name: "description",
        content: "Maqola topshirish tartibi, talablar va taqriz jarayoni haqida ko‘rsatmalar.",
      },
    ],
  }),
  component: ForAuthors,
});

function ForAuthors() {
  return (
    <PublicShell>
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">
        <div>
          <p className="label-mono">Ko‘rsatma</p>
          <h1 className="font-serif text-4xl leading-tight mt-2">
            Mualliflar uchun
          </h1>
        </div>
        <section className="space-y-4">
          <h2 className="font-serif text-2xl">Maqola topshirish tartibi</h2>
          <ol className="list-decimal ml-6 space-y-2 text-sm text-ink-soft leading-relaxed">
            <li>Tahririyat tizimida ro‘yxatdan o‘ting yoki hisobingizga kiring.</li>
            <li>«Yangi maqola topshirish» bo‘limida besh bosqichli shaklni to‘ldiring: metama’lumotlar, mualliflar, annotatsiya, fayllar, tasdiqnomalar.</li>
            <li>Topshirilgan maqola OTA-YYYY-NNNN shaklidagi noyob raqam oladi.</li>
            <li>Tahririyat dastlabki ko‘rikni o‘tkazadi, muharrir tayinlaydi.</li>
            <li>Ikki tomonlama anonim taqriz jarayonidan so‘ng qaror qabul qilinadi.</li>
          </ol>
        </section>
        <section className="space-y-4">
          <h2 className="font-serif text-2xl">Fayl talablari</h2>
          <ul className="list-disc ml-6 space-y-2 text-sm text-ink-soft leading-relaxed">
            <li>Asosiy matn: .docx yoki .pdf, 20 MB gacha.</li>
            <li>Anonim variant: muallif ma’lumotlarisiz alohida yuklanadi.</li>
            <li>Rasmlar va jadvallar alohida fayllar sifatida qabul qilinadi.</li>
          </ul>
        </section>
      </div>
    </PublicShell>
  );
}
