import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { EditorialShell } from "@/components/editorial-shell";
import { WorkflowBadge } from "@/components/workflow-badge";
import {
  getSubmission,
  transitionSubmission,
  getFileDownloadUrl,
} from "@/lib/submissions.functions";
import {
  adminListEligibleEditors,
  adminAssignEditor,
} from "@/lib/admin.functions";
import { getSessionContext } from "@/lib/auth.functions";
import {
  STATE_LABEL_UZ,
  TRANSITIONS,
  type WorkflowState,
  type TransitionSpec,
} from "@/lib/workflow";

export const Route = createFileRoute("/_authenticated/submissions/$id/")({
  head: () => ({ meta: [{ title: "Maqola tafsilotlari" }, { name: "robots", content: "noindex" }] }),
  component: SubmissionDetail,
});

function SubmissionDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const getSub = useServerFn(getSubmission);
  const getCtx = useServerFn(getSessionContext);

  const ctxQ = useQuery({ queryKey: ["session-context"], queryFn: () => getCtx() });
  const q = useQuery({ queryKey: ["submission", id], queryFn: () => getSub({ data: { id } }) });

  const [tab, setTab] = useState<"meta" | "files" | "timeline">("meta");

  if (q.isPending) return <EditorialShell><div className="p-12"><div className="h-24 bg-surface-sunken animate-pulse" /></div></EditorialShell>;
  if (q.error) return <EditorialShell><ErrorBlock message={(q.error as Error).message} /></EditorialShell>;
  if (!q.data) return null;

  const { submission, authors, files, history, assignments } = q.data;
  const state = submission.workflow_state as WorkflowState;
  const perms = new Set(ctxQ.data?.permissions ?? []);
  const userId = ctxQ.data?.userId;
  const isOwner = submission.owner_id === userId;
  const activeAssignment = assignments.find((a: { unassigned_at: string | null }) => !a.unassigned_at);
  const isAssignedEditor = !!activeAssignment && activeAssignment.editor_id === userId;

  const availableTransitions: TransitionSpec[] = useMemo(() => {
    const list = TRANSITIONS[state] ?? [];
    return list.filter((t) => {
      if (t.requires === "OWNER") return isOwner;
      if (t.requires === "ASSIGNED_EDITOR") return isAssignedEditor || perms.has("submissions.view_all");
      return perms.has(t.requires);
    });
  }, [state, isOwner, isAssignedEditor, perms]);

  const refresh = () => qc.invalidateQueries({ queryKey: ["submission", id] });

  return (
    <EditorialShell>
      <header className="border-b border-rule">
        <div className="max-w-6xl px-8 md:px-12 py-6">
          <div className="flex items-center justify-between gap-6 mb-3">
            <p className="label-mono">{submission.manuscript_id}</p>
            <WorkflowBadge state={state} />
          </div>
          <h1 className="font-serif text-3xl leading-snug text-balance">
            {submission.title || <span className="italic text-ink-faint">Sarlavhasiz</span>}
          </h1>
          {isOwner && (state === "draft" || state === "revision_requested") && (
            <div className="mt-4">
              <Link
                to="/submissions/$id/edit"
                params={{ id }}
                className="btn-secondary hover:bg-surface-sunken"
              >
                Tahrirlashni davom ettirish
              </Link>
            </div>
          )}
        </div>
        <nav className="max-w-6xl px-8 md:px-12 flex gap-x-6 -mb-px">
          {(["meta", "files", "timeline"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-3 label-mono border-b-2 transition-colors ${
                tab === t ? "border-ink text-ink" : "border-transparent hover:text-ink-soft"
              }`}
            >
              {t === "meta" ? "Metama’lumot" : t === "files" ? `Fayllar (${files.length})` : "Xronologiya"}
            </button>
          ))}
        </nav>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] max-w-6xl w-full">
        <section className="px-8 md:px-12 py-10 space-y-10 min-w-0">
          {tab === "meta" && <MetaTab sub={submission} authors={authors} />}
          {tab === "files" && <FilesTab files={files} canDownload={isOwner || isAssignedEditor || perms.has("submissions.view_all")} />}
          {tab === "timeline" && <TimelineTab history={history} assignments={assignments} />}
        </section>

        <aside className="border-l border-rule px-6 py-10 space-y-8">
          <ActionsPanel
            submissionId={id}
            state={state}
            transitions={availableTransitions}
            onDone={refresh}
          />
          {perms.has("submissions.assign_editor") && (
            <AssignmentPanel
              submissionId={id}
              activeAssignment={activeAssignment}
              onDone={refresh}
            />
          )}
          <MetadataRail sub={submission} activeAssignment={activeAssignment} />
        </aside>
      </div>
    </EditorialShell>
  );
}

/* ------------------- TABS ------------------- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MetaTab({ sub, authors }: { sub: any; authors: any[] }) {
  return (
    <div className="space-y-8">
      {sub.abstract && (
        <div className="space-y-2">
          <p className="label-mono">Annotatsiya</p>
          <p className="font-serif text-base leading-relaxed text-ink max-w-[62ch] text-pretty">{sub.abstract}</p>
        </div>
      )}
      {sub.abstract_en && (
        <div className="space-y-2">
          <p className="label-mono">Abstract</p>
          <p className="font-serif italic text-base leading-relaxed text-ink-soft max-w-[62ch] text-pretty">{sub.abstract_en}</p>
        </div>
      )}
      {(sub.keywords?.length ?? 0) > 0 && (
        <div className="space-y-2">
          <p className="label-mono">Kalit so‘zlar</p>
          <div className="flex flex-wrap gap-2">
            {sub.keywords.map((k: string) => (
              <span key={k} className="text-xs border border-rule-strong px-2 py-0.5 rounded-sm">{k}</span>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-3">
        <p className="label-mono">Mualliflar</p>
        <table className="w-full text-sm border-t border-rule">
          <thead>
            <tr className="border-b border-rule text-left label-mono">
              <th className="py-2 font-medium">Ism-sharif</th>
              <th className="py-2 font-medium">Muassasa</th>
              <th className="py-2 font-medium">ORCID</th>
              <th className="py-2 font-medium text-right">Rol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {authors.map((a) => (
              <tr key={a.id}>
                <td className="py-3 font-medium">
                  {a.full_name}
                  {a.is_corresponding && <span className="ml-2 label-mono">Mas’ul</span>}
                </td>
                <td className="py-3 text-ink-muted">{a.institution ?? "—"}</td>
                <td className="py-3 font-mono text-xs">{a.orcid ?? "—"}</td>
                <td className="py-3 text-right text-ink-muted">{a.contributor_role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FilesTab({ files, canDownload }: { files: any[]; canDownload: boolean }) {
  const getUrl = useServerFn(getFileDownloadUrl);
  async function download(fileId: string) {
    try {
      const { url } = await getUrl({ data: { file_id: fileId } });
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Yuklashda xatolik");
    }
  }
  if (files.length === 0) {
    return <p className="text-sm text-ink-muted">Fayllar yuklanmagan.</p>;
  }
  return (
    <div className="divide-y divide-rule border-y border-rule">
      {files.map((f) => (
        <div key={f.id} className="grid grid-cols-12 gap-4 py-4 items-center">
          <div className="col-span-7">
            <p className="text-sm font-medium truncate">{f.filename}</p>
            <p className="label-mono mt-1">{f.kind}</p>
          </div>
          <div className="col-span-3 label-mono">{(f.size_bytes / 1024).toFixed(1)} KB</div>
          <div className="col-span-2 text-right">
            {canDownload && (
              <button onClick={() => download(f.id)} className="label-mono hover:text-ink">Yuklab olish →</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TimelineTab({ history, assignments }: { history: any[]; assignments: any[] }) {
  type Item = { at: string; kind: string; title: string; sub?: string };
  const items: Item[] = [
    ...history.map((h) => ({
      at: h.created_at,
      kind: "state",
      title: `${h.from_state ? STATE_LABEL_UZ[h.from_state as WorkflowState] + " → " : ""}${STATE_LABEL_UZ[h.to_state as WorkflowState]}`,
      sub: h.reason ?? undefined,
    })),
    ...assignments.map((a) => ({
      at: a.assigned_at,
      kind: "assign",
      title: "Muharrir tayinlandi",
      sub: a.deadline ? `Muddat: ${a.deadline}` : undefined,
    })),
  ].sort((a, b) => (a.at < b.at ? 1 : -1));
  if (items.length === 0) return <p className="text-sm text-ink-muted">Hodisalar ro‘yxati bo‘sh.</p>;
  return (
    <ol className="relative">
      <span className="absolute left-1 top-2 bottom-2 w-px bg-rule" aria-hidden />
      {items.map((it, i) => (
        <li key={i} className="relative pl-6 pb-6 last:pb-0">
          <span className="absolute left-0 top-1.5 size-2 rounded-full bg-ink-soft" aria-hidden />
          <p className="label-mono">{new Date(it.at).toLocaleString("uz-UZ")}</p>
          <p className="text-sm font-medium mt-1">{it.title}</p>
          {it.sub && <p className="text-xs text-ink-muted mt-1 italic">{it.sub}</p>}
        </li>
      ))}
    </ol>
  );
}

/* ---------------- ACTION PANELS ---------------- */
function ActionsPanel({
  submissionId,
  state,
  transitions,
  onDone,
}: {
  submissionId: string;
  state: WorkflowState;
  transitions: TransitionSpec[];
  onDone: () => void;
}) {
  const trans = useServerFn(transitionSubmission);
  const [pending, setPending] = useState<TransitionSpec | null>(null);
  const [reason, setReason] = useState("");
  const m = useMutation({
    mutationFn: (t: TransitionSpec) =>
      trans({ data: { id: submissionId, to_state: t.to, reason: reason || undefined } }),
    onSuccess: () => { toast.success("Holat o‘zgardi"); onDone(); setPending(null); setReason(""); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-3">
      <p className="label-mono">Amallar</p>
      {transitions.length === 0 ? (
        <p className="text-xs text-ink-muted">
          Bu holatda ({STATE_LABEL_UZ[state]}) sizga ruxsat etilgan amallar mavjud emas.
        </p>
      ) : (
        transitions.map((t) => (
          <button
            key={t.to}
            onClick={() => {
              if (t.reasonRequired) setPending(t);
              else m.mutate(t);
            }}
            disabled={m.isPending}
            className={
              t.tone === "primary"
                ? "w-full btn-primary hover:bg-ink-soft disabled:opacity-50"
                : t.tone === "destructive"
                ? "w-full rounded-sm border border-destructive/40 text-destructive py-2 text-sm font-medium hover:bg-destructive/5"
                : "w-full btn-secondary hover:bg-surface-sunken disabled:opacity-50"
            }
          >
            {t.label}
          </button>
        ))
      )}

      {pending && (
        <div className="mt-4 border border-rule-strong p-4 space-y-3 bg-page">
          <p className="label-mono">Sabab kiriting</p>
          <p className="text-sm">{pending.label}</p>
          <textarea
            className="textarea"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Muallifga bu qaror haqida qisqacha izoh..."
          />
          <div className="flex gap-2">
            <button
              onClick={() => m.mutate(pending)}
              disabled={m.isPending || reason.trim().length < 3}
              className="btn-primary hover:bg-ink-soft disabled:opacity-50"
            >
              {m.isPending ? "..." : "Tasdiqlash"}
            </button>
            <button onClick={() => { setPending(null); setReason(""); }} className="btn-secondary hover:bg-surface-sunken">
              Bekor qilish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AssignmentPanel({
  submissionId,
  activeAssignment,
  onDone,
}: {
  submissionId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activeAssignment: any;
  onDone: () => void;
}) {
  const listEditors = useServerFn(adminListEligibleEditors);
  const assign = useServerFn(adminAssignEditor);
  const q = useQuery({ queryKey: ["eligible-editors"], queryFn: () => listEditors() });
  const [editorId, setEditorId] = useState("");
  const [deadline, setDeadline] = useState("");
  const m = useMutation({
    mutationFn: () =>
      assign({ data: { submission_id: submissionId, editor_id: editorId, deadline: deadline || undefined } }),
    onSuccess: () => { toast.success("Muharrir tayinlandi"); onDone(); setEditorId(""); setDeadline(""); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-3 border-t border-rule pt-6">
      <p className="label-mono">Muharrir tayinlash</p>
      {activeAssignment && (
        <p className="text-xs text-ink-muted">
          Hozirda tayinlangan: <span className="font-medium text-ink">{activeAssignment.editor_id.slice(0, 8)}…</span>
        </p>
      )}
      <select className="input" value={editorId} onChange={(e) => setEditorId(e.target.value)}>
        <option value="">— Muharrirni tanlang —</option>
        {(q.data ?? []).map((e) => (
          <option key={e.user_id} value={e.user_id}>
            {e.full_name} · {e.roles.join(", ")}
          </option>
        ))}
      </select>
      <input type="date" className="input" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      <button
        onClick={() => m.mutate()}
        disabled={!editorId || m.isPending}
        className="w-full btn-primary hover:bg-ink-soft disabled:opacity-50"
      >
        {m.isPending ? "..." : activeAssignment ? "Qayta tayinlash" : "Tayinlash"}
      </button>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MetadataRail({ sub, activeAssignment }: { sub: any; activeAssignment: any }) {
  return (
    <div className="space-y-4 border-t border-rule pt-6 text-sm">
      <Row k="Turi" v={sub.article_type} />
      <Row k="Til" v={sub.primary_language} />
      <Row k="Yo‘nalish" v={sub.research_field ?? "—"} />
      <Row k="Topshirilgan" v={sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString("uz-UZ") : "—"} />
      {activeAssignment?.deadline && <Row k="Muddat" v={activeAssignment.deadline} />}
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="label-mono">{k}</span>
      <span className="font-medium text-right truncate">{v}</span>
    </div>
  );
}

function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="p-12 max-w-md space-y-3">
      <p className="label-mono text-destructive">Xatolik</p>
      <p className="text-sm">{message}</p>
      <Link to="/submissions" className="label-mono underline">Ro‘yxatga →</Link>
    </div>
  );
}
