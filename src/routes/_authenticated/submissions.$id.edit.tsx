import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, Upload, X, Info } from "lucide-react";
import { AuthorShell } from "@/components/author-shell";
import {
  getSubmission,
  updateDraftMetadata,
  replaceAuthors,
  requestFileUploadUrl,
  recordUploadedFile,
  removeFile,
  transitionSubmission,
  upsertDeclaration,
  replaceSuggestedReviewers,
} from "@/lib/submissions.functions";
import type { WorkflowState } from "@/lib/workflow";

export const Route = createFileRoute("/_authenticated/submissions/$id/edit")({
  head: () => ({ meta: [{ title: "Yangi maqola — bosqichma-bosqich" }, { name: "robots", content: "noindex" }] }),
  component: EditSubmission,
});

/* ------------------------------------------------------------------ */
/*  Section registry                                                  */
/* ------------------------------------------------------------------ */

type StepKey = "terms" | "manuscript" | "authors" | "details" | "declarations" | "supporting" | "reviewers";

const STEPS: { key: StepKey; num: number; title: string; hint: string }[] = [
  { key: "terms",         num: 1, title: "Jurnal shartlari",    hint: "Talablar bilan tanishib chiqing" },
  { key: "manuscript",    num: 2, title: "Maqola fayli",        hint: "Word yoki LaTeX" },
  { key: "authors",       num: 3, title: "Mualliflar",          hint: "Ro‘yxat va aloqa" },
  { key: "details",       num: 4, title: "Maqola tafsilotlari", hint: "Nom, annotatsiya, kalit so‘zlar" },
  { key: "declarations",  num: 5, title: "Ma’lumot va deklaratsiyalar", hint: "Manfaatlar, ma’lumotlar, axloq" },
  { key: "supporting",    num: 6, title: "Qo‘shimcha fayllar",  hint: "Ilova materiallari" },
  { key: "reviewers",     num: 7, title: "Taklif qilingan taqrizchilar", hint: "Ixtiyoriy tavsiyalar" },
];

const DECLARATION_ITEMS: {
  key: string;
  title: string;
  question: string;
  type: "yes_no" | "choice" | "text";
  choices?: { value: string; label: string }[];
  explanationLabel?: string;
}[] = [
  {
    key: "conflicts_of_interest",
    title: "Manfaatlar to‘qnashuvi",
    question:
      "Sizda maqolangiz taqdimotiga ta’sir qilishi mumkin bo‘lgan moliyaviy, shaxsiy yoki professional bog‘lanish bormi?",
    type: "yes_no",
    explanationLabel: "Bo‘lsa, izohlang",
  },
  {
    key: "data_availability",
    title: "Ma’lumotlar mavjudligi",
    question: "Tadqiqotni qo‘llab-quvvatlovchi ma’lumotlar qanday tarqatiladi?",
    type: "choice",
    choices: [
      { value: "no_new_data", label: "Yangi ma’lumot yaratilmagan yoki tahlil qilinmagan" },
      { value: "in_manuscript", label: "Maqola va qo‘shimcha materiallarda mavjud" },
      { value: "on_request", label: "Mas’ul muallifga so‘rov orqali beriladi" },
    ],
  },
  {
    key: "sample_availability",
    title: "Namunalar mavjudligi",
    question: "Tadqiqot fizik namunalarni o‘z ichiga oladimi?",
    type: "yes_no",
    explanationLabel: "Ha bo‘lsa, mavjudligi va cheklovlarni yozing",
  },
  {
    key: "ethics",
    title: "Axloqiy bayonot",
    question: "Tadqiqotingiz axloqiy komissiya tasdig‘ini talab qiladimi?",
    type: "yes_no",
    explanationLabel: "Ha bo‘lsa, tasdiqlash raqami yoki izoh",
  },
  {
    key: "informed_consent",
    title: "Rozilik xati",
    question: "Tadqiqotda inson ishtirok etganmi?",
    type: "yes_no",
    explanationLabel: "Ha bo‘lsa, rozilik olish tartibi",
  },
  {
    key: "funding",
    title: "Moliyalashtirish",
    question: "Tadqiqotni moliyalashtirgan manbalar bormi?",
    type: "yes_no",
    explanationLabel: "Ha bo‘lsa, ro‘yxat: [tashkilot] [grant raqami]",
  },
  {
    key: "author_contributions",
    title: "Mualliflar hissasi",
    question: "Barcha mualliflar tenglik asosida hissa qo‘shdi va mas’uliyatni bo‘lishdimi?",
    type: "yes_no",
    explanationLabel: "Yo‘q bo‘lsa, hissalarni izohlang",
  },
  {
    key: "irb",
    title: "IRB bayonoti",
    question: "Tadqiqotda hayvon yoki inson ishtirok etganmi?",
    type: "yes_no",
    explanationLabel: "Ha bo‘lsa, IRB tasdiq raqami",
  },
  {
    key: "apc_choice",
    title: "Nashr xarajati (APC)",
    question: "APC bo‘yicha qaysi variant amal qiladi?",
    type: "choice",
    choices: [
      { value: "full", label: "To‘liq APC to‘lash" },
      { value: "partial_waiver", label: "Qisman chegirma olindi" },
      { value: "full_waiver", label: "To‘liq chegirma olindi" },
    ],
  },
  {
    key: "ai_usage",
    title: "AI vositalari",
    question:
      "Maqola tayyorlashda generativ AI vositalaridan foydalanildimi?",
    type: "yes_no",
    explanationLabel: "Ha bo‘lsa, vosita nomi/versiyasi va qaysi bosqichda",
  },
];

