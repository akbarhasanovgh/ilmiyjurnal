import { createFileRoute } from "@tanstack/react-router";
import { Hash } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ComingSoon } from "@/components/admin/ComingSoon";

export const Route = createFileRoute("/_authenticated/admin/dois")({
  head: () => ({
    meta: [{ title: "DOI’lar — Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: Page,
});

function Page() {
  return (
    <AdminLayout title="DOI’lar" description="Maqolalar uchun DOI’larni tayinlash va ro‘yxatga olish.">
      <ComingSoon
        icon={Hash}
        title="DOI boshqaruvi"
        description="DOI prefiksini sozlang, maqolalarga DOI tayinlang va Crossref bilan integratsiyani boshqaring."
        items={["DOI prefiksi sozlamalari", "Ommaviy tayinlash", "Crossref deponent", "Xatolar jurnali"]}
      />
    </AdminLayout>
  );
}
