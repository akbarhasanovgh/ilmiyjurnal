import type { ReactNode } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Home,
  FilePlus2,
  FileText,
  BookMarked,
  ClipboardList,
  LogOut,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
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

const NAV: NavItem[] = [
  { title: "Bosh sahifa", url: "/dashboard", icon: Home, exact: true },
  { title: "Yangi maqola", url: "/submissions/new", icon: FilePlus2 },
  { title: "Mening maqolalarim", url: "/submissions", icon: FileText, exact: true },
  { title: "Arxivni ko‘rish", url: "/arxiv", icon: BookMarked },
  { title: "Menga tayinlangan", url: "/editor/queue", icon: ClipboardList, perm: "submissions.view_assigned" },
];

interface AuthorShellProps {
  children: ReactNode;
}

export function AuthorShell({ children }: AuthorShellProps) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const getCtx = useServerFn(getSessionContext);
  const { data: ctx } = useQuery({
    queryKey: ["session-context"],
    queryFn: () => getCtx(),
  });

  const perms = new Set(ctx?.permissions ?? []);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const renderItem = (item: NavItem) => {
    const active = item.exact
      ? pathname === item.url
      : pathname === item.url || pathname.startsWith(item.url + "/");
    const Icon = item.icon;
    return (
      <Link
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        key={item.url} to={item.url as any}
        className={cn(
          "group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 mx-1 transition-all duration-200 ease-out active:scale-[0.97]",
          active
            ? "bg-background shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]"
            : "hover:bg-background/60",
        )}
      >
        <Icon
          className={cn(
            "h-[18px] w-[18px] shrink-0 transition-colors",
            active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
          )}
          strokeWidth={active ? 2.2 : 1.8}
        />
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

  const displayName = ctx?.profile?.full_name || ctx?.profile?.email || "";
  const initial = (displayName || "?").trim().charAt(0).toUpperCase();
  const roleLabel = ctx?.roles?.length ? ctx.roles.map((r) => r.name).join(" · ") : "Muallif";

  return (
    <div className="min-h-screen flex bg-muted/40">
      <aside className="w-[260px] shrink-0 flex flex-col p-3 sticky top-0 h-screen">
        <div className="flex-1 flex flex-col rounded-3xl bg-card/70 backdrop-blur border border-border/60 shadow-sm overflow-hidden">
          <Link to="/" className="p-5 pb-4 block border-b border-border/60 hover:bg-muted/40 transition-colors">
            <p className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-muted-foreground">
              O‘T va A
            </p>
            <p className="font-serif text-[17px] leading-tight mt-1 text-foreground">Tahririyat</p>
          </Link>

          <ScrollArea className="flex-1 px-2">
            <nav className="py-3 space-y-0.5">
              {NAV.filter((n) => !n.perm || perms.has(n.perm)).map(renderItem)}
            </nav>
          </ScrollArea>

          <div className="p-2 border-t border-border/60">
            <div className="flex items-center gap-2">
              <Link
                to="/settings/profile"
                className="flex items-center gap-2.5 flex-1 min-w-0 px-2 py-2 rounded-2xl hover:bg-background/60 transition-colors group"
              >
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-[13px] font-semibold text-foreground shrink-0 border border-border/60">
                  {initial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium truncate leading-tight text-foreground">
                    {displayName || "Foydalanuvchi"}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
                    {roleLabel}
                  </p>
                </div>
                <Settings className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <button
                onClick={signOut}
                aria-label="Chiqish"
                className="w-9 h-9 rounded-2xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/60 transition-colors active:scale-[0.94]"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 py-3 pr-3">
        <div className="rounded-3xl bg-card border border-border/60 shadow-sm min-h-[calc(100vh-1.5rem)] overflow-hidden animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
