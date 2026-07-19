import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-page px-6">
      <div className="max-w-md text-center">
        <p className="label-mono">404</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-ink">
          Sahifa topilmadi
        </h1>
        <p className="mt-3 text-sm text-ink-muted">
          Siz izlagan sahifa mavjud emas yoki ko‘chirilgan.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-sm bg-ink px-4 py-2 text-sm font-medium text-page ring-1 ring-ink transition-colors hover:bg-ink-soft"
          >
            Bosh sahifaga
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);
  return (
    <div className="flex min-h-dvh items-center justify-center bg-page px-6">
      <div className="max-w-md text-center">
        <p className="label-mono">Xatolik</p>
        <h1 className="mt-4 font-serif text-3xl leading-tight text-ink">
          Sahifa yuklanmadi
        </h1>
        <p className="mt-3 text-sm text-ink-muted">
          Nimadir noto‘g‘ri ketdi. Sahifani qayta yuklashga urinib ko‘ring.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-sm bg-ink px-4 py-2 text-sm font-medium text-page ring-1 ring-ink transition-colors hover:bg-ink-soft"
          >
            Qayta urinish
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-sm border border-rule-strong bg-page px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-sunken"
          >
            Bosh sahifa
          </a>
        </div>
      </div>
    </div>
  );
}

const SITE_TITLE = "O‘zbek tili va adabiyoti — Ilmiy-nazariy jurnal";
const SITE_DESCRIPTION =
  "O‘zbek filologiyasi, tilshunoslik, adabiyotshunoslik va matnshunoslik bo‘yicha ilmiy jurnal. ISSN 2010-5584.";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "theme-color", content: "#fcfcfb" },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "O‘zbek tili va adabiyoti" },
      { property: "og:locale", content: "uz_UZ" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700;900&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="uz">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (
        event !== "SIGNED_IN" &&
        event !== "SIGNED_OUT" &&
        event !== "USER_UPDATED"
      )
        return;
      if (event === "SIGNED_OUT") {
        queryClient.clear();
        return;
      }
      queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}
