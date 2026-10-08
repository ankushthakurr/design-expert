import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "./reveal";

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
};

export function SectionHeading({ eyebrow, title, description, align = "center", className, as = "h2" }: Props) {
  const Heading = as;
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "mx-auto max-w-3xl items-center text-center" : "max-w-2xl items-start",
        className,
      )}
    >
      {eyebrow && <Badge>{eyebrow}</Badge>}
      <Heading className="text-3xl font-semibold leading-[1.1] text-foreground md:text-5xl">{title}</Heading>
      {description && <p className="text-base leading-relaxed text-muted md:text-lg">{description}</p>}
    </Reveal>
  );
}
