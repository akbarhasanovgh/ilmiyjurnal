import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn, createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Loader2, History, Search } from "lucide-react";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

function actionTone(action: string) {
  const a = action.toLowerCase();
  if (a.includes("delete") || a.includes("revoke")) return "bg-rose-500/10 text-rose-600";
  if (a.includes("grant") || a.includes("create") || a.includes("assign"))
    return "bg-emerald-500/10 text-emerald-600";
  if (a.includes("update") || a.includes("edit")) return "bg-amber-500/10 text-amber-600";
  return "bg-sky-500/10 text-sky-600";
}

function Audit() {
  const list = useServerFn(listAuditLog);
  const q = useQuery({ queryKey: ["audit-log"], queryFn: () => list() });
  const [term, setTerm] = useState("");

  const filtered = useMemo(() => {
    const rows = q.data ?? [];
    const t = term.trim().toLowerCase();
    if (!t) return rows;
    return rows.filter(
      (r) =>
        r.action?.toLowerCase().includes(t) ||
        r.resource_type?.toLowerCase().includes(t) ||
        r.resource_id?.toLowerCase().includes(t),
    );
  }, [q.data, term]);

  return (
    <AdminLayout
      title="Audit jurnali"
      description="Barcha muhim amallar shu yerda qayd etiladi. Yozuvlar o‘zgartirilmaydi."
    >
      <div className="rounded-3xl bg-muted/30 border border-border/60 p-3">
        <div className="px-1 pt-1 pb-3">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Amal, resurs turi yoki ID bo‘yicha qidirish…"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="pl-11 h-11 rounded-full bg-background border-transparent shadow-sm focus-visible:border-border text-[14.5px]"
            />
          </div>
        </div>

        <div className="rounded-2xl bg-background border border-border/50 overflow-hidden">
          {q.isPending ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : q.error ? (
            <div className="p-6 text-sm text-destructive">{(q.error as Error).message}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                <History className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-[15px] font-medium">Yozuvlar topilmadi</p>
              <p className="text-sm text-muted-foreground mt-1">
                Hozircha audit yozuvi yo‘q.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden md:grid grid-cols-[180px_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1.2fr)] gap-4 px-5 py-3 border-b border-border/60 text-[11px] font-semibold tracking-[0.06em] uppercase text-muted-foreground/70">
                <div>Vaqt</div>
                <div>Amal</div>
                <div>Turi</div>
                <div>Resurs ID</div>
              </div>
              <div className="divide-y divide-border/50">
                {filtered.map((r) => (
                  <div
                    key={r.id}
                    className="grid grid-cols-[180px_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1.2fr)] gap-4 items-center px-5 py-3.5 hover:bg-muted/40 transition-colors"
                  >
                    <div className="text-xs text-muted-foreground font-mono tabular-nums">
                      {format(new Date(r.created_at), "dd MMM · HH:mm:ss")}
                    </div>
                    <div>
                      <Badge
                        className={cn(
                          "rounded-full font-mono text-[11px] font-normal border-transparent hover:opacity-90",
                          actionTone(r.action),
                        )}
                      >
                        {r.action}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {r.resource_type}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono truncate">
                      {r.resource_id ?? "—"}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-border/60 text-xs text-muted-foreground">
                {filtered.length} ta yozuv · so‘nggi 200 ta
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
