import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("size-9", className)} aria-hidden>
      <defs>
        <linearGradient id="dx-g" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00F5FF" />
          <stop offset="0.55" stopColor="#7B61FF" />
          <stop offset="1" stopColor="#00FF9D" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="11" fill="#0A0F24" stroke="url(#dx-g)" strokeWidth="1.5" />
      <path d="M12 10.5h8.2c6 0 10 3.9 10 9.5s-4 9.5-10 9.5H12v-19Z" fill="none" stroke="url(#dx-g)" strokeWidth="2.6" strokeLinejoin="round" />
      <circle cx="20" cy="20" r="2.6" fill="#00F5FF" />
      <path d="M12 20h5.4" stroke="#00F5FF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="D Expert home" className={cn("group flex items-center gap-2.5", className)}>
      <LogoMark className="transition-transform duration-500 group-hover:rotate-[8deg]" />
      <span className="text-lg font-semibold tracking-tight text-foreground">
        D <span className="text-gradient">Expert</span>
      </span>
    </Link>
  );
}
