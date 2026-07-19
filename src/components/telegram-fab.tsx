import { Send } from "lucide-react";

export function TelegramFab() {
  return (
    <a
      href="https://t.me/FilologiyaPedagogikaBot"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Telegram bot orqali maqola yuborish"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 group inline-flex items-center gap-2 rounded-full bg-[#229ED9] hover:bg-[#1b8cc2] text-white shadow-lg shadow-black/15 pl-3 pr-4 py-3 transition-all active:scale-95"
    >
      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-white/15">
        <Send className="h-3.5 w-3.5 -translate-x-[1px] translate-y-[1px]" strokeWidth={2.5} />
      </span>
      <span className="hidden sm:inline text-[13px] font-medium tracking-tight">
        Telegram bot
      </span>
    </a>
  );
}
