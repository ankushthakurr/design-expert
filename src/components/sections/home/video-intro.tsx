import { Quote } from "lucide-react";
import { site } from "@/lib/site";
import { VideoEmbed } from "@/components/shared/video-embed";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { BookButton } from "@/components/shared/cta-buttons";

export function VideoIntro() {
  const hasVideo = !!site.introVideo.id;
  return (
    <section aria-labelledby="video-title" className="py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Message From Pankaj Thakur"
          title={<span id="video-title">See How We Help Businesses Grow Using <span className="text-gradient">AI &amp; Automation</span></span>}
        />
        <Reveal className="relative mx-auto mt-12 max-w-5xl">
          <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-2xl" aria-hidden />
          <VideoEmbed
            source={site.introVideo}
            title="Message from Pankaj Thakur, founder of D Expert"
            placeholder={
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[radial-gradient(circle_at_30%_30%,rgba(0,245,255,0.2),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(123,97,255,0.3),transparent_55%)] p-8 text-center">
                <span className="flex size-20 items-center justify-center rounded-full border border-primary/40 bg-gradient-to-br from-primary/30 to-secondary/30 text-2xl font-semibold text-foreground">
                  PT
                </span>
                <Quote className="size-6 text-primary" aria-hidden />
                <p className="max-w-2xl text-lg leading-relaxed text-foreground md:text-2xl">
                  &ldquo;Most businesses don&apos;t have a lead problem. They have a follow-up problem. We build AI systems that make sure every call is answered and every lead gets a reply in seconds.&rdquo;
                </p>
                <p className="text-sm text-muted">
                  {site.founder.name} · {site.founder.role}
                </p>
              </div>
            }
          />
          {!hasVideo && (
            <div className="mt-6 flex justify-center">
              <BookButton size="lg">Talk to Pankaj directly</BookButton>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
