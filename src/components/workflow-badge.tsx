import { cn } from "@/lib/utils";
import { STATE_LABEL_UZ, STATE_TOKEN, type WorkflowState } from "@/lib/workflow";

export function WorkflowBadge({
  state,
  className,
}: {
  state: WorkflowState;
  className?: string;
}) {
  const token = STATE_TOKEN[state];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-rule-strong px-2.5 py-0.5",
        "font-mono text-[10px] uppercase tracking-widest text-ink-soft",
        className,
      )}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: `var(--${token})` }}
        aria-hidden
      />
      {STATE_LABEL_UZ[state]}
    </span>
  );
}
