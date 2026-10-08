import Link from "next/link";
import type { BlogPost } from "@/content/blog";
import { Icon } from "./icon";

export function PostCover({ post, className }: { post: BlogPost; className?: string }) {
  const [a, b] = post.colors;
  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className ?? ""}`} style={{ background: `radial-gradient(circle at 25% 25%, ${a}55, transparent 55%), radial-gradient(circle at 80% 80%, ${b}55, transparent 55%), #0a0f24` }} aria-hidden>
      <div className="grid-bg absolute inset-0 opacity-60" />
      <span className="relative flex size-20 items-center justify-center rounded-3xl border border-white/20 bg-white/5 backdrop-blur" style={{ boxShadow: `0 0 60px ${a}55` }}>
        <Icon name={post.icon} className="size-9 text-foreground" />
      </span>
    </div>
  );
}

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="glass group flex h-full flex-col overflow-hidden rounded-3xl transition-all hover:-translate-y-1 hover:border-primary/30">
      <PostCover post={post} className="aspect-[16/9]" />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-primary">{post.category}</span>
          <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</time>
          <span>· {post.readingTime}</span>
        </div>
        <h3 className="text-lg font-semibold leading-snug text-foreground group-hover:text-primary">{post.title}</h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted">{post.description}</p>
      </div>
    </Link>
  );
}
