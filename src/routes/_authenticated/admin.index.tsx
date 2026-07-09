import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { format } from "date-fns";
import { Inbox, Users, ClipboardList, History, ArrowRight, Loader2 } from "lucide-react";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkflowBadge } from "@/components/workflow-badge";
import { adminListInbox, adminListUsers } from "@/lib/admin.functions";
import { getSessionContext } from "@/lib/auth.functions";
import type { WorkflowState } from "@/lib/workflow";

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

  // Not admin at all → send back home
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

  return (
    <AdminLayout
      title={`Xush kelibsiz${ctxQ.data?.profile?.full_name ? `, ${ctxQ.data.profile.full_name}` : ""}`}
      description="Tahririyat tizimining umumiy holati va so‘nggi harakatlar."
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Inbox}
            label="Yangi topshirilgan"
            value={inbox.isPending && canInbox ? "…" : submitted}
          />
          <StatCard
            icon={ClipboardList}
            label="Taqrizda"
            value={inbox.isPending && canInbox ? "…" : underReview}
          />
          <StatCard
            icon={Inbox}
            label="Faol jarayonda"
            value={inbox.isPending && canInbox ? "…" : inboxRows.length}
          />
          <StatCard
            icon={Users}
            label="Xodimlar"
            value={users.isPending && canUsers ? "…" : staff}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent submissions */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-semibold">So‘nggi maqolalar</CardTitle>
              {canInbox ? (
                <Button asChild variant="ghost" size="sm">
                  <Link to="/admin/inbox">
                    Barchasi <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              ) : null}
            </CardHeader>
            <CardContent className="p-0">
              {!canInbox ? (
                <p className="px-6 pb-6 text-sm text-muted-foreground">
                  Sizda tahririyat qutisini ko‘rish uchun ruxsat yo‘q.
                </p>
              ) : inbox.isPending ? (
                <div className="py-10 flex justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : recent.length === 0 ? (
                <p className="px-6 pb-6 text-sm text-muted-foreground">Hozircha maqola yo‘q.</p>
              ) : (
                <div className="divide-y">
                  {recent.map((s) => (
                    <Link
                      key={s.id}
                      to="/submissions/$id"
                      params={{ id: s.id }}
                      className="flex items-center gap-4 px-6 py-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="font-mono text-xs text-muted-foreground w-24 shrink-0">
                        {s.manuscript_id}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {s.title || (
                            <span className="italic text-muted-foreground">Sarlavhasiz</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {s.owner?.full_name || s.owner?.email || "—"}
                          {s.submitted_at
                            ? ` · ${format(new Date(s.submitted_at), "dd MMM yyyy")}`
                            : ""}
                        </p>
                      </div>
                      <WorkflowBadge state={s.workflow_state as WorkflowState} />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Tez amallar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {canInbox ? (
                <QuickLink to="/admin/inbox" icon={Inbox} label="Tahririyat qutisi" />
              ) : null}
              {canUsers ? (
                <QuickLink to="/admin/users" icon={Users} label="Foydalanuvchilar" />
              ) : null}
              <QuickLink to="/editor/queue" icon={ClipboardList} label="Menga tayinlangan" />
              {perms.has("audit.view") ? (
                <QuickLink to="/audit" icon={History} label="Audit jurnali" />
              ) : null}

              <div className="pt-3 mt-3 border-t">
                <p className="text-xs text-muted-foreground mb-2">Rollaringiz</p>
                <div className="flex flex-wrap gap-1.5">
                  {(ctxQ.data?.roles ?? []).map((r) => (
                    <Badge key={r.key} variant="secondary" className="font-normal">
                      {r.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  label: string;
  value: number | string;
}) {
  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-bold leading-tight">{value}</p>
            <p className="text-xs text-muted-foreground truncate">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
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
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors group"
    >
      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
      <span className="flex-1">{label}</span>
      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}
