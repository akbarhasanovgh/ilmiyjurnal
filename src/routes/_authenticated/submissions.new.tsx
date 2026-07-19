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

  const start = async () => {
    try {
      const row = await create();
      navigate({ to: "/submissions/$id/edit", params: { id: row.id }, replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Qoralama yaratib bo‘lmadi");
    }
  };

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    void start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthorShell>
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-16">
        {error ? (
          <div className="rounded-3xl bg-[color:var(--page-elevated)] border border-rule p-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[color:var(--accent-oxblood)] text-page text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
              Xatolik
            </span>
            <p className="text-2xl font-semibold text-ink leading-snug">
              Qoralama yaratib bo‘lmadi
            </p>
            <p className="text-[14px] text-ink-soft mt-3 leading-relaxed">{error}</p>
            <button
              onClick={() => {
                firedRef.current = true;
                setError(null);
                void start();
              }}
              className="mt-6 inline-flex rounded-full bg-[color:var(--accent-oxblood)] text-page px-5 py-2.5 text-[13px] font-semibold hover:opacity-90 transition-opacity"
            >
              Qayta urinib ko‘rish
            </button>
          </div>
        ) : (
          <div className="rounded-3xl bg-[color:var(--surface-sunken)] p-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[color:var(--accent-oxblood)] text-page text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
              Yangi maqola
            </span>
            <p className="text-2xl font-semibold text-ink leading-snug">
              Qoralama tayyorlanmoqda…
            </p>
            <p className="text-[14px] text-ink-soft mt-3">
              Sizni topshirish shakliga o‘tkazamiz.
            </p>
            <div className="pt-8 space-y-3 animate-pulse">
              <div className="h-24 rounded-3xl bg-[color:var(--page-elevated)]" />
              <div className="h-24 rounded-3xl bg-[color:var(--page-elevated)]" />
            </div>
          </div>
        )}
      </div>
    </AuthorShell>
  );
}
