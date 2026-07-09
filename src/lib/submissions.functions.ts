import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// ---------- Types shared with client ----------
export type WorkflowStateT =
  | "draft"
  | "submitted"
  | "screening"
  | "editor_assigned"
  | "under_review"
  | "revision_requested"
  | "revised"
  | "accepted"
  | "rejected"
  | "withdrawn";

const MetaSchema = z.object({
  title: z.string().max(500),
  title_en: z.string().max(500).optional().nullable(),
  article_type: z.enum(["research", "review", "short_communication", "book_review", "editorial"]),
  research_field: z.string().max(200).optional().nullable(),
  primary_language: z.enum(["uz", "en", "ru", "qq"]),
  abstract: z.string().max(5000).optional().nullable(),
  abstract_en: z.string().max(5000).optional().nullable(),
  keywords: z.array(z.string().max(80)).max(20).default([]),
  keywords_en: z.array(z.string().max(80)).max(20).default([]),
  // New stable core columns
  terms_accepted: z.boolean().optional(),
  article_format: z.enum(["word", "latex"]).optional().nullable(),
  cover_letter: z.string().max(10000).optional().nullable(),
  special_issue: z.boolean().optional().nullable(),
  ai_section: z.string().max(200).optional().nullable(),
  originality_confirmed: z.boolean().optional(),
});

const CREDIT_ROLES = [
  "conceptualization","methodology","software","validation","formal_analysis",
  "investigation","resources","data_curation","writing_original","writing_review",
  "visualization","supervision","project_administration","funding_acquisition",
] as const;

const AuthorSchema = z.object({
  id: z.string().uuid().optional(),
  full_name: z.string().min(1).max(200),
  email: z.string().email().optional().nullable(),
  institution: z.string().max(300).optional().nullable(),
  department: z.string().max(200).optional().nullable(),
  country: z.string().max(80).optional().nullable(),
  orcid: z.string().max(30).optional().nullable(),
  academic_degree: z.string().max(120).optional().nullable(),
  phone: z.string().max(60).optional().nullable(),
  institution_url: z.string().url().max(500).optional().nullable().or(z.literal("")),
  scopus_url: z.string().url().max(500).optional().nullable().or(z.literal("")),
  credit_roles: z.array(z.enum(CREDIT_ROLES)).default([]),
  contributor_role: z.enum(["author", "co_author", "corresponding", "translator", "editor"]).default("author"),
  is_corresponding: z.boolean().default(false),
  sort_order: z.number().int().default(0),
});

const DECLARATION_KEYS = [
  "conflicts_of_interest","data_availability","sample_availability","ethics",
  "informed_consent","funding","author_contributions","irb","apc_choice","ai_usage",
] as const;

// ---------- Create draft ----------
export const createDraftSubmission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    // Idempotency: reuse an untouched empty draft created within the last 60s
    // by this user (prevents duplicates from double-clicks, remounts, refreshes).
    const cutoff = new Date(Date.now() - 60_000).toISOString();
    const { data: existing } = await supabase
      .from("submissions")
      .select("*")
      .eq("owner_id", userId)
      .eq("workflow_state", "draft")
      .eq("title", "")
      .gte("created_at", cutoff)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (existing) {
      // Confirm it has no authors and no files — otherwise treat as a real draft
      const [{ count: authorCount }, { count: fileCount }] = await Promise.all([
        supabase.from("submission_authors").select("id", { count: "exact", head: true }).eq("submission_id", existing.id),
        supabase.from("submission_files").select("id", { count: "exact", head: true }).eq("submission_id", existing.id),
      ]);
      if ((authorCount ?? 0) === 0 && (fileCount ?? 0) === 0) {
        return existing;
      }
    }
    const { data, error } = await supabase
      .from("submissions")
      .insert({ owner_id: userId, title: "" })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return data;
  });

// ---------- Update draft metadata ----------
export const updateDraftMetadata = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ id: z.string().uuid(), patch: MetaSchema.partial() }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: updated, error } = await supabase
      .from("submissions")
      .update(data.patch)
      .eq("id", data.id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return updated;
  });

