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
      .select("user_id, roles!inner(key, name)")
      .in("roles.key", ["editor", "managing_editor", "administrator", "super_admin"]);
    if (error) throw new Error(error.message);
    const rows = (data ?? []) as Array<{ user_id: string; roles: { key: string; name: string } | null }>;
    const uids = Array.from(new Set(rows.map((r) => r.user_id)));
    let profMap: Record<string, { full_name: string | null; email: string | null }> = {};
    if (uids.length > 0) {
      const { data: profs } = await supabase.from("profiles").select("id, full_name, email").in("id", uids);
      profMap = Object.fromEntries((profs ?? []).map((p) => [p.id, { full_name: p.full_name, email: p.email }]));
    }
    const seen = new Map<string, { user_id: string; full_name: string; email: string; roles: string[] }>();
    rows.forEach((r) => {
      const uid = r.user_id;
      const role = r.roles?.name ?? "";
      const prof = profMap[uid];
      const prev = seen.get(uid);
      if (prev) {
        if (role && !prev.roles.includes(role)) prev.roles.push(role);
      } else {
        seen.set(uid, {
          user_id: uid,
          full_name: prof?.full_name || prof?.email || "—",
          email: prof?.email ?? "",
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

// ============= User & role management =============

async function requirePerm(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string,
  perm: string,
) {
  const { data, error } = await supabase.rpc("has_permission", { _user_id: userId, _permission_key: perm });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Sizda bu amal uchun ruxsat yo‘q");
}

export const adminListUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await requirePerm(supabase, userId, "users.view");

    const { data: profs, error: pErr } = await supabase
      .from("profiles")
      .select("id, full_name, email, institution_text, country, created_at")
      .order("created_at", { ascending: false });
    if (pErr) throw new Error(pErr.message);

    const { data: urs, error: rErr } = await supabase
      .from("user_roles")
      .select("user_id, granted_at, roles!inner(id, key, name)");
    if (rErr) throw new Error(rErr.message);

    const rolesByUser = new Map<string, Array<{ id: string; key: string; name: string; granted_at: string | null }>>();
    (urs ?? []).forEach((r) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const role = (r as any).roles;
      if (!role) return;
      const arr = rolesByUser.get(r.user_id) ?? [];
      arr.push({ id: role.id, key: role.key, name: role.name, granted_at: r.granted_at ?? null });
      rolesByUser.set(r.user_id, arr);
    });

    return (profs ?? []).map((p) => ({
      ...p,
      roles: rolesByUser.get(p.id) ?? [],
    }));
  });

export const adminListRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await requirePerm(supabase, userId, "roles.view");
    const { data, error } = await supabase.from("roles").select("id, key, name, description").order("name");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminGrantRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ user_id: z.string().uuid(), role_id: z.string().uuid() }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await requirePerm(supabase, userId, "users.assign_roles");

    // Prevent self-demotion? Allow but block removing your own super_admin only in revoke.
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: data.user_id, role_id: data.role_id, granted_by: userId });
    if (error && !/duplicate|unique/i.test(error.message)) throw new Error(error.message);

    await supabase.from("audit_logs").insert({
      actor_id: userId,
      action: "role.grant",
      resource_type: "user_role",
      resource_id: data.user_id,
      after: { role_id: data.role_id },
    });
    return { ok: true };
  });

export const adminRevokeRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ user_id: z.string().uuid(), role_id: z.string().uuid() }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await requirePerm(supabase, userId, "users.assign_roles");

    // Guard: don't allow removing the last super_admin
    const { data: role } = await supabase.from("roles").select("key").eq("id", data.role_id).maybeSingle();
    if (role?.key === "super_admin") {
      const { count } = await supabase
        .from("user_roles")
        .select("user_id", { count: "exact", head: true })
        .eq("role_id", data.role_id);
      if ((count ?? 0) <= 1) throw new Error("Oxirgi super administratorni olib bo‘lmaydi");
    }

    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", data.user_id)
      .eq("role_id", data.role_id);
    if (error) throw new Error(error.message);

    await supabase.from("audit_logs").insert({
      actor_id: userId,
      action: "role.revoke",
      resource_type: "user_role",
      resource_id: data.user_id,
      after: { role_id: data.role_id },
    });
    return { ok: true };
  });

