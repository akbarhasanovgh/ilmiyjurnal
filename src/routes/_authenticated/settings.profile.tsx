import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AuthorShell } from "@/components/author-shell";
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
    <AuthorShell>
      <div className="px-10 md:px-14 py-12 max-w-2xl">
        <div className="mb-10">
          <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-muted-foreground">
            Sozlamalar
          </p>
          <h1 className="font-serif text-[36px] leading-tight tracking-tight mt-3 text-foreground">
            Profil
          </h1>
          <p className="text-[14px] text-muted-foreground mt-3 max-w-md leading-relaxed">
            Sizning ma’lumotlaringiz maqolalarga muallif sifatida biriktiriladi.
          </p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="space-y-5">
          <F l="To‘liq ism-sharif">
            <input className="input rounded-xl" required value={form.full_name}
              onChange={(e) => setForm(f => ({ ...f, full_name: e.target.value }))} />
          </F>
          <F l="Ilmiy daraja">
            <input className="input rounded-xl" value={form.academic_degree}
              onChange={(e) => setForm(f => ({ ...f, academic_degree: e.target.value }))}
              placeholder="fil.f.n., dots., prof." />
          </F>
          <F l="Muassasa">
            <input className="input rounded-xl" value={form.institution_text}
              onChange={(e) => setForm(f => ({ ...f, institution_text: e.target.value }))} />
          </F>
          <F l="Bo‘lim">
            <input className="input rounded-xl" value={form.department}
              onChange={(e) => setForm(f => ({ ...f, department: e.target.value }))} />
          </F>
          <F l="ORCID">
            <input className="input font-mono rounded-xl" value={form.orcid}
              onChange={(e) => setForm(f => ({ ...f, orcid: e.target.value }))}
              placeholder="0000-0000-0000-0000" />
          </F>
          <F l="Davlat">
            <input className="input rounded-xl" value={form.country}
              onChange={(e) => setForm(f => ({ ...f, country: e.target.value }))} />
          </F>
          <div className="pt-2">
            <button
              className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-2.5 text-[13.5px] font-medium hover:opacity-90 transition-opacity active:scale-[0.97] disabled:opacity-50"
              disabled={m.isPending}
            >
              {m.isPending ? "Saqlanmoqda…" : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </AuthorShell>
  );
}

function F({ l, children }: { l: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-[11.5px] font-semibold tracking-[0.12em] uppercase text-muted-foreground block">
        {l}
      </span>
      {children}
    </label>
  );
}
