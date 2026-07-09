import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Search, Loader2, FileText, ArrowUpRight, SlidersHorizontal, RefreshCw } from "lucide-react";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkflowBadge } from "@/components/workflow-badge";
import { adminListInbox } from "@/lib/admin.functions";
import type { WorkflowState } from "@/lib/workflow";

export const Route = createFileRoute("/_authenticated/admin/inbox")({
  head: () => ({
    meta: [{ title: "Tahririyat qutisi — Admin" }, { name: "robots", content: "noindex" }],
  }),
  component: Inbox,
});

function initial(s: string | null | undefined) {
  return (s || "?").trim().charAt(0).toUpperCase();
}

function Inbox() {
  const list = useServerFn(adminListInbox);
  const q = useQuery({ queryKey: ["admin-inbox"], queryFn: () => list() });

  const [term, setTerm] = useState("");
  const [state, setState] = useState<string>("all");

  const filtered = useMemo(() => {
    const rows = q.data ?? [];
    const t = term.trim().toLowerCase();
    return rows.filter((r) => {
      if (state !== "all" && r.workflow_state !== state) return false;
      if (!t) return true;
      return (
        (r.title ?? "").toLowerCase().includes(t) ||
        (r.manuscript_id ?? "").toLowerCase().includes(t) ||
        (r.owner?.full_name ?? "").toLowerCase().includes(t) ||
        (r.owner?.email ?? "").toLowerCase().includes(t)
      );
    });
  }, [q.data, term, state]);

  const totalByState = useMemo(() => {
    const rows = q.data ?? [];
    const counts: Record<string, number> = {};
    for (const r of rows) counts[r.workflow_state] = (counts[r.workflow_state] ?? 0) + 1;
    return counts;
  }, [q.data]);

  const total = (q.data ?? []).length;

  return (
    <AdminLayout
      title="Tahririyat qutisi"
      description={`Faol jarayondagi ${total} ta maqola.`}
      actions={
        <Button
          variant="outline"
          size="lg"
          onClick={() => q.refetch()}
          disabled={q.isFetching}
          className="rounded-full h-11 px-5 gap-2"
        >
          <RefreshCw className={q.isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
          Yangilash
        </Button>
      }
    >
      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: "submitted", label: "Yangi", tone: "bg-amber-500/10 text-amber-600" },
            { key: "under_review", label: "Taqrizda", tone: "bg-sky-500/10 text-sky-600" },
            { key: "revision_requested", label: "Qayta ishlash", tone: "bg-rose-500/10 text-rose-600" },
            { key: "editor_assigned", label: "Muharrirda", tone: "bg-emerald-500/10 text-emerald-600" },
          ].map((k) => (
            <div
              key={k.key}
              className="rounded-2xl bg-muted/40 border border-border/40 p-4 transition-all duration-200 hover:bg-muted/60 hover:-translate-y-0.5"
            >
              <div className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium mb-3 ${k.tone}`}>
                {k.label}
              </div>
              <p className="text-3xl font-semibold tracking-tight tabular-nums">
                {totalByState[k.key] ?? 0}
              </p>
            </div>
          ))}
        </div>

        {/* Table shell */}
        <div className="rounded-3xl bg-muted/30 border border-border/60 p-3">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-2.5 mb-3 px-1 pt-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Sarlavha, ID yoki muallif…"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="pl-11 h-11 rounded-full bg-background border-transparent shadow-sm focus-visible:border-border text-[14.5px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={state} onValueChange={setState}>
                <SelectTrigger className="h-11 rounded-full bg-background border-transparent shadow-sm px-4 text-[13.5px] gap-2">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Holat:</span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="all">Barchasi</SelectItem>
                  <SelectItem value="submitted">Yuborilgan</SelectItem>
                  <SelectItem value="screening">Ko‘rib chiqilmoqda</SelectItem>
                  <SelectItem value="editor_assigned">Muharrir tayinlangan</SelectItem>
                  <SelectItem value="under_review">Taqrizda</SelectItem>
                  <SelectItem value="revision_requested">Qayta ishlash so‘ralgan</SelectItem>
                  <SelectItem value="revised">Qayta ishlangan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table body as list */}
          <div className="rounded-2xl bg-background border border-border/50 overflow-hidden">
            {q.isPending ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : q.error ? (
              <div className="p-8 text-sm text-destructive">{(q.error as Error).message}</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 animate-fade-in">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-[15px] font-medium">Maqolalar topilmadi</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Filtrni o‘zgartirib ko‘ring
                </p>
              </div>
            ) : (
              <>
                {/* Column labels */}
                <div className="hidden md:grid grid-cols-[110px_minmax(0,1fr)_220px_120px_150px_44px] gap-4 px-5 py-3 border-b border-border/60 text-[11px] font-semibold tracking-[0.06em] uppercase text-muted-foreground/70">
                  <div>ID</div>
                  <div>Sarlavha</div>
                  <div>Muallif</div>
                  <div>Turi</div>
                  <div>Holat</div>
                  <div></div>
                </div>
                <div className="divide-y divide-border/50">
                  {filtered.map((s) => (
                    <Link
                      key={s.id}
                      to="/submissions/$id"
                      params={{ id: s.id }}
                      className="group grid grid-cols-[110px_minmax(0,1fr)_220px_120px_150px_44px] gap-4 items-center px-5 py-4 hover:bg-muted/40 transition-colors"
                    >
                      <div className="font-mono text-xs text-muted-foreground truncate">
                        {s.manuscript_id}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14.5px] font-medium tracking-tight truncate">
                          {s.title || (
                            <span className="italic text-muted-foreground">Sarlavhasiz</span>
                          )}
                        </p>
                        {s.submitted_at ? (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {format(new Date(s.submitted_at), "dd MMM yyyy")}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="text-[11px] font-medium bg-gradient-to-br from-primary/15 to-primary/5 text-primary">
                            {initial(s.owner?.full_name || s.owner?.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-[13.5px] font-medium truncate">
                            {s.owner?.full_name || "—"}
                          </p>
                          <p className="text-[11.5px] text-muted-foreground truncate">
                            {s.owner?.email || ""}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Badge
                          variant="outline"
                          className="rounded-full font-normal bg-muted/60 border-transparent text-[11.5px]"
                        >
                          {s.article_type}
                        </Badge>
                      </div>
                      <div>
                        <WorkflowBadge state={s.workflow_state as WorkflowState} />
                      </div>
                      <div className="flex justify-end">
                        <div className="w-8 h-8 rounded-full bg-transparent group-hover:bg-background border border-transparent group-hover:border-border/60 flex items-center justify-center transition-all">
                          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="px-5 py-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {filtered.length} ta ko‘rsatilmoqda
                    {filtered.length !== total ? ` · jami ${total}` : ""}
                  </span>
                  <span className="tabular-nums">Yuklandi {format(new Date(), "HH:mm")}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile fallback card list is included via responsive grid — omitted for brevity */}
        {filtered.length === 0 && !q.isPending && !q.error ? null : null}

        {/* Small unused card kept out to reduce noise */}
        <Card className="hidden">
          <CardContent />
        </Card>
      </div>
    </AdminLayout>
  );
}