// ---------- Replace authors list ----------
export const replaceAuthors = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ submission_id: z.string().uuid(), authors: z.array(AuthorSchema) }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    await supabase.from("submission_authors").delete().eq("submission_id", data.submission_id);
    if (data.authors.length === 0) return { ok: true };
    const rows = data.authors.map((a, i) => ({
      submission_id: data.submission_id,
      full_name: a.full_name,
      email: a.email ?? null,
      institution: a.institution ?? null,
      department: a.department ?? null,
      country: a.country ?? null,
      orcid: a.orcid ?? null,
      academic_degree: a.academic_degree ?? null,
      phone: a.phone ?? null,
      institution_url: a.institution_url ? a.institution_url : null,
      scopus_url: a.scopus_url ? a.scopus_url : null,
      credit_roles: a.credit_roles ?? [],
      contributor_role: a.contributor_role,
      is_corresponding: a.is_corresponding,
      sort_order: a.sort_order ?? i,
    }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("submission_authors").insert(rows);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Declarations (owner-only structured responses) ----------
export const listDeclarations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => z.object({ submission_id: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rows, error } = await (supabase as any)
      .from("submission_declarations")
      .select("*")
      .eq("submission_id", data.submission_id);
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const upsertDeclaration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      submission_id: z.string().uuid(),
      declaration_key: z.enum(DECLARATION_KEYS),
      response_type: z.enum(["yes_no", "choice", "text"]),
      response_value: z.string().max(500).optional().nullable(),
      explanation: z.string().max(5000).optional().nullable(),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;
    const { data: before } = await sb
      .from("submission_declarations")
      .select("*")
      .eq("submission_id", data.submission_id)
      .eq("declaration_key", data.declaration_key)
      .maybeSingle();
    const { data: row, error } = await sb
      .from("submission_declarations")
      .upsert(
        {
          submission_id: data.submission_id,
          declaration_key: data.declaration_key,
          response_type: data.response_type,
          response_value: data.response_value ?? null,
          explanation: data.explanation ?? null,
        },
        { onConflict: "submission_id,declaration_key" },
      )
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    await sb.from("audit_logs").insert({
      actor_id: userId,
      action: before ? "declaration.updated" : "declaration.created",
      resource_type: "submission_declaration",
      resource_id: row.id,
      before: before ?? null,
      after: row,
    });
    return row;
  });

// ---------- Suggested reviewers ----------
const SuggestedReviewerSchema = z.object({
  full_name: z.string().min(1).max(200),
  email: z.string().email().max(200).optional().nullable().or(z.literal("")),
  institution: z.string().max(300).optional().nullable(),
  reason: z.string().max(1000).optional().nullable(),
});

export const listSuggestedReviewers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => z.object({ submission_id: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rows, error } = await (supabase as any)
      .from("submission_suggested_reviewers")
      .select("*")
      .eq("submission_id", data.submission_id)
      .order("sort_order");
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const replaceSuggestedReviewers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      submission_id: z.string().uuid(),
      reviewers: z.array(SuggestedReviewerSchema).max(10),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;
    await sb.from("submission_suggested_reviewers").delete().eq("submission_id", data.submission_id);
    if (data.reviewers.length === 0) return { ok: true };
    const rows = data.reviewers.map((r, i) => ({
      submission_id: data.submission_id,
      full_name: r.full_name,
      email: r.email ? r.email : null,
      institution: r.institution ?? null,
      reason: r.reason ?? null,
      sort_order: i,
    }));
    const { error } = await sb.from("submission_suggested_reviewers").insert(rows);
    if (error) throw new Error(error.message);
    return { ok: true };
  });


// ---------- List mine ----------
export const listMySubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("submissions")
      .select("id, manuscript_id, title, workflow_state, article_type, primary_language, submitted_at, created_at, updated_at")
      .eq("owner_id", userId)
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// ---------- Get by id (owner, assigned editor, or staff) ----------
export const getSubmission = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => z.object({ id: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;
    const [sub, authors, files, history, assignments, declarations, suggested] = await Promise.all([
      sb.from("submissions").select("*").eq("id", data.id).maybeSingle(),
      sb.from("submission_authors").select("*").eq("submission_id", data.id).order("sort_order"),
      sb.from("submission_files").select("*").eq("submission_id", data.id).order("uploaded_at", { ascending: false }),
      sb.from("submission_status_history").select("*").eq("submission_id", data.id).order("created_at", { ascending: false }),
      sb.from("submission_assignments").select("*").eq("submission_id", data.id).order("assigned_at", { ascending: false }),
      sb.from("submission_declarations").select("*").eq("submission_id", data.id),
      sb.from("submission_suggested_reviewers").select("*").eq("submission_id", data.id).order("sort_order"),
    ]);
    if (sub.error) throw new Error(sub.error.message);
    if (!sub.data) throw new Error("not_found");
    return {
      submission: sub.data,
      authors: authors.data ?? [],
      files: files.data ?? [],
      history: history.data ?? [],
      assignments: assignments.data ?? [],
      declarations: declarations.data ?? [],
      suggested_reviewers: suggested.data ?? [],
    };
  });

