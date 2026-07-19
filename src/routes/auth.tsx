import { createFileRoute, Link, useNavigate, useSearch, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { ArrowLeft, Mail, Lock, User as UserIcon, Loader2 } from "lucide-react";
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

  const isSignup = mode === "signup";

  return (
    <div className="min-h-dvh bg-white text-ink grid lg:grid-cols-2">
      {/* Left — brand / illustration */}
      <aside className="hidden lg:flex relative overflow-hidden border-r border-rule bg-white flex-col justify-between p-12">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Bosh sahifaga
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center py-8">
          <img
            src={authEnsemble}
            alt="Uzbek scholars and writers — ensemble portrait"
            className="max-w-full max-h-[62vh] object-contain object-center select-none"
            draggable={false}
          />
        </div>

        <div />
      </aside>

      {/* Right — form */}
      <div className="flex flex-col min-h-dvh">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-6 pt-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-ink-muted">
            <ArrowLeft className="h-4 w-4" />
            Bosh sahifa
          </Link>
        </div>


        <div className="flex-1 flex items-center justify-center px-6 py-10 lg:p-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8 space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-surface-sunken px-3 py-1 text-[11px] font-medium tracking-wide uppercase text-ink-muted">
                {isSignup ? "Ro‘yxatdan o‘tish" : "Kirish"}
              </span>
              <h1 className="text-3xl md:text-4xl font-semibold leading-[1.1] tracking-tight">
                {isSignup ? "Yangi hisob\nyarating." : "Xush kelibsiz.\nHisobingizga kiring."}
              </h1>
              <p className="text-sm text-ink-muted leading-relaxed">
                {isSignup
                  ? "Maqolalaringizni topshirish va tahririyat bilan ishlash uchun."
                  : "Maqolalaringiz, taqrizlar va tahririyat jarayoni bir joyda."}
              </p>
            </div>

            {/* Google */}
            <button
              onClick={google}
              disabled={loading}
              type="button"
              className="w-full inline-flex items-center justify-center gap-3 rounded-2xl border border-rule-strong bg-white py-3 text-sm font-medium hover:bg-surface-sunken transition-colors disabled:opacity-50 active:scale-[0.99]"
            >
              <GoogleG />
              Google orqali {isSignup ? "davom etish" : "kirish"}
            </button>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-rule" />
              <span className="label-mono">yoki email bilan</span>
              <div className="flex-1 h-px bg-rule" />
            </div>

            {/* Form */}
            <form onSubmit={submit} className="space-y-3">
              {isSignup && (
                <IconField icon={<UserIcon className="h-4 w-4" />} label="To‘liq ism-sharif">
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alisher Navoiy"
                    className="w-full bg-transparent outline-none text-sm placeholder:text-ink-faint"
                    autoComplete="name"
                  />
                </IconField>
              )}
              <IconField icon={<Mail className="h-4 w-4" />} label="Email">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="siz@universitet.uz"
                  className="w-full bg-transparent outline-none text-sm placeholder:text-ink-faint"
                  autoComplete="email"
                />
              </IconField>
              <IconField icon={<Lock className="h-4 w-4" />} label="Parol">
                <input
                  required
                  type="password"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignup ? "Kamida 8 ta belgi" : "••••••••"}
                  className="w-full bg-transparent outline-none text-sm placeholder:text-ink-faint"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                />
              </IconField>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-ink text-white py-3 text-sm font-semibold hover:bg-ink-soft transition-colors disabled:opacity-60 active:scale-[0.99]"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSignup ? "Ro‘yxatdan o‘tish" : "Kirish"}
              </button>
            </form>

            <p className="mt-6 text-sm text-ink-muted text-center">
              {isSignup ? "Hisobingiz bormi? " : "Hisobingiz yo‘qmi? "}
              <button
                type="button"
                onClick={() => setMode(isSignup ? "signin" : "signup")}
                className="font-medium text-ink underline underline-offset-4 decoration-rule-strong hover:decoration-ink"
              >
                {isSignup ? "Kirish" : "Ro‘yxatdan o‘ting"}
              </button>
            </p>

            <p className="mt-8 text-[11px] text-ink-faint text-center leading-relaxed">
              Davom etib, siz jurnalning{" "}
              <Link to="/about" className="underline underline-offset-2 hover:text-ink">shartlari</Link>{" "}
              va maxfiylik siyosatiga rozilik bildirasiz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconField({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="group block rounded-2xl border border-rule-strong bg-white px-4 py-2.5 focus-within:border-ink focus-within:shadow-[0_0_0_3px_rgba(20,20,20,0.06)] transition-all">
      <span className="label-mono block mb-0.5">{label}</span>
      <div className="flex items-center gap-2.5 text-ink-muted">
        <span className="shrink-0">{icon}</span>
        <div className="flex-1 text-ink">{children}</div>
      </div>
    </label>
  );
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}
