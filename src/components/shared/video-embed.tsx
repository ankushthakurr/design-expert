"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

export type VideoSource = { type: "youtube" | "vimeo" | "file"; id: string; poster?: string };

/**
 * Click-to-load video facade supporting YouTube, Vimeo and self-hosted files.
 * Nothing third-party loads until the visitor presses play (protects PageSpeed).
 */
export function VideoEmbed({ source, title, className, placeholder }: { source: VideoSource; title: string; className?: string; placeholder?: React.ReactNode }) {
  const [playing, setPlaying] = useState(false);
  const hasVideo = !!source.id;
  const poster =
    source.poster || (source.type === "youtube" && source.id ? `https://i.ytimg.com/vi/${source.id}/hqdefault.jpg` : undefined);

  return (
    <div className={cn("relative aspect-video overflow-hidden rounded-3xl border border-white/10 bg-surface", className)}>
      {playing && hasVideo ? (
        source.type === "file" ? (
          <video src={source.id} controls autoPlay playsInline className="size-full object-cover" title={title} />
        ) : (
          <iframe
            className="size-full"
            title={title}
            src={
              source.type === "youtube"
                ? `https://www.youtube-nocookie.com/embed/${source.id}?autoplay=1&rel=0&modestbranding=1`
                : `https://player.vimeo.com/video/${source.id}?autoplay=1&title=0&byline=0`
            }
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
          />
        )
      ) : (
        <button
          type="button"
          onClick={() => hasVideo && setPlaying(true)}
          className="group absolute inset-0 flex size-full items-center justify-center"
          aria-label={hasVideo ? `Play video: ${title}` : title}
          disabled={!hasVideo}
        >
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-70" />
          ) : (
            placeholder ?? <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,245,255,0.25),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(123,97,255,0.3),transparent_55%)]" />
          )}
          {hasVideo && (
            <span className="relative flex size-20 items-center justify-center rounded-full bg-primary text-background shadow-glow transition-transform duration-300 group-hover:scale-110">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-primary" aria-hidden />
              <Play className="relative ml-1 size-8 fill-current" aria-hidden />
            </span>
          )}
        </button>
      )}
    </div>
  );
}
