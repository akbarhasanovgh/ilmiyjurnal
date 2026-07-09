import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { FilePlus2 } from "lucide-react";
import { AuthorShell } from "@/components/author-shell";
import { WorkflowBadge } from "@/components/workflow-badge";
import { listMySubmissions, createDraftSubmission } from "@/lib/submissions.functions";
import type { WorkflowState } from "@/lib/workflow";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/submissions/")({
  head: () => ({ meta: [{ title: "Mening maqolalarim" }, { name: "robots", content: "noindex" }] }),
  component: MySubmissions,
});

function MySubmissions() {
  const list = useServerFn(listMySubmissions);
  const create = useServerFn(createDraftSubmission);
  const navigate = useNavigate();
  const q = useQuery({ queryKey: ["my-submissions"], queryFn: () => list() });
  const m = useMutation({
    mutationFn: () => create(),
    onSuccess: (row) => {
      navigate({ to: "/submissions/$id/edit", params: { id: row.id } });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AuthorShell>
      <div className="px-10 md:px-14 py-12 max-w-5xl">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-muted-foreground">
              Mening maqolalarim
            </p>
            <h1 className="font-serif text-[36px] leading-tight tracking-tight mt-3 text-foreground">
              Topshirilgan ishlar
            </h1>
          </div>
          <button
            onClick={() => m.mutate()}
            disabled={m.isPending}
            className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-[13.5px] font-medium hover:opacity-90 transition-opacity active:scale-[0.97] disabled:opacity-50"
          >
            <FilePlus2 className="h-4 w-4" strokeWidth={1.8} />
            {m.isPending ? "..." : "Yangi maqola"}
          </button>
        </div>

        {q.isPending ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-muted/50 animate-pulse" />
            ))}
          </div>
        ) : q.error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
            <p className="text-[13px] font-medium text-destructive">Xatolik</p>
            <p className="text-sm mt-2 text-foreground">{(q.error as Error).message}</p>
          </div>
        ) : (q.data ?? []).length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/70 p-12 text-center">
            <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-muted-foreground">
              Bo‘sh
            </p>
            <p className="font-serif text-[24px] mt-3 text-foreground">Hali maqola topshirmadingiz</p>
            <p className="text-[14px] text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
              Birinchi maqolangizni topshirish uchun besh bosqichli shaklni to‘ldiring.
            </p>
            <button
              onClick={() => m.mutate()}
              disabled={m.isPending}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-[13.5px] font-medium hover:opacity-90 transition-opacity active:scale-[0.97] disabled:opacity-50"
            >
              <FilePlus2 className="h-4 w-4" strokeWidth={1.8} />
              {m.isPending ? "..." : "Yangi maqola boshlash"}
            </button>
          </div>
        ) : (
          <div className="rounded-3xl border border-border/60 divide-y divide-border/60 overflow-hidden">
            {q.data!.map((s) => (
              <Link
                key={s.id}
                to="/submissions/$id"
                params={{ id: s.id }}
                className="flex items-center gap-5 px-5 py-5 hover:bg-muted/40 transition-colors group"
              >
                <div className="w-24 shrink-0 text-[11.5px] font-mono tracking-wide text-muted-foreground">
                  {s.manuscript_id}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15.5px] font-medium text-foreground leading-snug truncate group-hover:text-foreground">
                    {s.title || <span className="italic text-muted-foreground">Sarlavhasiz qoralama</span>}
                  </p>
                  <p className="text-[11.5px] text-muted-foreground mt-1">
                    {new Date(s.updated_at).toLocaleString("uz-UZ")}
                  </p>
                </div>
                <WorkflowBadge state={s.workflow_state as WorkflowState} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </AuthorShell>
  );
}
