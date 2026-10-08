import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/portfolio";
import { ProjectVisual } from "./project-visual";

export function ProjectCard({ project, priority }: { project: Project; priority?: boolean }) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="glass group flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow"
      data-priority={priority ? "true" : undefined}
    >
      <ProjectVisual kind={project.mockup} colors={project.colors} title={project.title} className="aspect-[16/10] transition-transform duration-700 group-hover:scale-[1.02]" />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap gap-1.5">
          {project.categories.slice(0, 3).map((c) => (
            <span key={c} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-muted">
              {c}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted">{project.summary}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm text-primary">
          View project <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
