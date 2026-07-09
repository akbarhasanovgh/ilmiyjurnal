import { createFileRoute, Link, useNavigate, useSearch, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import authEnsemble from "@/assets/auth-ensemble.png";

const searchSchema = z.object({ next: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Kirish — O‘zbek tili va adabiyoti" },
      { name: "description", content: "Tahririyat tizimiga kirish yoki ro‘yxatdan o‘tish." },
    ],
  }),
  beforeLoad: async ({ search }) => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      throw redirect({ to: sanitizeNext(search.next) });
    }
  },
  component: AuthPage,
});

function sanitizeNext(next?: string): "/dashboard" | "/submissions" {
  if (!next) return "/dashboard";
  try {
    const url = new URL(next, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    if (url.origin !== (typeof window !== "undefined" ? window.location.origin : url.origin)) return "/dashboard";
    if (url.pathname.startsWith("/submissions")) return "/submissions";
    return "/dashboard";
  } catch {
    return "/dashboard";
  }
}

function AuthPage() {
  const search = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate({ to: sanitizeNext(search.next), replace: true });
      }
    });
    return () => data.subscription.unsubscribe();
  }, [navigate, search.next]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("Ro‘yxatdan o‘tildi. Emailingizni tekshiring.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) toast.error(result.error.message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google orqali kirishda xatolik");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-page text-ink grid md:grid-cols-2">
      <aside className="hidden md:block relative overflow-hidden border-r border-rule bg-page">
        <img
          src={authEnsemble}
          alt="Uzbek scholars and writers — pencil ensemble portrait"
          className="absolute inset-0 w-full h-full object-cover object-center select-none"
          draggable={false}
        />
        {/* Corner marks: publication signature + year, kept minimal so the drawing dominates */}
        <div className="absolute top-8 left-8 z-10">
          <Link to="/" className="block">
            <p className="label-mono">ISSN 2010-5584</p>
          </Link>
        </div>
        <div className="absolute bottom-8 left-8 right-8 z-10 flex items-end justify-between gap-6">
          <p className="label-mono">Tahririyat · 2026</p>
          <p className="label-mono text-right">O‘zbek tili<br/>va adabiyoti</p>
        </div>
      </aside>

          Tahririyat, 2026
        </p>
      </aside>

      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <p className="label-mono">{mode === "signin" ? "Kirish" : "Ro‘yxatdan o‘tish"}</p>
            <h2 className="font-serif text-3xl leading-tight">
              {mode === "signin" ? "Hisobingizga kiring" : "Yangi hisob yarating"}
            </h2>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <Field label="To‘liq ism-sharif">
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input"
                  autoComplete="name"
                />
              </Field>
            )}
            <Field label="Email">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                autoComplete="email"
              />
            </Field>
            <Field label="Parol">
              <input
                required
                type="password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
              />
            </Field>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-sm bg-ink text-page py-2.5 text-sm font-medium ring-1 ring-ink hover:bg-ink-soft transition-colors disabled:opacity-50"
            >
              {loading ? "..." : mode === "signin" ? "Kirish" : "Ro‘yxatdan o‘tish"}
            </button>
          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-rule" />
            <span className="label-mono">yoki</span>
            <div className="flex-1 h-px bg-rule" />
          </div>

          <button
            onClick={google}
            disabled={loading}
            type="button"
            className="w-full rounded-sm border border-rule-strong bg-page py-2.5 text-sm font-medium hover:bg-surface-sunken transition-colors disabled:opacity-50"
          >
            Google orqali {mode === "signin" ? "kirish" : "davom etish"}
          </button>

          <p className="text-sm text-ink-muted text-center">
            {mode === "signin" ? "Hisobingiz yo‘qmi? " : "Hisobingiz bormi? "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="underline underline-offset-2 hover:text-ink"
            >
              {mode === "signin" ? "Ro‘yxatdan o‘ting" : "Kirish"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="label-mono block">{label}</span>
      {children}
    </label>
  );
}
