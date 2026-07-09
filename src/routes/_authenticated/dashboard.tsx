import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { EditorialShell } from "@/components/editorial-shell";
import { getSessionContext } from "@/lib/auth.functions";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Bosh panel — Tahririyat" }, { name: "robots", content: "noindex" }] }),
  component: Dashboard,
});

function Dashboard() {
  const getCtx = useServerFn(getSessionContext);
  const { data: ctx } = useQuery({ queryKey: ["session-context"], queryFn: () => getCtx() });

  const perms = new Set(ctx?.permissions ?? []);
  const isEditorial = perms.has("submissions.view_all") || perms.has("submissions.view_assigned");

  return (
    <EditorialShell>
      <div className="p-8 md:p-12 max-w-4xl space-y-10">
        <div>
          <p className="label-mono">Bosh panel</p>
          <h1 className="font-serif text-4xl leading-tight mt-2">
            Xush kelibsiz{ctx?.profile?.full_name ? `, ${ctx.profile.full_name}` : ""}
          </h1>
          <p className="text-sm text-ink-muted mt-3 max-w-lg">
            Bu yerdan yangi maqola topshirasiz, maqolalaringiz holatini kuzatasiz
            {isEditorial ? " va tahririyat vazifalaringizni bajarasiz" : ""}.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ActionCard
            to="/submissions/new"
            label="Yangi maqola topshirish"
            note="Besh bosqichli topshirish"
          />
          <ActionCard
            to="/submissions"
            label="Mening maqolalarim"
            note="Barcha topshirilgan ishlar"
          />
          {perms.has("submissions.view_all") && (
            <ActionCard
              to="/admin/inbox"
              label="Tahririyat qutisi"
              note="Yangi maqolalar va tayinlash"
            />
          )}
          {perms.has("submissions.view_assigned") && (
            <ActionCard
              to="/editor/queue"
              label="Menga tayinlangan"
              note="Muharrirlik vazifalarim"
            />
          )}
        </div>

        <div className="text-xs text-ink-faint">
          Rollar: {ctx?.roles?.length ? ctx.roles.map((r) => r.name).join(", ") : "Muallif"}
        </div>
      </div>
    </EditorialShell>
  );
}

function ActionCard({ to, label, note }: { to: string; label: string; note: string }) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Link to={to as any} className="border border-rule hover:border-rule-strong hover:bg-surface-sunken transition-colors p-6 group">
      <p className="font-serif text-lg leading-snug group-hover:text-ink">{label}</p>
      <p className="label-mono mt-3">{note} →</p>
    </Link>
  );
}
