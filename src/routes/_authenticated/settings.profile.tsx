import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { EditorialShell } from "@/components/editorial-shell";
import { getSessionContext } from "@/lib/auth.functions";
import { updateMyProfile } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/settings/profile")({
  head: () => ({ meta: [{ title: "Profil sozlamalari" }, { name: "robots", content: "noindex" }] }),
  component: ProfileSettings,
});

function ProfileSettings() {
  const getCtx = useServerFn(getSessionContext);
  const update = useServerFn(updateMyProfile);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["session-context"], queryFn: () => getCtx() });
  const [form, setForm] = useState({
    full_name: "", orcid: "", institution_text: "", department: "", academic_degree: "", country: "",
  });

  useEffect(() => {
    if (q.data?.profile) {
      const p = q.data.profile;
      setForm({
        full_name: p.full_name ?? "",
        orcid: p.orcid ?? "",
        institution_text: p.institution_text ?? "",
        department: p.department ?? "",
        academic_degree: p.academic_degree ?? "",
        country: p.country ?? "",
      });
    }
  }, [q.data]);

  const m = useMutation({
    mutationFn: () => update({ data: form }),
    onSuccess: () => { toast.success("Saqlandi"); qc.invalidateQueries({ queryKey: ["session-context"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <EditorialShell>
      <div className="p-8 md:p-12 max-w-2xl">
        <div className="mb-10">
          <p className="label-mono">Sozlamalar</p>
          <h1 className="font-serif text-4xl leading-tight mt-2">Profil</h1>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="space-y-5">
          <F l="To‘liq ism-sharif"><input className="input" required value={form.full_name} onChange={(e) => setForm(f => ({ ...f, full_name: e.target.value }))} /></F>
          <F l="Ilmiy daraja"><input className="input" value={form.academic_degree} onChange={(e) => setForm(f => ({ ...f, academic_degree: e.target.value }))} placeholder="fil.f.n., dots., prof." /></F>
          <F l="Muassasa"><input className="input" value={form.institution_text} onChange={(e) => setForm(f => ({ ...f, institution_text: e.target.value }))} /></F>
          <F l="Bo‘lim"><input className="input" value={form.department} onChange={(e) => setForm(f => ({ ...f, department: e.target.value }))} /></F>
          <F l="ORCID"><input className="input font-mono" value={form.orcid} onChange={(e) => setForm(f => ({ ...f, orcid: e.target.value }))} placeholder="0000-0000-0000-0000" /></F>
          <F l="Davlat"><input className="input" value={form.country} onChange={(e) => setForm(f => ({ ...f, country: e.target.value }))} /></F>
          <button className="btn-primary hover:bg-ink-soft disabled:opacity-50" disabled={m.isPending}>
            {m.isPending ? "..." : "Saqlash"}
          </button>
        </form>
      </div>
    </EditorialShell>
  );
}
function F({ l, children }: { l: string; children: React.ReactNode }) {
  return <label className="block space-y-1.5"><span className="label-mono block">{l}</span>{children}</label>;
}
