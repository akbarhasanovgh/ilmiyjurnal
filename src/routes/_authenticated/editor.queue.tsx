import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { EditorialShell } from "@/components/editorial-shell";
import { WorkflowBadge } from "@/components/workflow-badge";
import { editorListMyQueue } from "@/lib/admin.functions";
import type { WorkflowState } from "@/lib/workflow";

export const Route = createFileRoute("/_authenticated/editor/queue")({
  head: () => ({ meta: [{ title: "Menga tayinlangan" }, { name: "robots", content: "noindex" }] }),
  component: EditorQueue,
});

function EditorQueue() {
  const list = useServerFn(editorListMyQueue);
  const q = useQuery({ queryKey: ["editor-queue"], queryFn: () => list() });

  return (
    <EditorialShell>
      <div className="p-8 md:p-12 max-w-6xl">
        <div className="mb-10">
          <p className="label-mono">Menga tayinlangan</p>
          <h1 className="font-serif text-4xl leading-tight mt-2">Muharrirlik vazifalari</h1>
        </div>

        {q.isPending ? (
          <div className="space-y-2">{[0,1,2].map(i => <div key={i} className="h-16 bg-surface-sunken animate-pulse" />)}</div>
        ) : q.error ? (
          <p className="text-sm text-destructive">{(q.error as Error).message}</p>
        ) : (q.data ?? []).length === 0 ? (
          <div className="border border-rule p-12 text-center">
            <p className="label-mono">Bo‘sh</p>
            <p className="font-serif text-2xl mt-3">Hozircha topshiriq yo‘q</p>
          </div>
        ) : (
          <div className="divide-y divide-rule border-y border-rule">
            {q.data!.map((a) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const s: any = a.submissions;
              return (
                <Link
                  key={a.id}
                  to="/submissions/$id"
                  params={{ id: s.id }}
                  className="grid grid-cols-12 gap-4 py-5 hover:bg-surface-sunken transition-colors -mx-4 px-4 group"
                >
                  <div className="col-span-2 label-mono self-center">{s.manuscript_id}</div>
                  <div className="col-span-6">
                    <p className="text-base font-medium leading-snug group-hover:text-ink">
                      {s.title || <span className="italic text-ink-faint">Sarlavhasiz</span>}
                    </p>
                    <p className="text-xs text-ink-muted mt-1">
                      Tayinlangan: {new Date(a.assigned_at).toLocaleDateString("uz-UZ")}
                      {a.deadline ? ` · Muddat: ${a.deadline}` : ""}
                    </p>
                  </div>
                  <div className="col-span-2 label-mono self-center">{s.article_type}</div>
                  <div className="col-span-2 self-center flex justify-end">
                    <WorkflowBadge state={s.workflow_state as WorkflowState} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </EditorialShell>
  );
}
