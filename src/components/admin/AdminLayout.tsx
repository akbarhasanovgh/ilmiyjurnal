import type { ReactNode } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  LayoutDashboard,
  Inbox,
  ClipboardList,
  Users,
  History,
  Shield,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { getSessionContext } from "@/lib/auth.functions";

type NavItem = {
  title: string;
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  perm?: string;
  exact?: boolean;
};

const NAV: NavItem[] = [
  { title: "Umumiy ko‘rinish", url: "/admin", icon: LayoutDashboard, exact: true },
  { title: "Tahririyat qutisi", url: "/admin/inbox", icon: Inbox, perm: "submissions.view_all" },
  { title: "Foydalanuvchilar", url: "/admin/users", icon: Users, perm: "users.view" },
  { title: "Menga tayinlangan", url: "/editor/queue", icon: ClipboardList, perm: "submissions.view_assigned" },
  { title: "Audit jurnali", url: "/audit", icon: History, perm: "audit.view" },
];


interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function AdminLayout({ children, title, description, actions }: AdminLayoutProps) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const getCtx = useServerFn(getSessionContext);
  const { data: ctx, isPending } = useQuery({
    queryKey: ["session-context"],
    queryFn: () => getCtx(),
  });

  const perms = new Set(ctx?.permissions ?? []);
  const canAccessAdmin =
    perms.has("submissions.view_all") ||
    perms.has("users.view") ||
    perms.has("audit.view") ||
    perms.has("roles.manage");

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground text-sm">Yuklanmoqda…</div>
      </div>
    );
  }

  if (!canAccessAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md p-8">
          <Shield className="h-16 w-16 mx-auto mb-4 text-destructive" />
          <h1 className="text-2xl font-bold mb-2">Ruxsat yo‘q</h1>
          <p className="text-muted-foreground mb-6">
            Bu bo‘limga faqat tahririyat xodimlari kira oladi.
          </p>
          <Button asChild>
            <Link to="/">Bosh sahifaga qaytish</Link>
          </Button>
        </div>
      </div>
    );
  }

  const items = NAV.filter((n) => !n.perm || perms.has(n.perm));

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 border-r bg-card shrink-0 flex flex-col">
        <div className="p-4 border-b">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="text-sm">Saytga qaytish</span>
          </Link>
          <h1 className="text-xl font-bold mt-3 flex items-center gap-2 font-serif">
            <Shield className="h-5 w-5 text-primary" />
            Admin paneli
          </h1>
        </div>
        <ScrollArea className="flex-1">
          <nav className="p-3 space-y-1">
            {items.map((item) => {
              const active = pathname === item.url || pathname.startsWith(item.url + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.url}
                  to={item.url}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    active
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t space-y-3">
          {ctx?.profile ? (
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                {ctx.profile.full_name || ctx.profile.email}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {ctx.roles.map((r) => r.name).join(" · ") || "Muallif"}
              </p>
            </div>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Chiqish
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto min-w-0">
        <header className="border-b bg-card px-6 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-2xl font-semibold font-serif truncate">{title}</h2>
            {description ? (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex items-center gap-2 shrink-0">{actions}</div> : null}
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
