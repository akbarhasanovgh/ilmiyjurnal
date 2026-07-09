import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// Inbox: submissions visible to staff with submissions.view_all
export const adminListInbox = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data: subs, error } = await supabase
      .from("submissions")
      .select("id, manuscript_id, title, workflow_state, article_type, submitted_at, created_at, updated_at, owner_id")
      .in("workflow_state", ["submitted", "screening", "editor_assigned", "under_review", "revision_requested", "revised"])
      .order("submitted_at", { ascending: false, nullsFirst: false });
    if (error) throw new Error(error.message);
    const rows = subs ?? [];
    const ownerIds = Array.from(new Set(rows.map((r) => r.owner_id).filter(Boolean)));
    let ownerMap: Record<string, { full_name: string | null; email: string | null }> = {};
    if (ownerIds.length > 0) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", ownerIds);
      ownerMap = Object.fromEntries((profs ?? []).map((p) => [p.id, { full_name: p.full_name, email: p.email }]));
    }
    return rows.map((r) => ({ ...r, owner: ownerMap[r.owner_id] ?? null }));
  });

// Users available to be assigned as editors — anyone with editor or higher role.
export const adminListEligibleEditors = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("user_roles")
      .select("user_id, roles!inner(key, name), profiles:user_id(full_name, email)")
      .in("roles.key", ["editor", "managing_editor", "administrator", "super_admin"]);
    if (error) throw new Error(error.message);
    const seen = new Map<string, { user_id: string; full_name: string; email: string; roles: string[] }>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data ?? []).forEach((r: any) => {
      const uid = r.user_id;
      const prev = seen.get(uid);
      const role = r.roles?.name ?? "";
      if (prev) {
        if (role && !prev.roles.includes(role)) prev.roles.push(role);
      } else {
        seen.set(uid, {
          user_id: uid,
          full_name: r.profiles?.full_name || r.profiles?.email || "—",
          email: r.profiles?.email ?? "",
          roles: role ? [role] : [],
        });
      }
    });
    return Array.from(seen.values());
  });

// Assign an editor (auto-transitions to editor_assigned)
export const adminAssignEditor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      submission_id: z.string().uuid(),
      editor_id: z.string().uuid(),
      deadline: z.string().optional().nullable(),
      instructions: z.string().max(2000).optional().nullable(),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).rpc("assign_editor", {
      _submission_id: data.submission_id,
      _editor_id: data.editor_id,
      _deadline: data.deadline || undefined,
      _instructions: data.instructions || undefined,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Editor's assigned queue
export const editorListMyQueue = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("submission_assignments")
      .select("id, submission_id, assigned_at, deadline, unassigned_at, submissions!inner(id, manuscript_id, title, workflow_state, article_type, submitted_at)")
      .eq("editor_id", userId)
      .is("unassigned_at", null)
      .order("assigned_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// Notifications
export const listMyNotifications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// Update profile
export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({
      full_name: z.string().max(200),
      orcid: z.string().max(30).optional().nullable(),
      institution_text: z.string().max(300).optional().nullable(),
      department: z.string().max(200).optional().nullable(),
      academic_degree: z.string().max(120).optional().nullable(),
      country: z.string().max(80).optional().nullable(),
    }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: updated, error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", userId)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return updated;
  });
