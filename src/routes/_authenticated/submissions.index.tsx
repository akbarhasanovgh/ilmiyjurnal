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
  const rows = (q.data ?? []) as Row[];

  return (
    <AuthorShell>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-10">
        {/* Hero */}
        <div className="rounded-3xl bg-[color:var(--surface-sunken)] p-8 md:p-10 mb-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[color:var(--accent-oxblood)] text-page text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                Mening maqolalarim
              </span>
              <h1
                className="font-semibold leading-tight tracking-tight text-ink"
                style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)" }}
              >
                Topshirilgan ishlar
              </h1>
              <p className="mt-3 text-[14px] text-ink-soft max-w-[52ch]">
                Har bir ish holati va bosqichini shu yerdan kuzating.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-faint">Jami</p>
                <p className="text-3xl font-semibold text-ink mt-1 tabular-nums">{rows.length}</p>
              </div>
              <button
                onClick={() => m.mutate()}
                disabled={m.isPending}
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent-oxblood)] text-page px-5 py-2.5 text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <FilePlus2 className="h-4 w-4" strokeWidth={1.8} />
                {m.isPending ? "..." : "Yangi maqola"}
              </button>
            </div>
          </div>
        </div>

        {q.isPending ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 rounded-3xl bg-[color:var(--surface-sunken)] animate-pulse" />
            ))}
          </div>
        ) : q.error ? (
          <div className="rounded-3xl border border-[color:var(--accent-oxblood)]/30 bg-[color:var(--accent-oxblood)]/5 p-6">
            <p className="text-[13px] font-semibold text-[color:var(--accent-oxblood)]">Xatolik</p>
            <p className="text-sm mt-2 text-ink">{(q.error as Error).message}</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-3xl bg-[color:var(--page-elevated)] border border-rule p-12 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-ink-faint">Bo‘sh</p>
            <p className="text-2xl font-semibold mt-3 text-ink">Hali maqola topshirmadingiz</p>
            <p className="text-[14px] text-ink-muted mt-2 max-w-md mx-auto leading-relaxed">
              Birinchi maqolangizni topshirish uchun shaklni to‘ldiring.
            </p>
            <button
              onClick={() => m.mutate()}
              disabled={m.isPending}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[color:var(--accent-oxblood)] text-page px-5 py-2.5 text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <FilePlus2 className="h-4 w-4" strokeWidth={1.8} />
              {m.isPending ? "..." : "Yangi maqola boshlash"}
            </button>
          </div>
        ) : (
          <div className="rounded-3xl bg-[color:var(--page-elevated)] border border-rule divide-y divide-[color:var(--rule)] overflow-hidden shadow-[0_1px_0_rgba(23,20,18,0.03)]">
            {rows.map((s) => (
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
  row, open, onToggle,
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
        className="w-full flex items-center gap-5 px-6 py-5 hover:bg-[color:var(--surface-sunken)] transition-colors text-left"
      >
        <div className="w-28 shrink-0 text-[11.5px] font-mono tracking-wider text-ink-faint">
          {row.manuscript_id}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15.5px] font-medium text-ink leading-snug truncate">
            {row.title || <span className="italic text-ink-faint">Sarlavhasiz qoralama</span>}
          </p>
          <p className="text-[11.5px] text-ink-muted mt-1">
            {new Date(row.updated_at).toLocaleString("uz-UZ")}
          </p>
        </div>
        <WorkflowBadge state={state} />
        <ChevronDown
          className={`h-4 w-4 text-ink-muted transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={1.8}
        />
      </button>

      {open && (
        <div className="px-6 pb-5 pt-1 bg-[color:var(--surface-sunken)]">
          <div className="flex flex-wrap gap-2">
            {(isDraft || canRevise) && (
              <Link
                to="/submissions/$id/edit"
                params={{ id: row.id }}
                className="inline-flex items-center gap-2 rounded-full border border-rule-strong bg-[color:var(--page-elevated)] px-4 py-2 text-[13px] font-semibold text-ink hover:border-[color:var(--accent-oxblood)] transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" strokeWidth={1.8} />
                Tahrirlash
              </Link>
            )}
            {isDraft && (
              <Link
                to="/submissions/$id/edit"
                params={{ id: row.id }}
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent-oxblood)] text-page px-4 py-2 text-[13px] font-semibold hover:opacity-90 transition-opacity"
              >
                <Send className="h-3.5 w-3.5" strokeWidth={1.8} />
                Topshirish
              </Link>
            )}
            {isReviewed && (
              <Link
                to="/submissions/$id"
                params={{ id: row.id }}
                className="inline-flex items-center gap-2 rounded-full border border-rule-strong bg-[color:var(--page-elevated)] px-4 py-2 text-[13px] font-semibold text-ink hover:border-[color:var(--accent-oxblood)] transition-colors"
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
                    className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent-oxblood)]/40 text-[color:var(--accent-oxblood)] px-4 py-2 text-[13px] font-semibold hover:bg-[color:var(--accent-oxblood)]/5 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                    O‘chirish
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-2">
                    <span className="text-[13px] text-ink-muted">Ishonchingiz komilmi?</span>
                    <button
                      type="button"
                      disabled={dm.isPending}
                      onClick={() => dm.mutate()}
                      className="rounded-full bg-[color:var(--accent-oxblood)] text-page px-3 py-1.5 text-[12.5px] font-semibold hover:opacity-90 disabled:opacity-50"
                    >
                      {dm.isPending ? "..." : "Ha, o‘chir"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirming(false)}
                      className="rounded-full border border-rule-strong bg-[color:var(--page-elevated)] px-3 py-1.5 text-[12.5px] font-semibold text-ink hover:border-[color:var(--accent-oxblood)]"
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
