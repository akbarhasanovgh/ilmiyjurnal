import { createFileRoute } from "@tanstack/react-router";
import { Wrench } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/_authenticated/admin/tools")({
  head: () => ({
    meta: [{ title: "Vositalar — Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: Page,
});

function Page() {
  return (
    <AdminLayout title="Vositalar" description="Import, eksport va texnik xizmat vositalari.">
      <ComingSoon
        icon={Wrench}
        title="Admin vositalari"
        description="Ma’lumotlarni import/eksport qilish, keshni tozalash va boshqa xizmat operatsiyalari."
        items={["Import (JATS/CSV)", "Eksport", "Keshni tozalash", "Zaxira nusxa"]}
      />
    </AdminLayout>
  );
}
