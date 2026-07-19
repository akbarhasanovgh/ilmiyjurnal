import { Send } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";

export function TelegramFab() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hideOn = pathname.startsWith("/admin") || pathname.startsWith("/submissions");
  if (hideOn) return null;

  return (
    <a
      href="https://t.me/FilologiyaPedagogikaBot"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Telegram bot orqali maqola yuborish"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#229ED9] hover:bg-[#1b8cc2] text-white shadow-lg shadow-black/15 transition-all active:scale-95"
    >
      <Send className="h-5 w-5 -translate-x-[1px] translate-y-[1px]" strokeWidth={2.5} />
    </a>
  );
}
