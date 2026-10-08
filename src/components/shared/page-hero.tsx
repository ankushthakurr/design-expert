import { Breadcrumbs } from "./breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs: { name: string; path: string }[];
  children?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
};

export function PageHero({ eyebrow, title, description, breadcrumbs, children, aside, className }: Props) {
  return (
    <section className={cn("noise relative isolate overflow-hidden pb-16 pt-32 md:pt-40", className)}>
      <div className="grid-bg absolute inset-0 -z-20" aria-hidden />
      <div className="glow-orb -z-10 -left-40 top-0 size-[520px] bg-secondary/30" aria-hidden />
      <div className="glow-orb -z-10 right-0 top-20 size-[420px] bg-primary/20" aria-hidden />
      <div className={cn("container-x", aside && "grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]")}>
        <Reveal className="flex flex-col gap-6">
          <Breadcrumbs items={breadcrumbs} />
          {eyebrow && <Badge>{eyebrow}</Badge>}
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl">{title}</h1>
          {description && <p className="max-w-2xl text-base leading-relaxed text-muted md:text-lg">{description}</p>}
          {children}
        </Reveal>
        {aside && <div className="relative">{aside}</div>}
      </div>
    </section>
  );
}
