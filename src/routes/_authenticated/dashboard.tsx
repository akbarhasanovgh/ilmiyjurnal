import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { FilePlus2, FileText, ArrowRight } from "lucide-react";
import { AuthorShell } from "@/components/author-shell";
import { WorkflowBadge } from "@/components/workflow-badge";
import { getSessionContext } from "@/lib/auth.functions";
import { listMySubmissions } from "@/lib/submissions.functions";
import { ARCHIVE_VOLUMES } from "@/lib/archive-preview";
import type { WorkflowState } from "@/lib/workflow";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Bosh sahifa — Tahririyat" }, { name: "robots", content: "noindex" }] }),
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

  const publishedIssues = ARCHIVE_VOLUMES
    .flatMap((v) => v.issues.map((i) => ({ ...i, volume: v.volume, year: v.year })))
    .slice(0, 3);

  return (
    <AuthorShell>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-10">
        {/* Hero */}
        <div className="rounded-3xl bg-[color:var(--surface-sunken)] p-8 md:p-12 mb-8">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[color:var(--accent-oxblood)] text-page text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            Bosh sahifa
          </span>
          <h1
            className="font-semibold leading-tight tracking-tight text-ink"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
          >
            Xush kelibsiz{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="mt-4 text-[15px] text-ink-soft leading-relaxed max-w-[58ch]">
            Bu yerdan yangi maqola topshirasiz, topshirilgan ishlaringiz
            holatini kuzatasiz va jurnalning oxirgi nashrlarini o‘qiysiz.
          </p>
        </div>

        {/* Primary actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <ActionTile
            to="/submissions/new"
            icon={FilePlus2}
            title="Yangi maqola topshirish"
            note="Yetti bosqichli topshirish shakli"
            primary
          />
          <ActionTile
            to="/submissions"
            icon={FileText}
            title="Mening maqolalarim"
            note={`${subsQ.data?.length ?? 0} ta ish`}
          />
        </div>

        {/* Recent */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-ink">
              So‘nggi maqolalaringiz
            </h2>
            {(subsQ.data?.length ?? 0) > 5 && (
              <Link to="/submissions" className="text-[11px] uppercase tracking-[0.2em] font-semibold text-ink-muted hover:text-[color:var(--accent-oxblood)] transition-colors">
                Barchasi →
              </Link>
            )}
          </div>

          {subsQ.isPending ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 rounded-3xl bg-[color:var(--surface-sunken)] animate-pulse" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="rounded-3xl bg-[color:var(--page-elevated)] border border-rule p-10 text-center">
              <p className="text-lg font-semibold text-ink">Hali maqola topshirmadingiz</p>
              <p className="text-[13.5px] text-ink-muted mt-2 mb-5">
                Birinchi maqolangizni topshirish uchun shaklni to‘ldiring.
              </p>
              <Link
                to="/submissions/new"
                className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--accent-oxblood)] text-page px-5 py-2.5 text-[13px] font-semibold hover:opacity-90 transition-opacity"
              >
                Boshlash <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="rounded-3xl bg-[color:var(--page-elevated)] border border-rule divide-y divide-[color:var(--rule)] overflow-hidden shadow-[0_1px_0_rgba(23,20,18,0.03)]">
              {recent.map((s) => (
                <Link
                  key={s.id}
                  to="/submissions/$id"
                  params={{ id: s.id }}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-[color:var(--surface-sunken)] transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-medium text-ink truncate">
                      {s.title || <span className="italic text-ink-faint">Sarlavhasiz qoralama</span>}
                    </p>
                    <p className="text-[11.5px] font-mono tracking-wider text-ink-faint mt-1">
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
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-ink">
              Jurnalni o‘qing
            </h2>
            <Link to="/kutubxona" className="text-[11px] uppercase tracking-[0.2em] font-semibold text-ink-muted hover:text-[color:var(--accent-oxblood)] transition-colors">
              Arxivga o‘tish →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {publishedIssues.map((iss) => (
              <Link
                key={`${iss.volume}-${iss.number}`}
                to="/arxiv/$jild/$son"
                params={{ jild: String(iss.volume), son: String(iss.number) }}
                className="rounded-3xl bg-[color:var(--page-elevated)] border border-rule p-5 hover:border-[color:var(--accent-oxblood)] transition-colors"
              >
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-faint mb-2">
                  {iss.month} {iss.year}
                </p>
                <p className="text-[17px] font-semibold text-ink leading-snug">
                  {iss.volume}-jild · {iss.number}-son
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AuthorShell>
  );
}

function ActionTile({
  to, icon: Icon, title, note, primary,
}: {
  to: string;
  icon: typeof FilePlus2;
  title: string;
  note: string;
  primary?: boolean;
}) {
  const base =
    "group relative rounded-3xl p-7 flex flex-col justify-between min-h-[168px] transition-all active:scale-[0.99]";
  const primaryCls =
    "bg-[color:var(--accent-oxblood)] text-page hover:opacity-95";
  const secondaryCls =
    "bg-[color:var(--page-elevated)] border border-rule text-ink hover:border-[color:var(--accent-oxblood)] shadow-[0_1px_0_rgba(23,20,18,0.03)]";

  return (
    <Link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      to={to as any}
      className={`${base} ${primary ? primaryCls : secondaryCls}`}
    >
      <div
        className={
          primary
            ? "w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center"
            : "w-11 h-11 rounded-2xl bg-[color:var(--surface-sunken)] flex items-center justify-center"
        }
      >
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-[22px] font-semibold leading-tight tracking-tight">{title}</p>
        <p className={`text-[13px] mt-1.5 flex items-center gap-1 ${primary ? "opacity-80" : "text-ink-muted"}`}>
          {note}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </p>
      </div>
    </Link>
  );
}
