import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { EditorialShell } from "@/components/editorial-shell";

const listAuditLog = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const Route = createFileRoute("/_authenticated/audit")({
  head: () => ({ meta: [{ title: "Audit jurnali" }, { name: "robots", content: "noindex" }] }),
  component: Audit,
});

function Audit() {
  const list = useServerFn(listAuditLog);
  const q = useQuery({ queryKey: ["audit-log"], queryFn: () => list() });

  return (
    <EditorialShell>
      <div className="p-8 md:p-12 max-w-5xl">
        <div className="mb-10">
          <p className="label-mono">Tizim</p>
          <h1 className="font-serif text-4xl leading-tight mt-2">Audit jurnali</h1>
          <p className="text-sm text-ink-muted mt-2">Barcha muhim amallar shu yerda qayd etiladi. Yozuvlar o‘zgartirilmaydi.</p>
        </div>
        {q.isPending ? (
          <div className="space-y-2">{[0,1,2,3,4].map(i => <div key={i} className="h-10 bg-surface-sunken animate-pulse" />)}</div>
        ) : q.error ? (
          <p className="text-sm text-destructive">{(q.error as Error).message}</p>
        ) : (q.data ?? []).length === 0 ? (
          <p className="text-sm text-ink-muted">Hali yozuvlar yo‘q.</p>
        ) : (
          <div className="divide-y divide-rule border-y border-rule font-mono text-xs">
            {q.data!.map((r) => (
              <div key={r.id} className="grid grid-cols-12 gap-3 py-2 items-baseline">
                <div className="col-span-3 text-ink-muted">{new Date(r.created_at).toLocaleString("uz-UZ")}</div>
                <div className="col-span-3 uppercase">{r.action}</div>
                <div className="col-span-2 text-ink-muted">{r.resource_type}</div>
                <div className="col-span-4 truncate text-ink-muted">{r.resource_id ?? "—"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </EditorialShell>
  );
}
