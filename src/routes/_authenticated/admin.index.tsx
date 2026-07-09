import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { format } from "date-fns";
import {
  Inbox,
  Users,
  ClipboardList,
  History,
  ArrowUpRight,
  Loader2,
  Sparkles,
} from "lucide-react";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { WorkflowBadge } from "@/components/workflow-badge";
import { adminListInbox, adminListUsers } from "@/lib/admin.functions";
import { getSessionContext } from "@/lib/auth.functions";
import type { WorkflowState } from "@/lib/workflow";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [{ title: "Admin paneli" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminOverview,
});

type StatTone = "indigo" | "amber" | "sky" | "emerald" | "violet";

const TONE: Record<StatTone, { bg: string; text: string; ring: string }> = {
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-600", ring: "ring-indigo-500/15" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-600", ring: "ring-amber-500/15" },
  sky: { bg: "bg-sky-500/10", text: "text-sky-600", ring: "ring-sky-500/15" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-600", ring: "ring-emerald-500/15" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-600", ring: "ring-violet-500/15" },
};

function AdminOverview() {
  const getCtx = useServerFn(getSessionContext);
  const listInbox = useServerFn(adminListInbox);
  const listUsers = useServerFn(adminListUsers);

  const ctxQ = useQuery({ queryKey: ["session-context"], queryFn: () => getCtx() });
  const perms = new Set(ctxQ.data?.permissions ?? []);
  const canInbox = perms.has("submissions.view_all");
  const canUsers = perms.has("users.view");

  const inbox = useQuery({
    queryKey: ["admin-inbox"],
    queryFn: () => listInbox(),
    enabled: canInbox,
  });
  const users = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => listUsers(),
    enabled: canUsers,
  });

  if (ctxQ.data && !canInbox && !canUsers && !perms.has("audit.view")) {
    return <Navigate to="/dashboard" />;
  }

  const inboxRows = inbox.data ?? [];
  const usersRows = users.data ?? [];
  const submitted = inboxRows.filter((r) => r.workflow_state === "submitted").length;
  const underReview = inboxRows.filter((r) => r.workflow_state === "under_review").length;
  const staff = usersRows.filter((u) =>
    (u.roles ?? []).some((r) =>
      ["editor", "managing_editor", "administrator", "super_admin"].includes(r.key),
    ),
  ).length;

  const recent = inboxRows.slice(0, 6);
  const firstName = ctxQ.data?.profile?.full_name?.split(" ")[0];

  return (
    <AdminLayout
      title={`Xush kelibsiz${firstName ? `, ${firstName}` : ""}`}
      description={`Bugun ${format(new Date(), "dd MMMM yyyy")} · Tahririyat tizimining umumiy holati.`}
    >
      <div className="space-y-6">
        {/* Stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatTile
            tone="amber"
            icon={Inbox}
            label="Yangi topshirilgan"
            value={inbox.isPending && canInbox ? "…" : submitted}
            hint="Ko‘rib chiqishni kutmoqda"
          />
          <StatTile
            tone="sky"
            icon={ClipboardList}
            label="Taqrizda"
            value={inbox.isPending && canInbox ? "…" : underReview}
            hint="Faol taqrizchilarda"
          />
          <StatTile
            tone="indigo"
            icon={Sparkles}
            label="Faol jarayonda"
            value={inbox.isPending && canInbox ? "…" : inboxRows.length}
            hint="Jami tahririyatda"
          />
          <StatTile
            tone="violet"
            icon={Users}
            label="Xodimlar"
            value={users.isPending && canUsers ? "…" : staff}
            hint="Tahririyat jamoasi"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Recent submissions */}
          <div className="lg:col-span-2 rounded-3xl bg-muted/30 border border-border/50 p-3">
            <div className="flex items-center justify-between px-3 pt-2 pb-3">
              <div>
                <h3 className="text-[15px] font-semibold tracking-tight">So‘nggi maqolalar</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Eng yangi yuborilgan ishlar
                </p>
              </div>
              {canInbox ? (
                <Link
                  to="/admin/inbox"
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground rounded-full px-3 py-1.5 hover:bg-background transition-colors"
                >
                  Barchasi
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              ) : null}
            </div>
            <div className="rounded-2xl bg-background border border-border/50 overflow-hidden">
              {!canInbox ? (
                <p className="p-6 text-sm text-muted-foreground">
                  Sizda tahririyat qutisini ko‘rish uchun ruxsat yo‘q.
                </p>
              ) : inbox.isPending ? (
                <div className="py-14 flex justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : recent.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground">Hozircha maqola yo‘q.</p>
              ) : (
                <div className="divide-y divide-border/50">
                  {recent.map((s) => (
                    <Link
                      key={s.id}
                      to="/submissions/$id"
                      params={{ id: s.id }}
                      className="group flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
                    >
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="text-[11px] font-medium bg-gradient-to-br from-primary/15 to-primary/5 text-primary">
                          {(s.owner?.full_name || s.owner?.email || "?").trim().charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium truncate">
                          {s.title || (
                            <span className="italic text-muted-foreground">Sarlavhasiz</span>
                          )}
                        </p>
                        <p className="text-[12px] text-muted-foreground truncate">
                          <span className="font-mono">{s.manuscript_id}</span>
                          {" · "}
                          {s.owner?.full_name || s.owner?.email || "—"}
                        </p>
                      </div>
                      <WorkflowBadge state={s.workflow_state as WorkflowState} />
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-3xl bg-muted/30 border border-border/50 p-3">
            <div className="px-3 pt-2 pb-3">
              <h3 className="text-[15px] font-semibold tracking-tight">Tez amallar</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Eng ko‘p ishlatiladigan bo‘limlar
              </p>
            </div>
            <div className="space-y-1.5">
              {canInbox ? (
                <QuickLink to="/admin/inbox" icon={Inbox} label="Tahririyat qutisi" tone="amber" />
              ) : null}
              {canUsers ? (
                <QuickLink to="/admin/users" icon={Users} label="Foydalanuvchilar" tone="violet" />
              ) : null}
              <QuickLink
                to="/editor/queue"
                icon={ClipboardList}
                label="Menga tayinlangan"
                tone="emerald"
              />
              {perms.has("audit.view") ? (
                <QuickLink to="/audit" icon={History} label="Audit jurnali" tone="sky" />
              ) : null}
            </div>

            <div className="mt-4 mx-1 p-3 rounded-2xl bg-background border border-border/50">
              <p className="text-[11px] font-semibold tracking-[0.06em] uppercase text-muted-foreground/70 mb-2">
                Rollaringiz
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(ctxQ.data?.roles ?? []).map((r) => (
                  <Badge
                    key={r.key}
                    variant="secondary"
                    className="rounded-full font-normal text-[11.5px]"
                  >
                    {r.name}
                  </Badge>
                ))}
                {(ctxQ.data?.roles ?? []).length === 0 ? (
                  <span className="text-xs text-muted-foreground">Muallif</span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  label: string;
  value: number | string;
  hint: string;
  tone: StatTone;
}) {
  const t = TONE[tone];
  return (
    <div className="group rounded-3xl bg-background border border-border/60 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "w-11 h-11 rounded-2xl flex items-center justify-center ring-4 transition-transform group-hover:scale-105",
            t.bg,
            t.ring,
          )}
        >
          <Icon className={cn("h-[19px] w-[19px]", t.text)} strokeWidth={2.2} />
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
      </div>
      <p className="text-[32px] font-semibold tracking-tight leading-none tabular-nums">{value}</p>
      <p className="text-[13.5px] font-medium mt-2">{label}</p>
      <p className="text-[11.5px] text-muted-foreground mt-0.5">{hint}</p>
    </div>
  );
}

function QuickLink({
  to,
  icon: Icon,
  label,
  tone,
}: {
  to: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  label: string;
  tone: StatTone;
}) {
  const t = TONE[tone];
  return (
    <Link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      to={to as any}
      className="group flex items-center gap-3 px-2 py-2 rounded-2xl hover:bg-background transition-colors"
    >
      <div
        className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105",
          t.bg,
        )}
      >
        <Icon className={cn("h-[17px] w-[17px]", t.text)} strokeWidth={2.2} />
      </div>
      <span className="flex-1 text-[14px] font-medium">{label}</span>
      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}
