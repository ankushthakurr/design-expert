"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send } from "lucide-react";

const convo = [
  { who: "user", text: "Hi! Do you have any slots for a consultation this week?" },
  { who: "bot", text: "Hi there 👋 Yes! I have Thursday 11:00 AM or Friday 3:30 PM available. Which works for you?" },
  { who: "user", text: "Friday please. Also, what does it cost?" },
  { who: "bot", text: "Great, you're booked for Friday 3:30 PM ✅ The consultation is free, and I've sent the details to your WhatsApp." },
  { who: "user", text: "Perfect, thanks!" },
  { who: "bot", text: "You're welcome! Anything else I can help with? I'm here 24/7." },
] as const;

/** Animated website/WhatsApp chatbot conversation used on the AI Chatbots page. */
export function ChatDemo() {
  const [n, setN] = useState(1);
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    if (n >= convo.length) {
      const reset = setTimeout(() => setN(1), 4000);
      return () => clearTimeout(reset);
    }
    const next = convo[n];
    if (next.who === "bot") setTyping(true);
    const t = setTimeout(() => {
      setTyping(false);
      setN((x) => x + 1);
    }, next.who === "bot" ? 1600 : 1100);
    return () => clearTimeout(t);
  }, [n]);
  return (
    <div className="glass-strong mx-auto w-full max-w-md overflow-hidden rounded-[2rem] shadow-glow-violet" aria-label="Example AI chatbot conversation" role="img">
      <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-5 py-4">
        <span className="relative flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-background">
          <Bot className="size-5" aria-hidden />
          <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-surface bg-accent" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">D Expert Assistant</p>
          <p className="text-xs text-accent">Online · replies instantly</p>
        </div>
      </div>
      <div className="flex h-[360px] flex-col justify-end gap-2.5 p-5">
        <AnimatePresence initial={false}>
          {convo.slice(0, n).slice(-5).map((m) => (
            <motion.div
              key={m.text}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className={m.who === "bot" ? "max-w-[85%] self-start rounded-2xl rounded-bl-sm bg-primary/12 px-4 py-2.5 text-sm text-foreground" : "max-w-[85%] self-end rounded-2xl rounded-br-sm bg-secondary/30 px-4 py-2.5 text-sm text-foreground"}
            >
              {m.text}
            </motion.div>
          ))}
          {typing && (
            <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-1 self-start rounded-2xl bg-primary/12 px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-2 border-t border-white/10 p-3">
        <div className="h-10 flex-1 rounded-full bg-white/5 px-4 text-sm leading-10 text-subtle">Type a message…</div>
        <span className="flex size-10 items-center justify-center rounded-full bg-primary text-background">
          <Send className="size-4" aria-hidden />
        </span>
      </div>
    </div>
  );
}