// ---------- Transition ----------
export const transitionSubmission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      id: z.string().uuid(),
      to_state: z.enum([
        "draft","submitted","screening","editor_assigned","under_review",
        "revision_requested","revised","accepted","rejected","withdrawn",
      ]),
      reason: z.string().max(2000).optional().nullable(),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: result, error } = await (supabase as any).rpc("transition_submission", {
      _submission_id: data.id,
      _to_state: data.to_state,
      _reason: data.reason ?? undefined,
      _payload: {},
    });
    if (error) throw new Error(error.message);
    return result;
  });

// ---------- File upload: generate signed upload URL ----------
export const requestFileUploadUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      submission_id: z.string().uuid(),
      filename: z.string().min(1).max(255),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    // Verify caller owns the submission and it's in an uploadable state
    const { data: sub, error: subErr } = await supabase
      .from("submissions")
      .select("id, owner_id, workflow_state")
      .eq("id", data.submission_id)
      .maybeSingle();
    if (subErr) throw new Error(subErr.message);
    if (!sub) throw new Error("not_found");
    if (sub.owner_id !== userId) throw new Error("permission_denied");
    if (!["draft", "submitted", "revision_requested"].includes(sub.workflow_state)) {
      throw new Error("submission_not_uploadable");
    }
    const safe = data.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${sub.id}/${Date.now()}_${safe}`;
    // Create a signed upload URL (client will PUT to it)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: signed, error: sErr } = await (supabase.storage.from("manuscripts") as any).createSignedUploadUrl(path);
    if (sErr) throw new Error(sErr.message);
    return { path, token: signed.token, signedUrl: signed.signedUrl as string };
  });

// ---------- Record uploaded file ----------
export const recordUploadedFile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      submission_id: z.string().uuid(),
      storage_path: z.string().min(1),
      filename: z.string().min(1).max(255),
      mime: z.string().max(200).optional(),
      size_bytes: z.number().int().nonnegative(),
      kind: z.enum(["manuscript","anonymous_manuscript","cover_letter","figure","table","supplementary","data","other"]).default("manuscript"),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: file, error } = await supabase
      .from("submission_files")
      .insert({
        submission_id: data.submission_id,
        storage_path: data.storage_path,
        filename: data.filename,
        mime: data.mime,
        size_bytes: data.size_bytes,
        kind: data.kind,
        uploaded_by: userId,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return file;
  });

// ---------- Remove file (draft only) ----------
export const removeFile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => z.object({ file_id: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: file, error: fErr } = await supabase
      .from("submission_files")
      .select("*, submissions!inner(owner_id, workflow_state)")
      .eq("id", data.file_id)
      .maybeSingle();
    if (fErr) throw new Error(fErr.message);
    if (!file) throw new Error("not_found");
    // RLS on delete already enforces draft + owner
    await supabase.storage.from("manuscripts").remove([file.storage_path]);
    const { error } = await supabase.from("submission_files").delete().eq("id", data.file_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Signed download URL ----------
export const getFileDownloadUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => z.object({ file_id: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    // RLS on the file row enforces authorization to see it. If the row is
    // visible, we can create a signed URL bound to storage RLS (same policies).
    const { data: file, error: fErr } = await supabase
      .from("submission_files")
      .select("storage_path, filename")
      .eq("id", data.file_id)
      .maybeSingle();
    if (fErr) throw new Error(fErr.message);
    if (!file) throw new Error("not_found");
    const { data: signed, error } = await supabase.storage
      .from("manuscripts")
      .createSignedUrl(file.storage_path, 60 * 10, { download: file.filename });
    if (error) throw new Error(error.message);
    return { url: signed.signedUrl, filename: file.filename };
  });
