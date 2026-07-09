import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getSessionContext } from "@/lib/auth.functions";
import { cn } from "@/lib/utils";

export function EditorialShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const getCtx = useServerFn(getSessionContext);
  const { data: ctx } = useQuery({
    queryKey: ["session-context"],
    queryFn: () => getCtx(),
  });

  const perms = useMemo(() => new Set(ctx?.permissions ?? []), [ctx]);
  const canReview = perms.has("submissions.view_assigned");

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  // Author-side navigation only. Admin/staff users get the AdminLayout.
  const nav = [
    { to: "/dashboard", label: "Bosh panel" },
    { to: "/submissions", label: "Mening maqolalarim" },
    ...(canReview ? [{ to: "/editor/queue", label: "Menga tayinlangan" }] : []),
    { to: "/settings/profile", label: "Profil" },
  ];


  return (
    <div className="min-h-dvh bg-page text-ink grid grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="border-r border-rule md:sticky md:top-0 md:h-dvh flex flex-col">
        <Link to="/" className="p-6 border-b border-rule block">
          <p className="label-mono">O‘T va A</p>
          <p className="font-serif text-lg leading-tight mt-1">Tahririyat</p>
        </Link>
        <nav className="flex-1 py-4 overflow-y-auto">
          {nav.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "block px-6 py-2 text-sm transition-colors",
                  active
                    ? "text-ink font-medium border-l-2 border-ink -ml-px pl-[calc(1.5rem-1px)]"
                    : "text-ink-muted hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-6 border-t border-rule space-y-3">
          {ctx?.profile ? (
            <div className="space-y-0.5">
              <p className="text-xs font-medium truncate">{ctx.profile.full_name || ctx.profile.email}</p>
              <p className="label-mono truncate">{ctx.roles.map((r) => r.name).join(" · ") || "Muallif"}</p>
            </div>
          ) : null}
          <button
            onClick={signOut}
            className="w-full text-left label-mono hover:text-ink transition-colors"
          >
            Chiqish →
          </button>
        </div>
      </aside>
      <div className="flex flex-col min-w-0">{children}</div>
    </div>
  );
}