const CREDIT_ROLES: { value: string; label: string }[] = [
  { value: "conceptualization",     label: "Konseptualizatsiya" },
  { value: "methodology",           label: "Metodologiya" },
  { value: "software",              label: "Dasturiy ta’minot" },
  { value: "validation",            label: "Tekshirish" },
  { value: "formal_analysis",       label: "Rasmiy tahlil" },
  { value: "investigation",         label: "Tadqiqot" },
  { value: "resources",             label: "Resurslar" },
  { value: "data_curation",         label: "Ma’lumotlarni boshqarish" },
  { value: "writing_original",      label: "Yozish — birinchi variant" },
  { value: "writing_review",        label: "Yozish — sharh va tahrir" },
  { value: "visualization",         label: "Vizualizatsiya" },
  { value: "supervision",           label: "Rahbarlik" },
  { value: "project_administration",label: "Loyiha boshqaruvi" },
  { value: "funding_acquisition",   label: "Moliyalashtirish jalb qilish" },
];

/* ------------------------------------------------------------------ */
/*  Root                                                              */
/* ------------------------------------------------------------------ */

function EditSubmission() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const getSub = useServerFn(getSubmission);
  const q = useQuery({ queryKey: ["submission", id], queryFn: () => getSub({ data: { id } }) });
  const [activeStep, setActiveStep] = useState<StepKey>("terms");
  const [completed, setCompleted] = useState<Set<StepKey>>(new Set());
  const scrollToStep = useCallback((key: StepKey) => {
    setActiveStep(key);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const markCompleteAndAdvance = useCallback((key: StepKey) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
    const idx = STEPS.findIndex((s) => s.key === key);
    if (idx < STEPS.length - 1) scrollToStep(STEPS[idx + 1].key);
  }, [scrollToStep]);

  if (q.isPending) {
    return (
      <AuthorShell>
        <div className="px-10 md:px-14 py-12 animate-pulse space-y-4">
          <div className="h-3 w-32 bg-muted rounded" />
          <div className="h-8 w-2/3 bg-muted rounded" />
          <div className="h-32 bg-muted/60 rounded-2xl mt-6" />
        </div>
      </AuthorShell>
    );
  }
  if (q.error) {
    return (
      <AuthorShell>
        <div className="px-10 md:px-14 py-12 max-w-md space-y-3">
          <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-destructive">Xatolik</p>
          <p className="text-[14px] text-foreground">{(q.error as Error).message}</p>
          <Link to="/submissions" className="text-[13px] underline">Ro‘yxatga qaytish →</Link>
        </div>
      </AuthorShell>
    );
  }
  if (!q.data) return null;

  const { submission } = q.data;
  const state = submission.workflow_state as WorkflowState;
  const editable = state === "draft" || state === "revision_requested";
  if (!editable) {
    navigate({ to: "/submissions/$id", params: { id }, replace: true });
    return null;
  }

  const refresh = () => qc.invalidateQueries({ queryKey: ["submission", id] });

  return (
    <AuthorShell>
      <div className="grid grid-cols-12 gap-0 min-h-full">
        {/* Step rail */}
        <aside className="col-span-12 md:col-span-3 border-b md:border-b-0 md:border-r border-border/60">
          <div className="sticky top-0 px-8 py-10">
            <p className="text-[10.5px] font-mono tracking-widest text-muted-foreground">
              {submission.manuscript_id}
            </p>
            <h1 className="font-serif text-[22px] leading-tight tracking-tight mt-2 text-foreground">
              {submission.title || <span className="italic text-muted-foreground">Sarlavhasiz qoralama</span>}
            </h1>
            <ol className="mt-8 space-y-1">
              {STEPS.map((s) => {
                const done = completed.has(s.key);
                const active = activeStep === s.key;
                return (
                  <li key={s.key}>
                    <button
                      type="button"
                      onClick={() => scrollToStep(s.key)}
                      className={`w-full text-left group flex items-start gap-3 py-2.5 px-2 -mx-2 rounded-lg transition-colors ${
                        active ? "bg-muted/60" : "hover:bg-muted/40"
                      }`}
                    >
                      <span
                        className={`shrink-0 mt-0.5 w-6 h-6 rounded-full border flex items-center justify-center text-[11px] font-mono ${
                          done
                            ? "bg-foreground text-background border-foreground"
                            : active
                              ? "border-foreground text-foreground"
                              : "border-border text-muted-foreground"
                        }`}
                      >
                        {done ? <Check className="h-3 w-3" strokeWidth={2.5} /> : s.num}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block font-serif text-[14.5px] leading-tight ${
                            active ? "text-foreground" : "text-foreground/85"
                          }`}
                        >
                          {s.title}
                        </span>
                        <span className="block text-[11.5px] text-muted-foreground mt-0.5">
                          {s.hint}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>

        {/* Content column */}
        <div className="col-span-12 md:col-span-9 px-8 md:px-14 py-12 max-w-3xl">
          <StepNav activeStep={activeStep} onBack={(k) => scrollToStep(k)} />

          <div hidden={activeStep !== "terms"}>
            <Section step={STEPS[0]}>
              <TermsSection sub={submission} onSaved={refresh} onDone={() => markCompleteAndAdvance("terms")} />
            </Section>
          </div>

          <div hidden={activeStep !== "manuscript"}>
            <Section step={STEPS[1]}>
              <ManuscriptSection
                sub={submission}
                files={q.data.files}
                onSaved={refresh}
                onDone={() => markCompleteAndAdvance("manuscript")}
              />
            </Section>
          </div>

          <div hidden={activeStep !== "authors"}>
            <Section step={STEPS[2]}>
              <AuthorsSection
                subId={id}
                authors={q.data.authors}
                onSaved={refresh}
                onDone={() => markCompleteAndAdvance("authors")}
              />
            </Section>
          </div>

          <div hidden={activeStep !== "details"}>
            <Section step={STEPS[3]}>
              <DetailsSection sub={submission} onSaved={refresh} onDone={() => markCompleteAndAdvance("details")} />
            </Section>
          </div>

          <div hidden={activeStep !== "declarations"}>
            <Section step={STEPS[4]}>
              <DeclarationsSection
                subId={id}
                sub={submission}
                declarations={q.data.declarations}
                onSaved={refresh}
                onDone={() => markCompleteAndAdvance("declarations")}
              />
            </Section>
          </div>

          <div hidden={activeStep !== "supporting"}>
            <Section step={STEPS[5]}>
              <SupportingSection
                subId={id}
                files={q.data.files}
                onSaved={refresh}
                onDone={() => markCompleteAndAdvance("supporting")}
              />
            </Section>
          </div>

          <div hidden={activeStep !== "reviewers"}>
            <Section step={STEPS[6]}>
              <ReviewersSection
                subId={id}
                reviewers={q.data.suggested_reviewers}
                submission={submission}
                files={q.data.files}
                authors={q.data.authors}
                onSaved={refresh}
                onSubmitted={() => navigate({ to: "/submissions/$id", params: { id } })}
              />
            </Section>
          </div>
        </div>
      </div>
    </AuthorShell>
  );
}

function StepNav({ activeStep, onBack }: { activeStep: StepKey; onBack: (k: StepKey) => void }) {
  const idx = STEPS.findIndex((s) => s.key === activeStep);
  const prev = idx > 0 ? STEPS[idx - 1] : null;
  return (
    <div className="flex items-center justify-between mb-8">
      <button
        type="button"
        onClick={() => prev && onBack(prev.key)}
        disabled={!prev}
        className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ← {prev ? `Orqaga: ${prev.title}` : "Orqaga"}
      </button>
      <p className="text-[11px] font-mono tracking-widest text-muted-foreground">
        {idx + 1} / {STEPS.length}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section shell                                                     */
/* ------------------------------------------------------------------ */

function Section({
  step,
  children,
}: {
  step: (typeof STEPS)[number];
  children: React.ReactNode;
}) {
  return (
    <div className="scroll-mt-8">
      <div className="mb-6">
        <p className="text-[11px] font-mono tracking-widest text-muted-foreground">
          {String(step.num).padStart(2, "0")}
        </p>
        <h2 className="font-serif text-[26px] leading-tight tracking-tight text-foreground mt-1">
          {step.title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function ContinueButton({
  disabled,
  loading,
  onClick,
  label = "Saqlash va davom etish",
}: {
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <div className="pt-6 border-t border-border/60">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-[13.5px] font-medium hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "..." : label}
      </button>
    </div>
  );
}

function useAutosaveTimestamp() {
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  return {
    savedAt,
    mark: () => setSavedAt(new Date()),
    label: savedAt
      ? `Saqlandi ${savedAt.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}`
      : "",
  };
}

/* ------------------------------------------------------------------ */
/*  1. Terms                                                          */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TermsSection({ sub, onSaved, onDone }: { sub: any; onSaved: () => void; onDone: () => void }) {
  const [accepted, setAccepted] = useState<boolean>(!!sub.terms_accepted);
  const update = useServerFn(updateDraftMetadata);
  const m = useMutation({
    mutationFn: () => update({ data: { id: sub.id, patch: { terms_accepted: accepted } } }),
    onSuccess: () => { onSaved(); onDone(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 p-6 bg-muted/20">
        <p className="text-[14px] text-foreground leading-relaxed">
          <em>O‘zbek tili va adabiyoti</em> — filologiya sohasidagi hakamlik jurnali.
          Barcha topshiriqlar quyidagi shartlarga muvofiq bo‘lishi kerak:
        </p>
        <ol className="mt-4 space-y-2 text-[13.5px] text-foreground list-decimal ml-5 leading-relaxed">
          <li>O‘zbek, ingliz, rus yoki qoraqalpoq tilida yozilgan.</li>
          <li>Word (.doc/.docx) yoki LaTeX (PDF chiqishli) formatida yuklangan.</li>
          <li>Boshqa jurnalda ko‘rib chiqilmayotgan va ilgari nashr etilmagan.</li>
          <li>Barcha mualliflar tomonidan tasdiqlangan.</li>
        </ol>
      </div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-1 w-4 h-4 accent-foreground"
        />
        <span className="text-[13.5px] text-foreground leading-relaxed">
          <em>O‘zbek tili va adabiyoti</em> jurnalining shartlariga roziman.
        </span>
      </label>
      <ContinueButton
        disabled={!accepted}
        loading={m.isPending}
        onClick={() => m.mutate()}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  2. Manuscript file                                                */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ManuscriptSection({ sub, files, onSaved, onDone }: { sub: any; files: any[]; onSaved: () => void; onDone: () => void }) {
  const [format, setFormat] = useState<"word" | "latex">(sub.article_format ?? "word");
  const update = useServerFn(updateDraftMetadata);
  const reqUrl = useServerFn(requestFileUploadUrl);
  const record = useServerFn(recordUploadedFile);
  const rm = useServerFn(removeFile);
  const [uploading, setUploading] = useState(false);

  const manuscriptFiles = files.filter((f) => f.kind === "manuscript");

  async function upload(file: File) {
    setUploading(true);
    try {
      const { path, token } = await reqUrl({ data: { submission_id: sub.id, filename: file.name } });
      const { error } = await supabase.storage.from("manuscripts").uploadToSignedUrl(path, token, file, {
        contentType: file.type,
      });
      if (error) throw error;
      await record({
        data: {
          submission_id: sub.id,
          storage_path: path,
          filename: file.name,
          mime: file.type || undefined,
          size_bytes: file.size,
          kind: "manuscript",
        },
      });
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Yuklashda xatolik");
    } finally {
      setUploading(false);
    }
  }

  const canContinue = manuscriptFiles.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-foreground mb-3">
          Fayl formati
        </p>
        <div className="flex gap-6">
          {(["word", "latex"] as const).map((f) => (
            <label key={f} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="fmt"
                value={f}
                checked={format === f}
                onChange={() => setFormat(f)}
                className="accent-foreground"
              />
              <span className="text-[13.5px] text-foreground">
                {f === "word" ? "Word (.doc / .docx)" : "LaTeX (PDF chiqishli)"}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-border p-8 text-center bg-muted/10">
        {manuscriptFiles.length === 0 ? (
          <>
            <p className="font-serif text-[16px] text-foreground">Asosiy matn faylini yuklang</p>
            <p className="text-[12.5px] text-muted-foreground mt-2 mb-5">
              {format === "word" ? ".doc yoki .docx" : ".tex yoki PDF"}
            </p>
            <label className={`inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-[13.5px] font-medium cursor-pointer ${uploading ? "opacity-50 pointer-events-none" : "hover:opacity-90"}`}>
              <Upload className="h-4 w-4" strokeWidth={1.8} />
              {uploading ? "Yuklanmoqda..." : "Faylni tanlash"}
              <input
                type="file"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
                accept={format === "word" ? ".doc,.docx" : ".tex,.pdf"}
              />
            </label>
          </>
        ) : (
          <ul className="text-left space-y-2">
            {manuscriptFiles.map((f) => (
              <li key={f.id} className="flex items-center gap-3 py-2 border-b border-border/40 last:border-b-0">
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-foreground truncate">{f.filename}</p>
                  <p className="text-[11.5px] font-mono text-muted-foreground mt-0.5">
                    {(f.size_bytes / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    try { await rm({ data: { file_id: f.id } }); onSaved(); }
                    catch (e) { toast.error(e instanceof Error ? e.message : "Xatolik"); }
                  }}
                  className="text-muted-foreground hover:text-destructive p-1.5 rounded-md transition-colors"
                  aria-label="O‘chirish"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ContinueButton
        disabled={!canContinue}
        onClick={async () => {
          try {
            await update({ data: { id: sub.id, patch: { article_format: format } } });
            onSaved();
            onDone();
          } catch (e) {
            toast.error(e instanceof Error ? e.message : "Saqlab bo‘lmadi");
          }
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Authors                                                        */
/* ------------------------------------------------------------------ */

type AuthorRow = {
  full_name: string;
  academic_degree: string;
  email: string;
  phone: string;
  institution: string;
  institution_url: string;
  country: string;
  orcid: string;
  scopus_url: string;
  credit_roles: string[];
  contributor_role: "author" | "co_author" | "corresponding" | "translator" | "editor";
  is_corresponding: boolean;
};

const EMPTY_AUTHOR = (isFirst: boolean): AuthorRow => ({
  full_name: "",
  academic_degree: "",
  email: "",
  phone: "",
  institution: "",
  institution_url: "",
  country: "",
  orcid: "",
  scopus_url: "",
  credit_roles: [],
  contributor_role: isFirst ? "corresponding" : "co_author",
  is_corresponding: isFirst,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AuthorsSection({ subId, authors, onSaved, onDone }: { subId: string; authors: any[]; onSaved: () => void; onDone: () => void }) {
  const [rows, setRows] = useState<AuthorRow[]>(() =>
    authors.length > 0
      ? authors.map((a) => ({
          full_name: a.full_name ?? "",
          academic_degree: a.academic_degree ?? "",
          email: a.email ?? "",
          phone: a.phone ?? "",
          institution: a.institution ?? "",
          institution_url: a.institution_url ?? "",
          country: a.country ?? "",
          orcid: a.orcid ?? "",
          scopus_url: a.scopus_url ?? "",
          credit_roles: a.credit_roles ?? [],
          contributor_role: a.contributor_role ?? "author",
          is_corresponding: !!a.is_corresponding,
        }))
      : [EMPTY_AUTHOR(true)],
  );

  const replace = useServerFn(replaceAuthors);
  const m = useMutation({
    mutationFn: () =>
      replace({
        data: {
          submission_id: subId,
          authors: rows.map((r, i) => ({
            full_name: r.full_name.trim(),
            academic_degree: r.academic_degree || null,
            email: r.email || null,
            phone: r.phone || null,
            institution: r.institution || null,
            institution_url: r.institution_url || null,
            country: r.country || null,
            orcid: r.orcid || null,
            scopus_url: r.scopus_url || null,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            credit_roles: r.credit_roles as any,
            contributor_role: r.contributor_role,
            is_corresponding: r.is_corresponding,
            sort_order: i,
          })),
        },
      }),
    onSuccess: () => { onSaved(); onDone(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const canSave =
    rows.length > 0 &&
    rows.every((r) => r.full_name.trim().length > 0) &&
    rows.some((r) => r.is_corresponding);

  const setRow = (i: number, patch: Partial<AuthorRow>) =>
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  return (
    <div className="space-y-6">
      <p className="text-[13px] text-muted-foreground leading-relaxed max-w-xl">
        Mualliflar maqolada uchraydigan tartibda ro‘yxatlanadi. Kamida bitta muallif
        mas’ul muallif sifatida belgilanishi kerak.
      </p>
      {rows.map((r, i) => (
        <div key={i} className="rounded-2xl border border-border/60 p-6 space-y-5 bg-muted/10">
          <div className="flex items-center justify-between">
            <p className="font-serif text-[15px] text-foreground">
              {i === 0 ? "Birinchi muallif" : `${i + 1}-muallif`}
            </p>
            {rows.length > 1 && (
              <button
                type="button"
                onClick={() => setRows((rs) => rs.filter((_, idx) => idx !== i))}
                className="text-[12px] text-muted-foreground hover:text-destructive transition-colors"
              >
                O‘chirish
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Ism-sharif *">
              <input className="wz-input" value={r.full_name} onChange={(e) => setRow(i, { full_name: e.target.value })} />
            </Field>
            <Field label="Ilmiy daraja / lavozim">
              <input className="wz-input" placeholder="Dr., Prof., PhD..." value={r.academic_degree} onChange={(e) => setRow(i, { academic_degree: e.target.value })} />
            </Field>
            <Field label="Email">
              <input className="wz-input" type="email" value={r.email} onChange={(e) => setRow(i, { email: e.target.value })} />
            </Field>
            <Field label="Telefon">
              <input className="wz-input" value={r.phone} onChange={(e) => setRow(i, { phone: e.target.value })} />
            </Field>
            <Field label="Muassasa">
              <input className="wz-input" value={r.institution} onChange={(e) => setRow(i, { institution: e.target.value })} />
            </Field>
            <Field label="Muassasa vebsahifasi">
              <input className="wz-input" placeholder="https://" value={r.institution_url} onChange={(e) => setRow(i, { institution_url: e.target.value })} />
            </Field>
            <Field label="Davlat">
              <input className="wz-input" value={r.country} onChange={(e) => setRow(i, { country: e.target.value })} />
            </Field>
            <Field label="ORCID">
              <input className="wz-input font-mono" placeholder="0000-0000-0000-0000" value={r.orcid} onChange={(e) => setRow(i, { orcid: e.target.value })} />
            </Field>
            <Field label="Scopus profil URL">
              <input className="wz-input" placeholder="https://" value={r.scopus_url} onChange={(e) => setRow(i, { scopus_url: e.target.value })} />
            </Field>
            <label className="flex items-center gap-2 self-end pb-2">
              <input
                type="checkbox"
                checked={r.is_corresponding}
                onChange={(e) => setRow(i, {
                  is_corresponding: e.target.checked,
                  contributor_role: e.target.checked ? "corresponding" : "co_author",
                })}
                className="accent-foreground"
              />
              <span className="text-[13px] text-foreground">Mas’ul muallif</span>
            </label>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-foreground mb-2">
              Hissa (CRediT)
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {CREDIT_ROLES.map((c) => (
                <label key={c.value} className="flex items-center gap-2 text-[13px] cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-foreground"
                    checked={r.credit_roles.includes(c.value)}
                    onChange={(e) => {
                      const set = new Set(r.credit_roles);
                      if (e.target.checked) set.add(c.value);
                      else set.delete(c.value);
                      setRow(i, { credit_roles: Array.from(set) });
                    }}
                  />
                  <span className="text-foreground">{c.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setRows((rs) => [...rs, EMPTY_AUTHOR(false)])}
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-[13px] text-foreground hover:bg-muted/40 transition-colors"
      >
        + Muallif qo‘shish
      </button>

      <ContinueButton disabled={!canSave} loading={m.isPending} onClick={() => m.mutate()} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  4. Article details                                                */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DetailsSection({ sub, onSaved, onDone }: { sub: any; onSaved: () => void; onDone: () => void }) {
  const update = useServerFn(updateDraftMetadata);
  const [title, setTitle] = useState(sub.title ?? "");
  const [titleEn, setTitleEn] = useState(sub.title_en ?? "");
  const [abstract, setAbstract] = useState(sub.abstract ?? "");
  const [abstractEn, setAbstractEn] = useState(sub.abstract_en ?? "");
  const [kw, setKw] = useState<string>((sub.keywords ?? []).join(", "));
  const [kwEn, setKwEn] = useState<string>((sub.keywords_en ?? []).join(", "));
  const [articleType, setArticleType] = useState(sub.article_type ?? "research");
  const [lang, setLang] = useState(sub.primary_language ?? "uz");
  const [field, setField] = useState(sub.research_field ?? "");
  const [specialIssue, setSpecialIssue] = useState<boolean>(!!sub.special_issue);
  const [aiSection, setAiSection] = useState(sub.ai_section ?? "");
  const [coverLetter, setCoverLetter] = useState(sub.cover_letter ?? "");
  const stamp = useAutosaveTimestamp();

  // Silent autosave (debounced) — does NOT advance step
  const patchRef = useRef<Record<string, unknown>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    patchRef.current = {
      title, title_en: titleEn || null,
      abstract: abstract || null, abstract_en: abstractEn || null,
      keywords: splitList(kw), keywords_en: splitList(kwEn),
      article_type: articleType, primary_language: lang,
      research_field: field || null, special_issue: specialIssue,
      ai_section: aiSection || null, cover_letter: coverLetter || null,
    };
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        await update({ data: { id: sub.id, patch: patchRef.current } });
        stamp.mark();
      } catch { /* silent */ }
    }, 900);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, titleEn, abstract, abstractEn, kw, kwEn, articleType, lang, field, specialIssue, aiSection, coverLetter]);

  const m = useMutation({
    mutationFn: () => update({ data: { id: sub.id, patch: patchRef.current } }),
    onSuccess: () => { onSaved(); onDone(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const canContinue = title.trim().length >= 5 && !!abstract && abstract.length >= 100;

  return (
    <div className="space-y-6">
      {stamp.label && (
        <p className="text-[11.5px] text-muted-foreground">{stamp.label}</p>
      )}
      <Field label="Maqola nomi (o‘zbek) *">
        <input className="wz-input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label="Sarlavha (ingliz)">
        <input className="wz-input" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
      </Field>
      <Field label={`Annotatsiya (150–300 so‘z) *`}>
        <textarea className="wz-textarea min-h-[10rem]" value={abstract} onChange={(e) => setAbstract(e.target.value)} />
      </Field>
      <Field label="Abstract (English)">
        <textarea className="wz-textarea min-h-[8rem]" value={abstractEn} onChange={(e) => setAbstractEn(e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Kalit so‘zlar (vergul bilan)">
          <input className="wz-input" value={kw} onChange={(e) => setKw(e.target.value)} />
        </Field>
        <Field label="Keywords (English)">
          <input className="wz-input" value={kwEn} onChange={(e) => setKwEn(e.target.value)} />
        </Field>
        <Field label="Maqola turi">
          <select className="wz-input" value={articleType} onChange={(e) => setArticleType(e.target.value)}>
            <option value="research">Ilmiy tadqiqot</option>
            <option value="review">Sharh maqolasi</option>
            <option value="short_communication">Qisqa xabar</option>
            <option value="book_review">Kitob taqrizi</option>
            <option value="editorial">Tahririyat maqolasi</option>
          </select>
        </Field>
        <Field label="Asosiy til">
          <select className="wz-input" value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="uz">O‘zbek</option>
            <option value="en">Ingliz</option>
            <option value="ru">Rus</option>
            <option value="qq">Qoraqalpoq</option>
          </select>
        </Field>
        <Field label="Yo‘nalish">
          <select className="wz-input" value={field} onChange={(e) => setField(e.target.value)}>
            <option value="">Tanlang…</option>
            <option value="Filologiya">10.00.00 — Filologiya</option>
            <option value="Pedagogika">13.00.00 — Pedagogika</option>

          </select>

        </Field>
        <Field label="Bo‘lim (AI/tematik)">
          <input className="wz-input" placeholder="Ixtiyoriy" value={aiSection} onChange={(e) => setAiSection(e.target.value)} />
        </Field>
      </div>
      <div>
        <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-foreground mb-2">
          Maxsus sonmi?
        </p>
        <div className="flex gap-6">
          {[true, false].map((v) => (
            <label key={String(v)} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={specialIssue === v} onChange={() => setSpecialIssue(v)} className="accent-foreground" />
              <span className="text-[13.5px] text-foreground">{v ? "Ha" : "Yo‘q"}</span>
            </label>
          ))}
        </div>
      </div>
      <Field label="Boshlovchi xat (Cover Letter)">
        <textarea className="wz-textarea min-h-[8rem]" placeholder="Ish nima uchun ahamiyatli va jurnal profiliga qanday mos kelishini yozing" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
      </Field>
      <ContinueButton disabled={!canContinue} loading={m.isPending} onClick={() => m.mutate()} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  5. Declarations                                                   */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DeclarationsSection({ subId, sub, declarations, onSaved, onDone }: { subId: string; sub: any; declarations: any[]; onSaved: () => void; onDone: () => void }) {
  const upsert = useServerFn(upsertDeclaration);
  const update = useServerFn(updateDraftMetadata);
  const [originality, setOriginality] = useState<boolean>(!!sub.originality_confirmed);
  const [pending, setPending] = useState(false);

  const byKey = useMemo(() => {
    const m: Record<string, { response_value: string | null; explanation: string | null }> = {};
    for (const d of declarations) m[d.declaration_key] = { response_value: d.response_value, explanation: d.explanation };
    return m;
  }, [declarations]);

  const [state, setState] = useState<Record<string, { value: string; explanation: string }>>(() => {
    const s: Record<string, { value: string; explanation: string }> = {};
    for (const item of DECLARATION_ITEMS) {
      s[item.key] = {
        value: byKey[item.key]?.response_value ?? "",
        explanation: byKey[item.key]?.explanation ?? "",
      };
    }
    return s;
  });

  const allAnswered = DECLARATION_ITEMS.every((i) => state[i.key].value !== "");

  async function saveAll() {
    setPending(true);
    try {
      for (const item of DECLARATION_ITEMS) {
        const v = state[item.key];
        if (v.value === "") continue;
        await upsert({
          data: {
            submission_id: subId,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            declaration_key: item.key as any,
            response_type: item.type,
            response_value: v.value,
            explanation: v.explanation || null,
          },
        });
      }
      await update({ data: { id: sub.id, patch: { originality_confirmed: originality } } });
      onSaved();
      onDone();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Saqlab bo‘lmadi");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-[13px] text-muted-foreground leading-relaxed max-w-xl flex items-start gap-2">
        <Info className="h-4 w-4 mt-0.5 shrink-0" strokeWidth={1.8} />
        <span>
          Har bir savolga javob bering. Kerak bo‘lsa, izoh matnida qo‘shimcha ma’lumot bering.
          O‘zgarishlar audit jurnalida qayd etiladi.
        </span>
      </p>

      {DECLARATION_ITEMS.map((item) => {
        const v = state[item.key];
        return (
          <div key={item.key} className="rounded-2xl border border-border/60 p-6 bg-muted/10 space-y-4">
            <div>
              <p className="font-serif text-[16px] text-foreground">{item.title}</p>
              <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed">{item.question}</p>
            </div>
            {item.type === "yes_no" && (
              <div className="flex gap-6">
                {(["yes", "no"] as const).map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={item.key}
                      checked={v.value === opt}
                      onChange={() => setState((s) => ({ ...s, [item.key]: { ...s[item.key], value: opt } }))}
                      className="accent-foreground"
                    />
                    <span className="text-[13.5px] text-foreground">{opt === "yes" ? "Ha" : "Yo‘q"}</span>
                  </label>
                ))}
              </div>
            )}
            {item.type === "choice" && (
              <div className="space-y-2">
                {item.choices!.map((c) => (
                  <label key={c.value} className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name={item.key}
                      checked={v.value === c.value}
                      onChange={() => setState((s) => ({ ...s, [item.key]: { ...s[item.key], value: c.value } }))}
                      className="mt-1 accent-foreground"
                    />
                    <span className="text-[13.5px] text-foreground leading-snug">{c.label}</span>
                  </label>
                ))}
              </div>
            )}
            {item.explanationLabel && (
              <Field label={item.explanationLabel}>
                <textarea
                  className="wz-textarea min-h-[5rem]"
                  value={v.explanation}
                  onChange={(e) => setState((s) => ({ ...s, [item.key]: { ...s[item.key], explanation: e.target.value } }))}
                />
              </Field>
            )}
          </div>
        );
      })}

      <label className="flex items-start gap-3 cursor-pointer pt-2">
        <input
          type="checkbox"
          checked={originality}
          onChange={(e) => setOriginality(e.target.checked)}
          className="mt-1 w-4 h-4 accent-foreground"
        />
        <span className="text-[13.5px] text-foreground leading-relaxed">
          Bu ish original, ilgari nashr etilmagan va boshqa jurnalda ko‘rib chiqilmayotganini tasdiqlayman.
        </span>
      </label>

      <ContinueButton disabled={!allAnswered || !originality} loading={pending} onClick={saveAll} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  6. Supporting files                                               */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SupportingSection({ subId, files, onSaved, onDone }: { subId: string; files: any[]; onSaved: () => void; onDone: () => void }) {
  const reqUrl = useServerFn(requestFileUploadUrl);
  const record = useServerFn(recordUploadedFile);
  const rm = useServerFn(removeFile);
  const [kind, setKind] = useState<"cover_letter" | "supplementary">("supplementary");
  const [uploading, setUploading] = useState(false);
  const supporting = files.filter((f) => f.kind !== "manuscript");

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
          submission_id: subId, storage_path: path, filename: file.name,
          mime: file.type || undefined, size_bytes: file.size, kind,
        },
      });
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Yuklashda xatolik");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-[13px] text-muted-foreground leading-relaxed max-w-xl">
        15 tagacha ilova fayl qo‘shishingiz mumkin: rasm, jadval, matn, ma’lumot,
        boshlovchi xat. Barcha ilovalar asosiy matnda havola qilingan bo‘lishi kerak.
      </p>

      <div className="flex items-center gap-3">
        <select className="wz-input max-w-xs" value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
          <option value="supplementary">Qo‘shimcha material</option>
          <option value="cover_letter">Boshlovchi xat (fayl)</option>
        </select>
        <label className={`inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[13px] text-foreground cursor-pointer ${uploading ? "opacity-50 pointer-events-none" : "hover:bg-muted/40"}`}>
          <Upload className="h-3.5 w-3.5" strokeWidth={1.8} />
          {uploading ? "Yuklanmoqda..." : "Fayl tanlash"}
          <input
            type="file"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
        </label>
      </div>

      {supporting.length > 0 && (
        <ul className="divide-y divide-border/60 border-y border-border/60">
          {supporting.map((f) => (
            <li key={f.id} className="flex items-center gap-3 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-medium text-foreground truncate">{f.filename}</p>
                <p className="text-[11.5px] font-mono text-muted-foreground mt-0.5">
                  {f.kind} · {(f.size_bytes / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  try { await rm({ data: { file_id: f.id } }); onSaved(); }
                  catch (e) { toast.error(e instanceof Error ? e.message : "Xatolik"); }
                }}
                className="text-muted-foreground hover:text-destructive p-1.5 rounded-md transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <ContinueButton onClick={onDone} label="Davom etish" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  7. Suggested reviewers + Submit                                   */
/* ------------------------------------------------------------------ */

type RevRow = { full_name: string; email: string; institution: string; reason: string };

function ReviewersSection({
  subId, reviewers, submission, files, authors, onSaved, onSubmitted,
}: {
  subId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reviewers: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submission: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  files: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authors: any[];
  onSaved: () => void;
  onSubmitted: () => void;
}) {
  const replace = useServerFn(replaceSuggestedReviewers);
  const transition = useServerFn(transitionSubmission);
  const [rows, setRows] = useState<RevRow[]>(
    reviewers.length > 0
      ? reviewers.map((r) => ({
          full_name: r.full_name ?? "",
          email: r.email ?? "",
          institution: r.institution ?? "",
          reason: r.reason ?? "",
        }))
      : [],
  );

  const problems: string[] = [];
  if (!submission.title || submission.title.length < 5) problems.push("Sarlavha kiritilmagan.");
  if (authors.length === 0) problems.push("Mualliflar ro‘yxati bo‘sh.");
  if (!files.some((f: { kind: string }) => f.kind === "manuscript")) problems.push("Asosiy matn fayli yuklanmagan.");
  if (!submission.abstract) problems.push("Annotatsiya kiritilmagan.");
  if (!submission.terms_accepted) problems.push("Jurnal shartlari qabul qilinmagan.");
  if (!submission.originality_confirmed) problems.push("Originallik tasdig‘i yo‘q.");
  const canSubmit = problems.length === 0;

  const saveReviewers = useMutation({
    mutationFn: () =>
      replace({
        data: {
          submission_id: subId,
          reviewers: rows
            .filter((r) => r.full_name.trim().length > 0)
            .map((r) => ({
              full_name: r.full_name.trim(),
              email: r.email || null,
              institution: r.institution || null,
              reason: r.reason || null,
            })),
        },
      }),
    onSuccess: () => { onSaved(); toast.success("Tavsiyalar saqlandi"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const submitM = useMutation({
    mutationFn: async () => {
      // Save reviewers first (no-op if empty)
      await saveReviewers.mutateAsync();
      return transition({ data: { id: subId, to_state: "submitted", reason: null } });
    },
    onSuccess: () => { toast.success("Maqola tahririyatga topshirildi"); onSubmitted(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 p-5 bg-muted/20 flex gap-3">
        <Info className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" strokeWidth={1.8} />
        <p className="text-[13px] text-foreground leading-relaxed">
          Ushbu tavsiyalar tahririyat uchun ma’lumot xarakterida. Ular taqrizchining tayinlanishini
          kafolatlamaydi — tahririyat qarorini mustaqil qabul qiladi.
          Manfaatlar to‘qnashuvi bo‘lishi mumkin bo‘lgan shaxslarni tavsiya qilmang.
        </p>
      </div>

      {rows.map((r, i) => (
        <div key={i} className="rounded-2xl border border-border/60 p-5 space-y-3 bg-muted/10">
          <div className="flex items-center justify-between">
            <p className="font-serif text-[14px] text-foreground">{i + 1}-taqrizchi</p>
            <button
              type="button"
              onClick={() => setRows((rs) => rs.filter((_, idx) => idx !== i))}
              className="text-[12px] text-muted-foreground hover:text-destructive"
            >
              O‘chirish
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ism-sharif">
              <input className="wz-input" value={r.full_name} onChange={(e) => setRows((rs) => rs.map((x, idx) => idx === i ? { ...x, full_name: e.target.value } : x))} />
            </Field>
            <Field label="Email">
              <input className="wz-input" value={r.email} onChange={(e) => setRows((rs) => rs.map((x, idx) => idx === i ? { ...x, email: e.target.value } : x))} />
            </Field>
            <Field label="Muassasa">
              <input className="wz-input" value={r.institution} onChange={(e) => setRows((rs) => rs.map((x, idx) => idx === i ? { ...x, institution: e.target.value } : x))} />
            </Field>
            <Field label="Sabab (ixtiyoriy)">
              <input className="wz-input" value={r.reason} onChange={(e) => setRows((rs) => rs.map((x, idx) => idx === i ? { ...x, reason: e.target.value } : x))} />
            </Field>
          </div>
        </div>
      ))}

      {rows.length < 10 && (
        <button
          type="button"
          onClick={() => setRows((rs) => [...rs, { full_name: "", email: "", institution: "", reason: "" }])}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-[13px] text-foreground hover:bg-muted/40 transition-colors"
        >
          + Taqrizchi tavsiya qilish
        </button>
      )}

      <div className="pt-6 border-t border-border/60 space-y-4">
        {!canSubmit && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-[11.5px] font-semibold tracking-[0.14em] uppercase text-destructive mb-2">
              Yetishmayotgan ma’lumotlar
            </p>
            <ul className="text-[13px] list-disc ml-5 text-foreground space-y-1">
              {problems.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
        )}
        <button
          type="button"
          onClick={() => submitM.mutate()}
          disabled={!canSubmit || submitM.isPending}
          className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-[14px] font-medium hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitM.isPending ? "Topshirilmoqda..." : "Tahririyatga topshirish"}
        </button>
        <p className="text-[11.5px] text-muted-foreground">
          Topshirilgandan so‘ng maqola qoralamadan chiqadi va tahrirlab bo‘lmaydi.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Utilities                                                         */
/* ------------------------------------------------------------------ */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11.5px] font-semibold tracking-[0.08em] uppercase text-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function splitList(s: string): string[] {
  return s.split(",").map((x) => x.trim()).filter(Boolean);
}
