import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { FilePlus2, ChevronDown, Pencil, Trash2, Send, Eye } from "lucide-react";
import { AuthorShell } from "@/components/author-shell";
import { WorkflowBadge } from "@/components/workflow-badge";
import {
  listMySubmissions,
  createDraftSubmission,
  deleteDraftSubmission,
} from "@/lib/submissions.functions";
import type { WorkflowState } from "@/lib/workflow";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/submissions/")({
  head: () => ({ meta: [{ title: "Mening maqolalarim" }, { name: "robots", content: "noindex" }] }),
  component: MySubmissions,
});

type Row = {
  id: string;
  title: string | null;
  manuscript_id: string;
  workflow_state: string;
  updated_at: string;
};

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

  const [openId, setOpenId] = useState<string | null>(null);

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
              Birinchi maqolangizni topshirish uchun shaklni to‘ldiring.
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
            {(q.data as Row[]).map((s) => (
              <SubmissionRow
                key={s.id}
                row={s}
                open={openId === s.id}
                onToggle={() => setOpenId((cur) => (cur === s.id ? null : s.id))}
              />
            ))}
          </div>
        )}
      </div>
    </AuthorShell>
  );
}

function SubmissionRow({
  row,
  open,
  onToggle,
}: {
  row: Row;
  open: boolean;
  onToggle: () => void;
}) {
  const qc = useQueryClient();
  const del = useServerFn(deleteDraftSubmission);
  const state = row.workflow_state as WorkflowState;
  const isDraft = state === "draft";
  const canRevise = state === "revision_requested";
  const isReviewed =
    state === "revision_requested" ||
    state === "accepted" ||
    state === "rejected" ||
    state === "under_review";

  const dm = useMutation({
    mutationFn: () => del({ data: { id: row.id } }),
    onSuccess: () => {
      toast.success("Qoralama o‘chirildi");
      qc.invalidateQueries({ queryKey: ["my-submissions"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [confirming, setConfirming] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-5 px-5 py-5 hover:bg-muted/40 transition-colors text-left"
      >
        <div className="w-24 shrink-0 text-[11.5px] font-mono tracking-wide text-muted-foreground">
          {row.manuscript_id}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15.5px] font-medium text-foreground leading-snug truncate">
            {row.title || <span className="italic text-muted-foreground">Sarlavhasiz qoralama</span>}
          </p>
          <p className="text-[11.5px] text-muted-foreground mt-1">
            {new Date(row.updated_at).toLocaleString("uz-UZ")}
          </p>
        </div>
        <WorkflowBadge state={state} />
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={1.8}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 bg-muted/20 border-t border-border/60">
          <div className="flex flex-wrap gap-2">
            {(isDraft || canRevise) && (
              <Link
                to="/submissions/$id/edit"
                params={{ id: row.id }}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-[13px] font-medium hover:bg-muted/60 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" strokeWidth={1.8} />
                Tahrirlash
              </Link>
            )}
            {isDraft && (
              <Link
                to="/submissions/$id/edit"
                params={{ id: row.id }}
                className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 text-[13px] font-medium hover:opacity-90 transition-opacity"
              >
                <Send className="h-3.5 w-3.5" strokeWidth={1.8} />
                Topshirish
              </Link>
            )}
            {isReviewed && (
              <Link
                to="/submissions/$id"
                params={{ id: row.id }}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-[13px] font-medium hover:bg-muted/60 transition-colors"
              >
                <Eye className="h-3.5 w-3.5" strokeWidth={1.8} />
                Ko‘rib chiqilganini ko‘rish
              </Link>
            )}
            {isDraft && (
              <>
                {!confirming ? (
                  <button
                    type="button"
                    onClick={() => setConfirming(true)}
                    className="inline-flex items-center gap-2 rounded-full border border-destructive/40 text-destructive px-4 py-2 text-[13px] font-medium hover:bg-destructive/5 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                    O‘chirish
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-2">
                    <span className="text-[13px] text-muted-foreground">Ishonchingiz komilmi?</span>
                    <button
                      type="button"
                      disabled={dm.isPending}
                      onClick={() => dm.mutate()}
                      className="rounded-full bg-destructive text-destructive-foreground px-3 py-1.5 text-[12.5px] font-medium hover:opacity-90 disabled:opacity-50"
                    >
                      {dm.isPending ? "..." : "Ha, o‘chir"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirming(false)}
                      className="rounded-full border border-border px-3 py-1.5 text-[12.5px] font-medium hover:bg-muted/60"
                    >
                      Bekor
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
