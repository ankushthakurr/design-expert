"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { whatsappLink, whatsappMessages, site } from "@/lib/site";

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.4 9.4 0 0 1-1.44-5.01c0-5.2 4.23-9.43 9.43-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.23 9.42-9.43 9.42m8.02-17.44A11.27 11.27 0 0 0 12.05.75C5.8.75.72 5.83.72 12.08c0 2 .52 3.95 1.51 5.67L.63 23.25l5.63-1.48a11.3 11.3 0 0 0 5.79 1.48c6.24 0 11.33-5.08 11.33-11.33 0-3.02-1.18-5.87-3.31-8"/>
    </svg>
  );
}

export function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="glass-strong w-[300px] overflow-hidden rounded-3xl shadow-2xl"
            role="dialog"
            aria-label="Chat with D Expert on WhatsApp"
          >
            <div className="flex items-center gap-3 bg-[#00a884]/20 px-5 py-4">
              <span className="flex size-10 items-center justify-center rounded-full bg-[#25D366] text-white">
                <WhatsAppGlyph className="size-6" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">D Expert</p>
                <p className="text-xs text-muted">Typically replies within minutes</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-4">
              <p className="mb-1 text-xs text-muted">Hi! 👋 What can we help you with? Pick a message to start:</p>
              {whatsappMessages.map((m) => (
                <a
                  key={m}
                  href={whatsappLink(m)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground transition-colors hover:border-[#25D366]/60 hover:bg-[#25D366]/10"
                >
                  {m}
                </a>
              ))}
              <p className="mt-1 text-center text-[11px] text-subtle">WhatsApp {site.phone}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close WhatsApp chat" : "Chat with us on WhatsApp"}
        aria-expanded={open}
        className="relative flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_40px_-8px_rgba(37,211,102,0.7)] transition-transform hover:scale-105"
      >
        {!open && <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#25D366]" aria-hidden />}
        {open ? <X className="relative size-6" /> : <WhatsAppGlyph className="relative size-7" />}
      </button>
    </div>
  );
}
