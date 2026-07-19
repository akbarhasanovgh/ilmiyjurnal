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
            icon={Inbox}
            label="Yangi topshirilgan"
            value={inbox.isPending && canInbox ? "…" : submitted}
            hint="Ko‘rib chiqishni kutmoqda"
          />
          <StatTile
            icon={ClipboardList}
            label="Taqrizda"
            value={inbox.isPending && canInbox ? "…" : underReview}
            hint="Faol taqrizchilarda"
          />
          <StatTile
            icon={Sparkles}
            label="Faol jarayonda"
            value={inbox.isPending && canInbox ? "…" : inboxRows.length}
            hint="Jami tahririyatda"
          />
          <StatTile
            icon={Users}
            label="Xodimlar"
            value={users.isPending && canUsers ? "…" : staff}
            hint="Tahririyat jamoasi"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Recent submissions */}
          <div className="lg:col-span-2 rounded-3xl bg-[color:var(--page)] border border-rule p-3">
            <div className="flex items-center justify-between px-3 pt-2 pb-3">
              <div>
                <h3 className="text-[15px] font-serif tracking-tight text-ink">So‘nggi maqolalar</h3>
                <p className="text-xs text-ink-muted mt-0.5">Eng yangi yuborilgan ishlar</p>
              </div>
              {canInbox ? (
                <Link
                  to="/admin/inbox"
                  className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-accent-oxblood rounded-full px-3 py-1.5 hover:bg-accent-oxblood-soft transition-colors"
                >
                  Barchasi
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              ) : null}
            </div>
            <div className="rounded-2xl bg-page-elevated border border-rule overflow-hidden">
              {!canInbox ? (
                <p className="p-6 text-sm text-ink-muted">
                  Sizda tahririyat qutisini ko‘rish uchun ruxsat yo‘q.
                </p>
              ) : inbox.isPending ? (
                <div className="py-14 flex justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-ink-muted" />
                </div>
              ) : recent.length === 0 ? (
                <p className="p-6 text-sm text-ink-muted">Hozircha maqola yo‘q.</p>
              ) : (
                <div className="divide-y divide-[color:var(--rule)]">
                  {recent.map((s) => (
                    <Link
                      key={s.id}
                      to="/submissions/$id"
                      params={{ id: s.id }}
                      className="group flex items-center gap-3 px-4 py-3 hover:bg-[color:var(--page)] transition-colors"
                    >
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="text-[11px] font-medium bg-accent-oxblood-soft text-accent-oxblood">
                          {(s.owner?.full_name || s.owner?.email || "?").trim().charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium truncate text-ink">
                          {s.title || (
                            <span className="italic text-ink-muted">Sarlavhasiz</span>
                          )}
                        </p>
                        <p className="text-[12px] text-ink-muted truncate">
                          <span className="font-mono">{s.manuscript_id}</span>
                          {" · "}
                          {s.owner?.full_name || s.owner?.email || "—"}
                        </p>
                      </div>
                      <WorkflowBadge state={s.workflow_state as WorkflowState} />
                      <ArrowUpRight className="h-3.5 w-3.5 text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-3xl bg-[color:var(--page)] border border-rule p-3">
            <div className="px-3 pt-2 pb-3">
              <h3 className="text-[15px] font-serif tracking-tight text-ink">Tez amallar</h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Eng ko‘p ishlatiladigan bo‘limlar
              </p>
            </div>
            <div className="space-y-1.5">
              {canInbox ? (
                <QuickLink to="/admin/inbox" icon={Inbox} label="Tahririyat qutisi" />
              ) : null}
              {canUsers ? (
                <QuickLink to="/admin/users" icon={Users} label="Foydalanuvchilar" />
              ) : null}
              <QuickLink
                to="/editor/queue"
                icon={ClipboardList}
                label="Menga tayinlangan"
              />
              {perms.has("audit.view") ? (
                <QuickLink to="/audit" icon={History} label="Audit jurnali" />
              ) : null}
            </div>

            <div className="mt-4 mx-1 p-3 rounded-2xl bg-page-elevated border border-rule">
              <p className="text-[11px] font-semibold tracking-[0.06em] uppercase text-ink-faint mb-2">
                Rollaringiz
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(ctxQ.data?.roles ?? []).map((r) => (
                  <Badge
                    key={r.key}
                    variant="secondary"
                    className={cn(
                      "rounded-full font-normal text-[11.5px] bg-accent-oxblood-soft text-accent-oxblood border-0",
                    )}
                  >
                    {r.name}
                  </Badge>
                ))}
                {(ctxQ.data?.roles ?? []).length === 0 ? (
                  <span className="text-xs text-ink-muted">Muallif</span>
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
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  label: string;
  value: number | string;
  hint: string;
}) {
  return (
    <div className="group rounded-3xl bg-page-elevated border border-rule p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-accent-oxblood-soft transition-transform group-hover:scale-105">
          <Icon className="h-[19px] w-[19px] text-accent-oxblood" strokeWidth={2.2} />
        </div>
        <ArrowUpRight className="h-4 w-4 text-ink-faint group-hover:text-accent-oxblood transition-colors" />
      </div>
      <p className="text-[32px] font-serif tracking-tight leading-none tabular-nums text-ink">{value}</p>
      <p className="text-[13.5px] font-medium mt-2 text-ink">{label}</p>
      <p className="text-[11.5px] text-ink-muted mt-0.5">{hint}</p>
    </div>
  );
}

function QuickLink({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  label: string;
}) {
  return (
    <Link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      to={to as any}
      className="group flex items-center gap-3 px-2 py-2 rounded-2xl hover:bg-page-elevated transition-colors"
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-page-elevated border border-rule group-hover:bg-accent-oxblood-soft group-hover:border-transparent transition-all group-hover:scale-105">
        <Icon className="h-[17px] w-[17px] text-ink-soft group-hover:text-accent-oxblood" strokeWidth={2.2} />
      </div>
      <span className="flex-1 text-[14px] font-medium text-ink">{label}</span>
      <ArrowUpRight className="h-3.5 w-3.5 text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}
