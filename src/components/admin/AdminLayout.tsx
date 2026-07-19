import type { ReactNode } from "react";
import { useState } from "react";
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
  BookOpen,
  Hash,
  BarChart3,
  FileBarChart,
  Wrench,
  Menu,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { getSessionContext } from "@/lib/auth.functions";

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  perm?: string;
  exact?: boolean;
};

type NavSection = { label: string | null; items: NavItem[] };

const SECTIONS: NavSection[] = [
  {
    label: null,
    items: [
      { title: "Umumiy ko‘rinish", url: "/admin", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "Tahririyat",
    items: [
      { title: "Qabul qutisi", url: "/admin/inbox", icon: Inbox, perm: "submissions.view_all" },
      { title: "Menga tayinlangan", url: "/editor/queue", icon: ClipboardList, perm: "submissions.view_assigned" },
      { title: "Sonlar", url: "/admin/issues", icon: BookOpen, perm: "submissions.view_all" },
      { title: "DOI’lar", url: "/admin/dois", icon: Hash, perm: "submissions.view_all" },
    ],
  },
  {
    label: "Statistika",
    items: [
      { title: "Statistika", url: "/admin/statistics", icon: BarChart3, perm: "submissions.view_all" },
      { title: "Hisobotlar", url: "/admin/reports", icon: FileBarChart, perm: "submissions.view_all" },
    ],
  },
  {
    label: "Boshqaruv",
    items: [
      { title: "Foydalanuvchilar", url: "/admin/users", icon: Users, perm: "users.view" },
      { title: "Audit jurnali", url: "/audit", icon: History, perm: "audit.view" },
      { title: "Vositalar", url: "/admin/tools", icon: Wrench, perm: "roles.manage" },
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
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--page)]">
        <div className="animate-pulse text-ink-muted text-sm">Yuklanmoqda…</div>
      </div>
    );
  }

  if (!canAccessAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--page)] p-6">
        <div className="text-center max-w-md p-10 rounded-3xl bg-page-elevated border border-rule shadow-sm animate-scale-in">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-accent-oxblood-soft flex items-center justify-center">
            <Shield className="h-7 w-7 text-accent-oxblood" />
          </div>
          <h1 className="text-2xl font-serif mb-2 tracking-tight text-ink">Ruxsat yo‘q</h1>
          <p className="text-ink-muted mb-6 text-[15px]">
            Bu bo‘limga faqat tahririyat xodimlari kira oladi.
          </p>
          <Button asChild size="lg" className="rounded-full h-11 px-6 bg-accent-oxblood hover:bg-accent-oxblood-strong text-white">
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
    const Icon = item.icon;
    return (
      <Link
        key={item.url}
        to={item.url}
        className={cn(
          "group relative flex items-center gap-3 rounded-2xl px-2.5 py-2 mx-1 transition-all duration-200 ease-out active:scale-[0.97]",
          active
            ? "bg-page-elevated shadow-[0_1px_2px_rgba(20,20,20,0.04),0_4px_12px_-4px_rgba(20,20,20,0.08)]"
            : "hover:bg-page-elevated/60",
        )}
      >
        <div
          className={cn(
            "w-9 h-9 shrink-0 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-active:scale-95",
            active ? "bg-accent-oxblood-soft" : "bg-[color:var(--rule)]",
          )}
        >
          <Icon
            className={cn("h-[18px] w-[18px]", active ? "text-accent-oxblood" : "text-ink-soft")}
            strokeWidth={2.2}
          />
        </div>
        <span
          className={cn(
            "text-[14.5px] tracking-tight truncate",
            active ? "font-semibold text-ink" : "font-medium text-ink-muted group-hover:text-ink",
          )}
        >
          {item.title}
        </span>
      </Link>
    );
  };

  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarBody = (
    <div className="flex-1 flex flex-col rounded-3xl bg-[color:var(--page)] border border-rule shadow-sm overflow-hidden">
      <div className="p-4 pb-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink transition-colors rounded-full px-2 py-1 -ml-2 hover:bg-page-elevated"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Saytga qaytish
        </Link>
      </div>

      <ScrollArea className="flex-1 px-2">
        <nav className="py-2 space-y-4" onClick={() => setMobileOpen(false)}>
          {SECTIONS.map((section, idx) => {
            const items = section.items.filter((n) => !n.perm || perms.has(n.perm));
            if (items.length === 0) return null;
            return (
              <div key={idx}>
                {section.label ? (
                  <p className="px-3 mb-1 text-[10.5px] font-semibold tracking-[0.08em] uppercase text-ink-faint">
                    {section.label}
                  </p>
                ) : null}
                <div className="space-y-0.5">{items.map(renderItem)}</div>
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-3 border-t border-rule mt-2">
        {ctx?.profile ? (
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-2xl">
            <div className="w-9 h-9 rounded-full bg-accent-oxblood-soft flex items-center justify-center text-[13px] font-semibold text-accent-oxblood shrink-0">
              {(ctx.profile.full_name || ctx.profile.email || "?").trim().charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium truncate leading-tight text-ink">
                {ctx.profile.full_name || ctx.profile.email}
              </p>
              <p className="text-[11px] text-ink-muted truncate leading-tight">
                {ctx.roles.map((r) => r.name).join(" · ") || "Muallif"}
              </p>
            </div>
          </div>
        ) : null}
        <Button
          variant="ghost"
          onClick={signOut}
          className="w-full justify-start gap-2 h-10 rounded-2xl text-ink-muted hover:text-ink hover:bg-page-elevated mt-1 text-[13.5px]"
        >
          <LogOut className="h-4 w-4" />
          Chiqish
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:flex bg-[color:var(--page)]">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 bg-page-elevated/90 backdrop-blur border-b border-rule">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button aria-label="Menyu" className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-[color:var(--rule)] text-ink hover:bg-page-elevated transition-colors">
              <Menu className="h-[18px] w-[18px]" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(86vw,300px)] p-3 bg-[color:var(--page)] border-r border-rule">
            <SheetTitle className="sr-only">Admin menyu</SheetTitle>
            <SheetClose className="sr-only">Yopish</SheetClose>
            <div className="flex flex-col h-full">{sidebarBody}</div>
          </SheetContent>
        </Sheet>
        <p className="font-serif text-[16px] tracking-tight text-ink truncate">{title}</p>
      </div>

      <aside className="hidden lg:flex w-[260px] shrink-0 flex-col p-3 sticky top-0 h-screen">
        {sidebarBody}
      </aside>

      <main className="flex-1 min-w-0 p-3 lg:py-3 lg:pr-3 lg:pl-0">
        <div className="rounded-3xl bg-page-elevated border border-rule shadow-sm min-h-[calc(100vh-1.5rem)] overflow-hidden">
          <header className="px-5 sm:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 border-b border-rule">
            <div className="min-w-0">
              <h2 className="text-[22px] sm:text-[28px] font-serif tracking-tight leading-tight text-ink">{title}</h2>
              {description ? (
                <p className="text-[14px] sm:text-[15px] text-ink-muted mt-1.5 max-w-2xl">{description}</p>
              ) : null}
            </div>
            {actions ? <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap sm:shrink-0">{actions}</div> : null}
          </header>
          <div className="px-5 sm:px-8 py-6 sm:py-8 animate-fade-in">{children}</div>
        </div>
      </main>
    </div>
  );
}
