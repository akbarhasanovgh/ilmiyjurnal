import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

interface ComingSoonProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  items?: string[];
}

export function ComingSoon({
  icon: Icon = Sparkles,
  title = "Tez orada",
  description = "Bu bo‘lim ishlab chiqilmoqda.",
  items,
}: ComingSoonProps) {
  return (
    <div className="rounded-3xl border border-dashed border-border/70 bg-muted/30 p-10 text-center animate-fade-in">
      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-background flex items-center justify-center shadow-sm">
        <Icon className="h-6 w-6 text-muted-foreground" strokeWidth={2} />
      </div>
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      <p className="text-muted-foreground mt-1.5 text-[15px] max-w-md mx-auto">{description}</p>
      {items && items.length > 0 ? (
        <ul className="mt-6 grid gap-2 max-w-sm mx-auto text-left">
          {items.map((it) => (
            <li
              key={it}
              className="text-sm text-muted-foreground bg-background/70 rounded-xl px-4 py-2.5 border border-border/50"
            >
              {it}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
