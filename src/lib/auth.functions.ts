import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Session snapshot for the current user: profile + roles + permission keys.
 * The client uses this to gate UI. The server always re-checks on every mutation.
 */
export const getSessionContext = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const [profileRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase
        .from("user_roles")
        .select("roles!inner(key, name, role_permissions(permissions(key)))")
        .eq("user_id", userId),
    ]);

    const roles: { key: string; name: string }[] = [];
    const permKeys = new Set<string>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (rolesRes.data ?? []).forEach((row: any) => {
      const r = row.roles;
      if (!r) return;
      roles.push({ key: r.key, name: r.name });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (r.role_permissions ?? []).forEach((rp: any) => {
        if (rp?.permissions?.key) permKeys.add(rp.permissions.key);
      });
    });

    return {
      userId,
      profile: profileRes.data,
      roles,
      permissions: Array.from(permKeys),
    };
  });

/** Check whether any super_admin exists — used by the bootstrap page. */
export const bootstrapStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { count, error } = await supabaseAdmin
    .from("user_roles")
    .select("user_id, roles!inner(key)", { count: "exact", head: true })
    .eq("roles.key", "super_admin");
  if (error) throw new Error(error.message);
  return { superAdminExists: (count ?? 0) > 0 };
});

/**
 * One-time bootstrap. Requires authenticated user + valid token that matches
 * SUPERADMIN_BOOTSTRAP_TOKEN. DB function refuses if a super_admin already exists.
 */
export const bootstrapSuperAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { token: string }) => {
    if (!input?.token || typeof input.token !== "string") throw new Error("Token required");
    return input;
  })
  .handler(async ({ data, context }) => {
    const expected = process.env.SUPERADMIN_BOOTSTRAP_TOKEN;
    if (!expected) throw new Error("Bootstrap not configured");
    const { data: ok, error } = await context.supabase.rpc("bootstrap_super_admin", {
      _provided_token: data.token,
      _expected_token: expected,
    });
    if (error) throw new Error(error.message);
    return { ok: !!ok };
  });
