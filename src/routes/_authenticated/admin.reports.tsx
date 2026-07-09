import { createFileRoute } from "@tanstack/react-router";
import { FileBarChart } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/_authenticated/admin/reports")({
  head: () => ({
    meta: [{ title: "Hisobotlar — Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: Page,
});

function Page() {
  return (
    <AdminLayout title="Hisobotlar" description="CSV formatida hisobotlar va eksport.">
      <ComingSoon
        icon={FileBarChart}
        title="Hisobotlar markazi"
        description="Tahririyat, foydalanuvchilar va maqolalar bo‘yicha CSV hisobotlarini yuklab oling."
        items={["Maqolalar CSV", "Sharhlovchilar hisoboti", "Foydalanuvchilar ro‘yxati", "Moliya"]}
      />
    </AdminLayout>
  );
}
