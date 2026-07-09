import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  bootstrapStatus,
  bootstrapSuperAdmin,
} from "@/lib/auth.functions";

export const Route = createFileRoute("/bootstrap")({
  head: () => ({ meta: [{ name: "robots", content: "noindex" }, { title: "Tizimni ishga tushirish" }] }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/auth", search: { next: "/bootstrap" } });
  },
  component: BootstrapPage,
});

function BootstrapPage() {
  const status = useServerFn(bootstrapStatus);
  const boot = useServerFn(bootstrapSuperAdmin);
  const navigate = useNavigate();
  const [token, setToken] = useState("");

  const q = useQuery({ queryKey: ["bootstrap-status"], queryFn: () => status() });
  const m = useMutation({
    mutationFn: (t: string) => boot({ data: { token: t } }),
    onSuccess: () => {
      toast.success("Super administrator huquqi berildi");
      navigate({ to: "/dashboard" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="min-h-dvh bg-page text-ink flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-8">
        <div>
          <p className="label-mono">Bir martalik</p>
          <h1 className="font-serif text-3xl leading-tight mt-2">
            Super administratorni tayinlash
          </h1>
          <p className="text-sm text-ink-muted mt-3 leading-relaxed">
            Tizim birinchi marta ishga tushirilmoqda. Muhitdagi{" "}
            <code className="font-mono text-xs bg-surface-sunken px-1 py-0.5 rounded-sm">
              SUPERADMIN_BOOTSTRAP_TOKEN
            </code>{" "}
            qiymatini kiritib, hozirgi hisobingizga super administrator huquqini
            bering. Ushbu amal faqat bir marta bajariladi.
          </p>
        </div>

        {q.data?.superAdminExists ? (
          <div className="border border-rule-strong bg-surface-sunken rounded-sm p-6 space-y-3">
            <p className="label-mono">Bajarildi</p>
            <p className="text-sm">
              Super administrator allaqachon mavjud. Ushbu sahifa endi ishlamaydi.
            </p>
            <Link to="/dashboard" className="inline-block text-sm underline underline-offset-2">
              Bosh panelga →
            </Link>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (token.length < 16) return toast.error("Token juda qisqa");
              m.mutate(token);
            }}
            className="space-y-4"
          >
            <label className="block space-y-1.5">
              <span className="label-mono block">Bootstrap token</span>
              <input
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                autoComplete="off"
                className="input font-mono text-xs"
                placeholder="SUPERADMIN_BOOTSTRAP_TOKEN"
              />
            </label>
            <button
              type="submit"
              disabled={m.isPending}
              className="w-full rounded-sm bg-ink text-page py-2.5 text-sm font-medium ring-1 ring-ink hover:bg-ink-soft transition-colors disabled:opacity-50"
            >
              {m.isPending ? "..." : "Super administrator huquqini olish"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
