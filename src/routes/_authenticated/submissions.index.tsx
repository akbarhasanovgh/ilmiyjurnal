import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { EditorialShell } from "@/components/editorial-shell";
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
    <EditorialShell>
      <div className="p-8 md:p-12 max-w-5xl">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <p className="label-mono">Mening maqolalarim</p>
            <h1 className="font-serif text-4xl leading-tight mt-2">Topshirilgan ishlar</h1>
          </div>
          <button
            onClick={() => m.mutate()}
            disabled={m.isPending}
            className="btn-primary hover:bg-ink-soft disabled:opacity-50"
          >
            {m.isPending ? "..." : "Yangi maqola"}
          </button>
        </div>

        {q.isPending ? (
          <SkeletonList />
        ) : q.error ? (
          <ErrorBlock message={(q.error as Error).message} />
        ) : (q.data ?? []).length === 0 ? (
          <EmptyState onCreate={() => m.mutate()} loading={m.isPending} />
        ) : (
          <div className="divide-y divide-rule border-y border-rule">
            {q.data!.map((s) => (
              <Link
                key={s.id}
                to="/submissions/$id"
                params={{ id: s.id }}
                className="grid grid-cols-12 gap-4 py-5 group hover:bg-surface-sunken transition-colors -mx-4 px-4"
              >
                <div className="col-span-2 label-mono self-center">{s.manuscript_id}</div>
                <div className="col-span-6">
                  <p className="text-base font-medium group-hover:text-ink leading-snug">
                    {s.title || <span className="italic text-ink-faint">Sarlavhasiz qoralama</span>}
                  </p>
                  <p className="text-xs text-ink-muted mt-1">
                    {new Date(s.updated_at).toLocaleString("uz-UZ")}
                  </p>
                </div>
                <div className="col-span-4 self-center flex justify-end">
                  <WorkflowBadge state={s.workflow_state as WorkflowState} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </EditorialShell>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-16 bg-surface-sunken animate-pulse" />
      ))}
    </div>
  );
}

function EmptyState({ onCreate, loading }: { onCreate: () => void; loading: boolean }) {
  return (
    <div className="border border-rule p-12 text-center space-y-4">
      <p className="label-mono">Bo‘sh</p>
      <p className="font-serif text-2xl">Hali maqola topshirmadingiz</p>
      <p className="text-sm text-ink-muted max-w-md mx-auto">
        Birinchi maqolangizni topshirish uchun besh bosqichli shaklni to‘ldiring.
      </p>
      <button onClick={onCreate} disabled={loading} className="btn-primary hover:bg-ink-soft disabled:opacity-50 mt-2">
        {loading ? "..." : "Yangi maqola boshlash"}
      </button>
    </div>
  );
}

function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="border border-destructive/30 bg-destructive/5 p-6">
      <p className="label-mono text-destructive">Xatolik</p>
      <p className="text-sm mt-2">{message}</p>
    </div>
  );
}
