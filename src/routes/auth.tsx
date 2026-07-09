import { createFileRoute, Link, useNavigate, useSearch, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import authPortrait from "@/assets/auth-portrait.png";
import authPortrait2 from "@/assets/auth-portrait-2.png";
import authPortrait3 from "@/assets/auth-portrait-3.png";
import authPortrait4 from "@/assets/auth-portrait-4.png";
import authPortrait5 from "@/assets/auth-portrait-5.png";

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
      <aside className="hidden md:flex flex-col justify-between p-12 border-r border-rule">
      <aside className="hidden md:flex flex-col justify-between p-12 border-r border-rule relative overflow-hidden">
        <Link to="/" className="space-y-2 relative z-10">
          <p className="label-mono">ISSN 2010-5584</p>
          <h1 className="font-serif text-3xl leading-tight tracking-tight">O‘zbek tili va adabiyoti</h1>
        </Link>

        <div className="max-w-md space-y-6 relative z-10">
          <p className="font-serif text-2xl leading-snug text-ink">
            «Til — millatning ruhi, adabiyot — uning ongi.»
          </p>
          <p className="text-sm text-ink-muted leading-relaxed">
            O‘zbek filologiyasi va adabiyotshunosligi an’analarini davom
            ettiruvchi olimlar va yozuvchilar mavrosida.
          </p>
        </div>

        {/* Portrait frieze — gaze directed toward the center */}
        <div
          aria-hidden
          className="pointer-events-none select-none absolute inset-x-0 bottom-0 flex items-end justify-between px-6 opacity-90"
        >
          {/* Leftmost: turban scholar looking right → toward center */}
          <img
            src={authPortrait2}
            alt=""
            className="w-32 lg:w-40 h-auto -mb-4 [mask-image:linear-gradient(to_bottom,black_70%,transparent)]"
            draggable={false}
          />
          {/* Older man, nearly forward */}
          <img
            src={authPortrait5}
            alt=""
            className="w-28 lg:w-36 h-auto -mb-6 [mask-image:linear-gradient(to_bottom,black_70%,transparent)]"
            draggable={false}
          />
          {/* Center: young scholar with round glasses, forward */}
          <img
            src={authPortrait}
            alt=""
            className="w-32 lg:w-44 h-auto -mb-2 [mask-image:linear-gradient(to_bottom,black_72%,transparent)]"
            draggable={false}
          />
          {/* Qodiriy, gaze slightly left → toward center */}
          <img
            src={authPortrait3}
            alt=""
            className="w-28 lg:w-36 h-auto -mb-6 [mask-image:linear-gradient(to_bottom,black_70%,transparent)]"
            draggable={false}
          />
          {/* Rightmost: brown-suit scholar looking left → toward center */}
          <img
            src={authPortrait4}
            alt=""
            className="w-32 lg:w-40 h-auto -mb-4 [mask-image:linear-gradient(to_bottom,black_70%,transparent)]"
            draggable={false}
          />
        </div>

        {/* Soft fade behind the mono label so it reads over the frieze */}
        <p className="label-mono relative z-10 bg-page/80 backdrop-blur-[1px] w-fit px-1 -mx-1">
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
