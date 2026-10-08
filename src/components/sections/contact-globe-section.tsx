import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Globe3D } from "@/components/three/scenes";
import { CalendlyEmbed } from "@/components/booking/calendly-embed";
import { SectionHeading } from "@/components/shared/section-heading";
import { site, whatsappLink } from "@/lib/site";

export function ContactGlobeSection({ withCalendar = true }: { withCalendar?: boolean }) {
  return (
    <section aria-labelledby="contact-globe-title" className="relative overflow-hidden py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <SectionHeading
            align="left"
            eyebrow="Based in New Delhi · Serving worldwide"
            title={<span id="contact-globe-title">Let&apos;s build your <span className="text-gradient">AI growth system</span></span>}
            description="We work with businesses across India, the US, UK, UAE, Canada and Australia. Book a free strategy call, or reach Pankaj directly."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <a href={`tel:${site.phoneRaw}`} className="glass group flex items-center gap-3 rounded-2xl p-4 hover:border-primary/30">
              <Phone className="size-5 text-primary" aria-hidden />
              <span>
                <span className="block text-xs text-muted">Call</span>
                <span className="block text-sm font-medium text-foreground">{site.phone}</span>
              </span>
            </a>
            <a href={whatsappLink("I want a Free Consultation")} target="_blank" rel="noopener noreferrer" className="glass flex items-center gap-3 rounded-2xl p-4 hover:border-accent/30">
              <Phone className="size-5 text-accent" aria-hidden />
              <span>
                <span className="block text-xs text-muted">WhatsApp</span>
                <span className="block text-sm font-medium text-foreground">Chat instantly</span>
              </span>
            </a>
            <a href={`mailto:${site.email}`} className="glass flex items-center gap-3 rounded-2xl p-4 hover:border-primary/30">
              <Mail className="size-5 text-primary" aria-hidden />
              <span>
                <span className="block text-xs text-muted">Email</span>
                <span className="block text-sm font-medium text-foreground">{site.email}</span>
              </span>
            </a>
            <div className="glass flex items-center gap-3 rounded-2xl p-4">
              <MapPin className="size-5 text-secondary" aria-hidden />
              <span>
                <span className="block text-xs text-muted">Office</span>
                <span className="block text-sm font-medium text-foreground">New Delhi, India</span>
              </span>
            </div>
          </div>
          <p className="flex items-center gap-2 text-sm text-muted">
            <Clock className="size-4 text-primary" aria-hidden /> {site.hoursLabel}
          </p>
        </div>
        <div className="relative aspect-square w-full">
          <div className="absolute inset-[10%] rounded-full bg-secondary/20 blur-3xl" aria-hidden />
          <Globe3D className="absolute inset-0" />
        </div>
      </div>
      {withCalendar && (
        <div className="container-x mt-16">
          <div className="glass rounded-[2rem] p-3 md:p-4">
            <CalendlyEmbed url={site.calendly.default} height={700} />
          </div>
        </div>
      )}
    </section>
  );
}
