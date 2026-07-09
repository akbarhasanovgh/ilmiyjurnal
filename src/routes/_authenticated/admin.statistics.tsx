import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/_authenticated/admin/statistics")({
  head: () => ({
    meta: [{ title: "Statistika — Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: Page,
});

function Page() {
  return (
    <AdminLayout title="Statistika" description="Maqolalar, sonlar va tahririyat faoliyati bo‘yicha ko‘rsatkichlar.">
      <ComingSoon
        icon={BarChart3}
        title="Statistika paneli"
        description="Yuborilgan maqolalar, qabul foizi, ko‘rishlar va yuklab olishlar bo‘yicha grafiklar."
        items={["Maqolalar", "Sonlar", "Tahririyat faoliyati", "Foydalanuvchilar"]}
      />
    </AdminLayout>
  );
}
