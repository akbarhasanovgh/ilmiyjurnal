import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EditorialShell } from "@/components/editorial-shell";
import { WorkflowBadge } from "@/components/workflow-badge";
import {
  getSubmission,
  updateDraftMetadata,
  replaceAuthors,
  requestFileUploadUrl,
  recordUploadedFile,
  removeFile,
  transitionSubmission,
} from "@/lib/submissions.functions";
import type { WorkflowState } from "@/lib/workflow";

export const Route = createFileRoute("/_authenticated/submissions/$id/edit")({
  head: () => ({ meta: [{ title: "Maqolani tahrirlash" }, { name: "robots", content: "noindex" }] }),
  component: EditSubmission,
});

type Section = "meta" | "authors" | "abstract" | "files" | "review";

const SECTIONS: { key: Section; label: string }[] = [
  { key: "meta", label: "1. Metama’lumot" },
  { key: "authors", label: "2. Mualliflar" },
  { key: "abstract", label: "3. Annotatsiya" },
  { key: "files", label: "4. Fayllar" },
  { key: "review", label: "5. Ko‘rib chiqish" },
];

function EditSubmission() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const getSub = useServerFn(getSubmission);
  const q = useQuery({ queryKey: ["submission", id], queryFn: () => getSub({ data: { id } }) });
  const [section, setSection] = useState<Section>("meta");

  if (q.isPending) return <EditorialShell><LoadingBlock /></EditorialShell>;
  if (q.error) return <EditorialShell><ErrorBlock message={(q.error as Error).message} /></EditorialShell>;
  if (!q.data) return null;

  const { submission } = q.data;
  const state = submission.workflow_state as WorkflowState;
  const editable = state === "draft" || state === "revision_requested";

  if (!editable) {
    // Redirect to read-only detail
    navigate({ to: "/submissions/$id", params: { id }, replace: true });
    return null;
  }

  const refresh = () => qc.invalidateQueries({ queryKey: ["submission", id] });

  return (
    <EditorialShell>
      <div className="border-b border-rule">
        <div className="max-w-5xl px-8 md:px-12 py-6">
          <div className="flex items-center justify-between gap-6 mb-3">
            <p className="label-mono">{submission.manuscript_id}</p>
            <WorkflowBadge state={state} />
          </div>
          <h1 className="font-serif text-2xl leading-snug">
            {submission.title || <span className="italic text-ink-faint">Sarlavhasiz qoralama</span>}
          </h1>
        </div>
        <nav className="max-w-5xl px-8 md:px-12 flex flex-wrap gap-x-6 gap-y-2 -mb-px">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              className={`py-3 label-mono border-b-2 transition-colors ${
                section === s.key ? "border-ink text-ink" : "border-transparent hover:text-ink-soft"
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="max-w-5xl px-8 md:px-12 py-10">
        {section === "meta" && <MetaSection sub={q.data.submission} onSaved={refresh} />}
        {section === "authors" && <AuthorsSection subId={id} authors={q.data.authors} onSaved={refresh} />}
        {section === "abstract" && <AbstractSection sub={q.data.submission} onSaved={refresh} />}
        {section === "files" && <FilesSection subId={id} files={q.data.files} onSaved={refresh} />}
        {section === "review" && <ReviewSection data={q.data} onSubmitted={() => navigate({ to: "/submissions/$id", params: { id } })} />}
      </div>
    </EditorialShell>
  );
}

/* ---------------------------------------------------------------------- */
/* 1 · METADATA                                                            */
/* ---------------------------------------------------------------------- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MetaSection({ sub, onSaved }: { sub: any; onSaved: () => void }) {
  const update = useServerFn(updateDraftMetadata);
  const [title, setTitle] = useState(sub.title ?? "");
  const [titleEn, setTitleEn] = useState(sub.title_en ?? "");
  const [articleType, setArticleType] = useState(sub.article_type ?? "research");
  const [lang, setLang] = useState(sub.primary_language ?? "uz");
  const [field, setField] = useState(sub.research_field ?? "");

  const m = useMutation({
    mutationFn: () =>
      update({
        data: {
          id: sub.id,
          patch: {
            title,
            title_en: titleEn || null,
            article_type: articleType,
            primary_language: lang,
            research_field: field || null,
          },
        },
      }),
    onSuccess: () => { toast.success("Saqlandi"); onSaved(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); m.mutate(); }}
      className="space-y-6 max-w-2xl"
    >
      <Field label="Maqola nomi (o‘zbek)">
        <input required className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label="Sarlavha (ingliz)">
        <input className="input" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Maqola turi">
          <select className="input" value={articleType} onChange={(e) => setArticleType(e.target.value as typeof articleType)}>
            <option value="research">Ilmiy tadqiqot</option>
            <option value="review">Sharh maqolasi</option>
            <option value="short_communication">Qisqa xabar</option>
            <option value="book_review">Kitob taqrizi</option>
            <option value="editorial">Tahririyat maqolasi</option>
          </select>
        </Field>
        <Field label="Asosiy til">
          <select className="input" value={lang} onChange={(e) => setLang(e.target.value as typeof lang)}>
            <option value="uz">O‘zbek</option>
            <option value="en">Ingliz</option>
            <option value="ru">Rus</option>
            <option value="qq">Qoraqalpoq</option>
          </select>
        </Field>
      </div>
      <Field label="Yo‘nalish (tilshunoslik, adabiyotshunoslik, matnshunoslik...)">
        <input className="input" value={field} onChange={(e) => setField(e.target.value)} />
      </Field>
      <button className="btn-primary hover:bg-ink-soft disabled:opacity-50" disabled={m.isPending}>
        {m.isPending ? "..." : "Saqlash"}
      </button>
    </form>
  );
}

/* ---------------------------------------------------------------------- */
/* 2 · AUTHORS                                                             */
/* ---------------------------------------------------------------------- */
type AuthorRow = {
  full_name: string;
  email: string;
  institution: string;
  orcid: string;
  contributor_role: "author" | "co_author" | "corresponding" | "translator" | "editor";
  is_corresponding: boolean;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AuthorsSection({ subId, authors, onSaved }: { subId: string; authors: any[]; onSaved: () => void }) {
  const [rows, setRows] = useState<AuthorRow[]>(
    authors.length > 0
      ? authors.map((a) => ({
          full_name: a.full_name ?? "",
          email: a.email ?? "",
          institution: a.institution ?? "",
          orcid: a.orcid ?? "",
          contributor_role: a.contributor_role ?? "author",
          is_corresponding: !!a.is_corresponding,
        }))
      : [{ full_name: "", email: "", institution: "", orcid: "", contributor_role: "author", is_corresponding: true }],
  );
  const replace = useServerFn(replaceAuthors);
  const m = useMutation({
    mutationFn: () =>
      replace({
        data: {
          submission_id: subId,
          authors: rows.map((r, i) => ({
            full_name: r.full_name.trim(),
            email: r.email || undefined,
            institution: r.institution || undefined,
            orcid: r.orcid || undefined,
            contributor_role: r.contributor_role,
            is_corresponding: r.is_corresponding,
            sort_order: i,
          })),
        },
      }),
    onSuccess: () => { toast.success("Mualliflar saqlandi"); onSaved(); },
    onError: (e: Error) => toast.error(e.message),
  });

  function setRow(i: number, patch: Partial<AuthorRow>) {
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  function addRow() {
    setRows((rs) => [...rs, { full_name: "", email: "", institution: "", orcid: "", contributor_role: "co_author", is_corresponding: false }]);
  }
  function removeRow(i: number) {
    setRows((rs) => rs.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <p className="text-sm text-ink-muted">
        Mualliflar tartibda ko‘rsatiladi. Kamida bitta muallif «mas’ul muallif» sifatida belgilangan bo‘lishi kerak.
      </p>
      <div className="space-y-4">
        {rows.map((r, i) => (
          <div key={i} className="border border-rule p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="label-mono">Muallif #{i + 1}</p>
              {rows.length > 1 && (
                <button onClick={() => removeRow(i)} className="label-mono hover:text-destructive">O‘chirish</button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Ism-sharif">
                <input className="input" value={r.full_name} onChange={(e) => setRow(i, { full_name: e.target.value })} required />
              </Field>
              <Field label="Email">
                <input className="input" type="email" value={r.email} onChange={(e) => setRow(i, { email: e.target.value })} />
              </Field>
              <Field label="Muassasa">
                <input className="input" value={r.institution} onChange={(e) => setRow(i, { institution: e.target.value })} />
              </Field>
              <Field label="ORCID">
                <input className="input font-mono" value={r.orcid} onChange={(e) => setRow(i, { orcid: e.target.value })} placeholder="0000-0000-0000-0000" />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={r.is_corresponding}
                onChange={(e) => setRow(i, { is_corresponding: e.target.checked, contributor_role: e.target.checked ? "corresponding" : "author" })}
              />
              Mas’ul muallif
            </label>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button onClick={addRow} type="button" className="btn-secondary hover:bg-surface-sunken">+ Muallif qo‘shish</button>
        <button onClick={() => m.mutate()} disabled={m.isPending} className="btn-primary hover:bg-ink-soft disabled:opacity-50">
          {m.isPending ? "..." : "Saqlash"}
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* 3 · ABSTRACT / KEYWORDS                                                 */
/* ---------------------------------------------------------------------- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AbstractSection({ sub, onSaved }: { sub: any; onSaved: () => void }) {
  const update = useServerFn(updateDraftMetadata);
  const [abstract, setAbstract] = useState(sub.abstract ?? "");
  const [abstractEn, setAbstractEn] = useState(sub.abstract_en ?? "");
  const [kw, setKw] = useState((sub.keywords ?? []).join(", "));
  const [kwEn, setKwEn] = useState((sub.keywords_en ?? []).join(", "));

  const m = useMutation({
    mutationFn: () =>
      update({
        data: {
          id: sub.id,
          patch: {
            abstract: abstract || null,
            abstract_en: abstractEn || null,
            keywords: splitList(kw),
            keywords_en: splitList(kwEn),
          },
        },
      }),
    onSuccess: () => { toast.success("Saqlandi"); onSaved(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="space-y-6 max-w-3xl">
      <Field label="Annotatsiya (o‘zbek)">
        <textarea className="textarea min-h-[8rem]" value={abstract} onChange={(e) => setAbstract(e.target.value)} />
      </Field>
      <Field label="Abstract (English)">
        <textarea className="textarea min-h-[8rem]" value={abstractEn} onChange={(e) => setAbstractEn(e.target.value)} />
      </Field>
      <Field label="Kalit so‘zlar (vergul bilan ajrating)">
        <input className="input" value={kw} onChange={(e) => setKw(e.target.value)} placeholder="Navoiy, poetika, kognitivistika" />
      </Field>
      <Field label="Keywords (English)">
        <input className="input" value={kwEn} onChange={(e) => setKwEn(e.target.value)} />
      </Field>
      <button className="btn-primary hover:bg-ink-soft disabled:opacity-50" disabled={m.isPending}>
        {m.isPending ? "..." : "Saqlash"}
      </button>
    </form>
  );
}

function splitList(s: string): string[] {
  return s.split(",").map((x) => x.trim()).filter(Boolean);
}

/* ---------------------------------------------------------------------- */
/* 4 · FILES                                                               */
/* ---------------------------------------------------------------------- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FilesSection({ subId, files, onSaved }: { subId: string; files: any[]; onSaved: () => void }) {
  const reqUrl = useServerFn(requestFileUploadUrl);
  const record = useServerFn(recordUploadedFile);
  const rm = useServerFn(removeFile);
  const [kind, setKind] = useState<"manuscript" | "anonymous_manuscript" | "cover_letter" | "supplementary">("manuscript");
  const [uploading, setUploading] = useState(false);

  async function upload(file: File) {
    setUploading(true);
    try {
      const { path, token } = await reqUrl({ data: { submission_id: subId, filename: file.name } });
      const { error } = await supabase.storage.from("manuscripts").uploadToSignedUrl(path, token, file, {
        contentType: file.type,
      });
      if (error) throw error;
      await record({
        data: {
          submission_id: subId,
          storage_path: path,
          filename: file.name,
          mime: file.type || undefined,
          size_bytes: file.size,
          kind,
        },
      });
      toast.success("Fayl yuklandi");
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Yuklashda xatolik");
    } finally {
      setUploading(false);
    }
  }

  const kindLabel: Record<string, string> = {
    manuscript: "Asosiy matn",
    anonymous_manuscript: "Anonim variant",
    cover_letter: "Boshlovchi xat",
    figure: "Rasm",
    table: "Jadval",
    supplementary: "Qo‘shimcha material",
    data: "Ma’lumotlar",
    other: "Boshqa",
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border border-rule p-4 space-y-3">
        <div className="flex items-center gap-3">
          <select className="input max-w-xs" value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
            <option value="manuscript">Asosiy matn (majburiy)</option>
            <option value="anonymous_manuscript">Anonim variant</option>
            <option value="cover_letter">Boshlovchi xat</option>
            <option value="supplementary">Qo‘shimcha material</option>
          </select>
          <label className={`btn-secondary hover:bg-surface-sunken cursor-pointer ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
            {uploading ? "Yuklanmoqda..." : "Fayl tanlash"}
            <input
              type="file"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
              accept=".pdf,.doc,.docx,.tex,.rtf,.png,.jpg,.jpeg,.tif,.tiff,.xlsx,.csv"
            />
          </label>
        </div>
        <p className="text-xs text-ink-muted">
          Ruxsat etilgan formatlar: PDF, DOCX, TEX, RTF, tasvirlar. Maksimal 50 MB.
        </p>
      </div>

      {files.length === 0 ? (
        <div className="border border-rule p-8 text-center">
          <p className="label-mono">Bo‘sh</p>
          <p className="text-sm mt-2">Hali fayllar yuklanmagan. Kamida bitta «Asosiy matn» talab qilinadi.</p>
        </div>
      ) : (
        <div className="divide-y divide-rule border-y border-rule">
          {files.map((f) => (
            <div key={f.id} className="grid grid-cols-12 gap-3 py-3 items-center">
              <div className="col-span-6">
                <p className="text-sm font-medium truncate">{f.filename}</p>
                <p className="text-xs text-ink-muted font-mono">{(f.size_bytes / 1024).toFixed(1)} KB</p>
              </div>
              <div className="col-span-3 label-mono">{kindLabel[f.kind] ?? f.kind}</div>
              <div className="col-span-3 text-right">
                <button
                  onClick={async () => {
                    if (!confirm("O‘chirilsinmi?")) return;
                    try { await rm({ data: { file_id: f.id } }); toast.success("O‘chirildi"); onSaved(); }
                    catch (e) { toast.error(e instanceof Error ? e.message : "Xatolik"); }
                  }}
                  className="label-mono hover:text-destructive"
                >
                  O‘chirish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* 5 · REVIEW & SUBMIT                                                     */
/* ---------------------------------------------------------------------- */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ReviewSection({ data, onSubmitted }: { data: any; onSubmitted: () => void }) {
  const transition = useServerFn(transitionSubmission);
  const { submission, authors, files } = data;

  const problems: string[] = [];
  if (!submission.title || submission.title.length < 5) problems.push("Sarlavha kiritilmagan.");
  if (authors.length === 0) problems.push("Mualliflar ro‘yxati bo‘sh.");
  if (!files.some((f: { kind: string }) => f.kind === "manuscript")) problems.push("Asosiy matn fayli yuklanmagan.");
  if (!submission.abstract) problems.push("Annotatsiya kiritilmagan.");

  const canSubmit = problems.length === 0;

  const m = useMutation({
    mutationFn: () =>
      transition({ data: { id: submission.id, to_state: "submitted", reason: undefined } }),
    onSuccess: () => { toast.success("Maqola tahririyatga topshirildi"); onSubmitted(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="space-y-3">
        <p className="label-mono">Ko‘rib chiqish</p>
        <p className="font-serif text-2xl leading-snug">Topshirish oldidan tekshiring</p>
      </div>
      <dl className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm border-y border-rule py-6">
        <div>
          <dt className="label-mono">Sarlavha</dt>
          <dd className="mt-1">{submission.title || <span className="text-ink-faint italic">Kiritilmagan</span>}</dd>
        </div>
        <div>
          <dt className="label-mono">Turi</dt>
          <dd className="mt-1">{submission.article_type}</dd>
        </div>
        <div>
          <dt className="label-mono">Mualliflar</dt>
          <dd className="mt-1">{authors.length} kishi</dd>
        </div>
        <div>
          <dt className="label-mono">Fayllar</dt>
          <dd className="mt-1">{files.length} ta</dd>
        </div>
      </dl>
      {!canSubmit && (
        <div className="border border-destructive/30 bg-destructive/5 p-4 space-y-2">
          <p className="label-mono text-destructive">Yetishmayotgan ma’lumotlar</p>
          <ul className="text-sm list-disc ml-5">
            {problems.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
      )}
      <button
        onClick={() => m.mutate()}
        disabled={!canSubmit || m.isPending}
        className="btn-primary hover:bg-ink-soft disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {m.isPending ? "..." : "Tahririyatga topshirish"}
      </button>
      <p className="text-xs text-ink-muted">
        Topshirilgandan so‘ng maqola qoralamadan chiqadi va tahrirlab bo‘lmaydi.
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="label-mono block">{label}</span>
      {children}
    </label>
  );
}
function LoadingBlock() { return <div className="p-12"><div className="h-24 bg-surface-sunken animate-pulse" /></div>; }
function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="p-12 max-w-md space-y-3">
      <p className="label-mono text-destructive">Xatolik</p>
      <p className="text-sm">{message}</p>
      <Link to="/submissions" className="label-mono underline">Ro‘yxatga qaytish →</Link>
    </div>
  );
}
// silence "unused" via effect placeholder — no-op keeps interfaces stable
useEffect;
