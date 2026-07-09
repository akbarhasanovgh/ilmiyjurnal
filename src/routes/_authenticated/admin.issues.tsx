import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/_authenticated/admin/issues")({
  head: () => ({
    meta: [{ title: "Sonlar — Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: Page,
});

function Page() {
  return (
    <AdminLayout title="Sonlar" description="Jurnal sonlarini yaratish, tahrirlash va nashr qilish.">
      <ComingSoon
        icon={BookOpen}
        title="Sonlar boshqaruvi"
        description="Bu yerda jurnalning yangi sonlarini shakllantirasiz, maqolalarni sonlarga biriktirasiz va arxivni boshqarasiz."
        items={["Yangi son yaratish", "Maqolalarni tayinlash", "Nashr qilish va DOI tayinlash", "Arxiv"]}
      />
    </AdminLayout>
  );
}
