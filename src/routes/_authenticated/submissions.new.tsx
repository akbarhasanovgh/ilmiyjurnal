import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { AuthorShell } from "@/components/author-shell";
import { createDraftSubmission } from "@/lib/submissions.functions";

export const Route = createFileRoute("/_authenticated/submissions/new")({
  head: () => ({ meta: [{ title: "Yangi maqola" }, { name: "robots", content: "noindex" }] }),
  component: NewSubmission,
});

function NewSubmission() {
  const navigate = useNavigate();
  const create = useServerFn(createDraftSubmission);
  const firedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    (async () => {
      try {
        const row = await create();
        navigate({ to: "/submissions/$id/edit", params: { id: row.id }, replace: true });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Qoralama yaratib bo‘lmadi");
      }
    })();
  }, [create, navigate]);

  return (
    <AuthorShell>
      <div className="px-10 md:px-14 py-16 max-w-2xl">
        {error ? (
          <div className="space-y-4">
            <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-muted-foreground">
              Xatolik
            </p>
            <p className="font-serif text-[22px] leading-snug text-foreground">
              Qoralama yaratib bo‘lmadi
            </p>
            <p className="text-[13.5px] text-muted-foreground">{error}</p>
            <button
              onClick={() => {
                firedRef.current = false;
                setError(null);
                // Trigger effect again via state change
                setError((s) => s);
                (async () => {
                  firedRef.current = true;
                  try {
                    const row = await create();
                    navigate({ to: "/submissions/$id/edit", params: { id: row.id }, replace: true });
                  } catch (e) {
                    setError(e instanceof Error ? e.message : "Qoralama yaratib bo‘lmadi");
                  }
                })();
              }}
              className="inline-flex rounded-full bg-foreground text-background px-5 py-2.5 text-[13.5px] font-medium hover:opacity-90 transition-opacity"
            >
              Qayta urinib ko‘rish
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-pulse">
            <div className="h-3 w-32 rounded bg-muted" />
            <div className="h-8 w-2/3 rounded bg-muted" />
            <div className="h-3 w-1/2 rounded bg-muted" />
            <div className="pt-6 space-y-3">
              <div className="h-24 rounded-2xl bg-muted/60" />
              <div className="h-24 rounded-2xl bg-muted/60" />
            </div>
          </div>
        )}
      </div>
    </AuthorShell>
  );
}
