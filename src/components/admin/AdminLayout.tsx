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
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { getSessionContext } from "@/lib/auth.functions";

type ToneKey = "indigo" | "cyan" | "amber" | "green" | "rose" | "violet";

const TONE: Record<ToneKey, { bg: string; icon: string; active: string }> = {
  indigo: { bg: "bg-indigo-500/10", icon: "text-indigo-500", active: "bg-indigo-500/15" },
  cyan: { bg: "bg-sky-500/10", icon: "text-sky-500", active: "bg-sky-500/15" },
  amber: { bg: "bg-amber-500/10", icon: "text-amber-500", active: "bg-amber-500/15" },
  green: { bg: "bg-emerald-500/10", icon: "text-emerald-500", active: "bg-emerald-500/15" },
  rose: { bg: "bg-rose-500/10", icon: "text-rose-500", active: "bg-rose-500/15" },
  violet: { bg: "bg-violet-500/10", icon: "text-violet-500", active: "bg-violet-500/15" },
};

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  tone: ToneKey;
  perm?: string;
  exact?: boolean;
};

type NavSection = { label: string | null; items: NavItem[] };

const SECTIONS: NavSection[] = [
  {
    label: null,
    items: [
      { title: "Umumiy ko‘rinish", url: "/admin", icon: LayoutDashboard, tone: "indigo", exact: true },
    ],
  },
  {
    label: "Tahririyat",
    items: [
      { title: "Qabul qutisi", url: "/admin/inbox", icon: Inbox, tone: "amber", perm: "submissions.view_all" },
      { title: "Menga tayinlangan", url: "/editor/queue", icon: ClipboardList, tone: "green", perm: "submissions.view_assigned" },
    ],
  },
  {
    label: "Boshqaruv",
    items: [
      { title: "Foydalanuvchilar", url: "/admin/users", icon: Users, tone: "violet", perm: "users.view" },
      { title: "Audit jurnali", url: "/audit", icon: History, tone: "rose", perm: "audit.view" },
    ],
  },
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
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="animate-pulse text-muted-foreground text-sm">Yuklanmoqda…</div>
      </div>
    );
  }

  if (!canAccessAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
        <div className="text-center max-w-md p-10 rounded-3xl bg-card border shadow-sm animate-scale-in">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <Shield className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="text-2xl font-semibold mb-2 tracking-tight">Ruxsat yo‘q</h1>
          <p className="text-muted-foreground mb-6 text-[15px]">
            Bu bo‘limga faqat tahririyat xodimlari kira oladi.
          </p>
          <Button asChild size="lg" className="rounded-full h-11 px-6">
            <Link to="/">Bosh sahifaga qaytish</Link>
          </Button>
        </div>
      </div>
    );
  }

  const renderItem = (item: NavItem) => {
    const active = item.exact
      ? pathname === item.url
      : pathname === item.url || pathname.startsWith(item.url + "/");
    const tone = TONE[item.tone];
    const Icon = item.icon;
    return (
      <Link
        key={item.url}
        to={item.url}
        className={cn(
          "group relative flex items-center gap-3 rounded-2xl px-2.5 py-2 mx-1 transition-all duration-200 ease-out active:scale-[0.97]",
          active
            ? "bg-background shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]"
            : "hover:bg-background/60",
        )}
      >
        <div
          className={cn(
            "w-9 h-9 shrink-0 rounded-xl flex items-center justify-center transition-all duration-200",
            active ? tone.active : tone.bg,
            "group-hover:scale-105 group-active:scale-95",
          )}
        >
          <Icon className={cn("h-[18px] w-[18px]", tone.icon)} strokeWidth={2.2} />
        </div>
        <span
          className={cn(
            "text-[14.5px] tracking-tight truncate",
            active ? "font-semibold text-foreground" : "font-medium text-muted-foreground group-hover:text-foreground",
          )}
        >
          {item.title}
        </span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-muted/40">
      <aside className="w-[260px] shrink-0 flex flex-col p-3">
        <div className="flex-1 flex flex-col rounded-3xl bg-card/70 backdrop-blur border border-border/60 shadow-sm overflow-hidden">
          <div className="p-4 pb-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-full px-2 py-1 -ml-2 hover:bg-muted"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Saytga qaytish
            </Link>
          </div>

          <ScrollArea className="flex-1 px-2">
            <nav className="py-2 space-y-4">
              {SECTIONS.map((section, idx) => {
                const items = section.items.filter((n) => !n.perm || perms.has(n.perm));
                if (items.length === 0) return null;
                return (
                  <div key={idx}>
                    {section.label ? (
                      <p className="px-3 mb-1 text-[10.5px] font-semibold tracking-[0.08em] uppercase text-muted-foreground/60">
                        {section.label}
                      </p>
                    ) : null}
                    <div className="space-y-0.5">{items.map(renderItem)}</div>
                  </div>
                );
              })}
            </nav>
          </ScrollArea>

          <div className="p-3 border-t border-border/60 mt-2">
            {ctx?.profile ? (
              <div className="flex items-center gap-2.5 px-2 py-2 rounded-2xl">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-[13px] font-semibold text-primary shrink-0">
                  {(ctx.profile.full_name || ctx.profile.email || "?").trim().charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium truncate leading-tight">
                    {ctx.profile.full_name || ctx.profile.email}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate leading-tight">
                    {ctx.roles.map((r) => r.name).join(" · ") || "Muallif"}
                  </p>
                </div>
              </div>
            ) : null}
            <Button
              variant="ghost"
              onClick={signOut}
              className="w-full justify-start gap-2 h-10 rounded-2xl text-muted-foreground hover:text-foreground mt-1 text-[13.5px]"
            >
              <LogOut className="h-4 w-4" />
              Chiqish
            </Button>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 py-3 pr-3">
        <div className="rounded-3xl bg-card border border-border/60 shadow-sm min-h-[calc(100vh-1.5rem)] overflow-hidden">
          <header className="px-8 pt-8 pb-6 flex items-start justify-between gap-6">
            <div className="min-w-0">
              <h2 className="text-[28px] font-semibold font-serif tracking-tight leading-tight">{title}</h2>
              {description ? (
                <p className="text-[15px] text-muted-foreground mt-1.5 max-w-2xl">{description}</p>
              ) : null}
            </div>
            {actions ? <div className="flex items-center gap-2 shrink-0">{actions}</div> : null}
          </header>
          <div className="px-8 pb-8 animate-fade-in">{children}</div>
        </div>
      </main>
    </div>
  );
}
