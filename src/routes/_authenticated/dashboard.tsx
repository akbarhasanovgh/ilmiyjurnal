import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { FilePlus2, FileText, BookMarked, ArrowRight } from "lucide-react";
import { AuthorShell } from "@/components/author-shell";
import { WorkflowBadge } from "@/components/workflow-badge";
import { getSessionContext } from "@/lib/auth.functions";
import { listMySubmissions } from "@/lib/submissions.functions";
import { ARCHIVE_VOLUMES } from "@/lib/archive-preview";
import type { WorkflowState } from "@/lib/workflow";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Bosh panel — Tahririyat" }, { name: "robots", content: "noindex" }] }),
  component: Dashboard,
});

function Dashboard() {
  const getCtx = useServerFn(getSessionContext);
  const listSubs = useServerFn(listMySubmissions);
  const { data: ctx, isPending } = useQuery({ queryKey: ["session-context"], queryFn: () => getCtx() });
  const subsQ = useQuery({ queryKey: ["my-submissions"], queryFn: () => listSubs() });

  const perms = new Set(ctx?.permissions ?? []);
  const isAdmin =
    perms.has("submissions.view_all") ||
    perms.has("users.view") ||
    perms.has("audit.view") ||
    perms.has("roles.manage");

  if (!isPending && isAdmin) return <Navigate to="/admin" replace />;

  const firstName = ctx?.profile?.full_name?.split(" ")[0] ?? "";
  const recent = (subsQ.data ?? []).slice(0, 5);

  // latest 3 published issues for the "explore" strip
  const publishedIssues = ARCHIVE_VOLUMES
    .flatMap((v) => v.issues.map((i) => ({ ...i, volume: v.volume, year: v.year })))
    .slice(0, 3);

  return (
    <AuthorShell>
      <div className="px-10 md:px-14 py-12 max-w-5xl">
        <div className="mb-12">
          <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-muted-foreground">
            Bosh sahifa
          </p>
          <h1 className="font-serif text-[40px] leading-[1.1] tracking-tight mt-3 text-foreground">
            Xush kelibsiz{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="text-[15px] text-muted-foreground mt-4 max-w-xl leading-relaxed">
            Bu yerdan yangi maqola topshirasiz, topshirilgan ishlaringiz holatini
            kuzatasiz va jurnalning oxirgi nashrlarini o‘qiysiz.
          </p>
        </div>

        {/* Primary actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
          <ActionTile
            to="/submissions/new"
            icon={FilePlus2}
            title="Yangi maqola topshirish"
            note="Besh bosqichli topshirish shakli"
            primary
          />
          <ActionTile
            to="/submissions"
            icon={FileText}
            title="Mening maqolalarim"
            note={`${subsQ.data?.length ?? 0} ta ish`}
          />
        </div>

        {/* Recent submissions */}
        <section className="mb-14">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="font-serif text-[22px] tracking-tight text-foreground">
              So‘nggi maqolalaringiz
            </h2>
            {(subsQ.data?.length ?? 0) > 5 && (
              <Link
                to="/submissions"
                className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Barchasi →
              </Link>
            )}
          </div>

          {subsQ.isPending ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 rounded-2xl bg-muted/50 animate-pulse" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/70 p-10 text-center">
              <p className="font-serif text-[18px] text-foreground">Hali maqola topshirmadingiz</p>
              <p className="text-[13.5px] text-muted-foreground mt-2 mb-5">
                Birinchi maqolangizni topshirish uchun shaklni to‘ldiring.
              </p>
              <Link
                to="/submissions/new"
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-5 py-2.5 text-[13.5px] font-medium hover:opacity-90 transition-opacity active:scale-[0.97]"
              >
                Boshlash <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="rounded-3xl border border-border/60 divide-y divide-border/60 overflow-hidden">
              {recent.map((s) => (
                <Link
                  key={s.id}
                  to="/submissions/$id"
                  params={{ id: s.id }}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium text-foreground truncate">
                      {s.title || <span className="italic text-muted-foreground">Sarlavhasiz qoralama</span>}
                    </p>
                    <p className="text-[11.5px] font-mono tracking-wide text-muted-foreground mt-1">
                      {s.manuscript_id} · {new Date(s.updated_at).toLocaleDateString("uz-UZ")}
                    </p>
                  </div>
                  <WorkflowBadge state={s.workflow_state as WorkflowState} />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Explore */}
        <section>
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="font-serif text-[22px] tracking-tight text-foreground">
              Jurnalni o‘qing
            </h2>
            <Link
              to="/arxiv"
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Arxivga o‘tish →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {publishedIssues.map((iss) => (
              <a
                key={`${iss.volume}-${iss.number}`}
                href={`/arxiv/${iss.volume}/${iss.number}`}
                className="rounded-2xl border border-border/60 p-5 hover:border-foreground/40 hover:shadow-sm transition-all group"
              >
                <BookMarked className="h-4 w-4 text-muted-foreground mb-3" strokeWidth={1.8} />
                <p className="font-serif text-[17px] leading-snug text-foreground">
                  {iss.volume}-jild, {iss.number}-son
                </p>
                <p className="text-[11.5px] font-mono tracking-wide text-muted-foreground mt-2">
                  {iss.year}
                </p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </AuthorShell>
  );
}

function ActionTile({
  to,
  icon: Icon,
  title,
  note,
  primary,
}: {
  to: string;
  icon: typeof FilePlus2;
  title: string;
  note: string;
  primary?: boolean;
}) {
  return (
    <Link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      to={to as any}
      className={
        primary
          ? "group relative rounded-3xl bg-foreground text-background p-7 flex flex-col justify-between min-h-[168px] hover:opacity-95 transition-all active:scale-[0.99] shadow-sm"
          : "group relative rounded-3xl bg-muted/40 border border-border/60 p-7 flex flex-col justify-between min-h-[168px] hover:bg-muted/60 hover:border-border transition-all active:scale-[0.99]"
      }
    >
      <div
        className={
          primary
            ? "w-11 h-11 rounded-2xl bg-background/15 flex items-center justify-center"
            : "w-11 h-11 rounded-2xl bg-background flex items-center justify-center border border-border/60"
        }
      >
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </div>
      <div>
        <p className="font-serif text-[22px] leading-tight tracking-tight">{title}</p>
        <p
          className={
            primary
              ? "text-[13px] mt-1.5 text-background/70 flex items-center gap-1"
              : "text-[13px] mt-1.5 text-muted-foreground flex items-center gap-1"
          }
        >
          {note}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </p>
      </div>
    </Link>
  );
}
