export type NavLink = { label: string; href: string; description?: string; icon?: string };
export type NavGroup = { label: string; href?: string; items?: NavLink[] };

export const mainNav: NavGroup[] = [
  {
    label: "Services",
    href: "/services",
    items: [
      { label: "AI Voice Agents", href: "/ai-voice-agents", description: "AI receptionists that answer every call, 24/7", icon: "PhoneCall" },
      { label: "AI Chatbots", href: "/ai-chatbots", description: "Website & WhatsApp assistants that support and sell", icon: "MessagesSquare" },
      { label: "Automation Solutions", href: "/automation-solutions", description: "CRM, WhatsApp, email & workflow automation", icon: "Workflow" },
      { label: "Website Design", href: "/website-design", description: "Fast, premium websites built to convert", icon: "MonitorSmartphone" },
      { label: "Digital Marketing", href: "/digital-marketing", description: "Google Ads, Meta Ads & lead generation", icon: "TrendingUp" },
      { label: "Branding", href: "/branding", description: "Brand strategy, identity & Google Business Profile", icon: "Gem" },
    ],
  },
  {
    label: "Work",
    items: [
      { label: "Portfolio", href: "/portfolio", description: "AI systems, websites and campaigns we've built", icon: "LayoutGrid" },
      { label: "Case Studies", href: "/case-studies", description: "How the systems perform for real businesses", icon: "LineChart" },
    ],
  },
  {
    label: "Free Tools",
    href: "/tools",
    items: [
      { label: "Website Grader", href: "/website-grader", description: "Instant audit with a plain-English growth score", icon: "Gauge" },
      { label: "Automation Audit", href: "/automation-audit", description: "Find what your business should automate first", icon: "Bot" },
      { label: "AI Voice ROI Calculator", href: "/ai-roi-calculator", description: "Revenue you lose to missed calls", icon: "Calculator" },
      { label: "Growth Assessment", href: "/business-growth-assessment", description: "Score your growth engine in 2 minutes", icon: "Rocket" },
      { label: "Voice Agent Demo", href: "/voice-agent-demo", description: "Hear AI receptionists handle real calls", icon: "AudioLines" },
      { label: "All Tools", href: "/tools", description: "8 free business growth tools", icon: "Sparkles" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "Founder", href: "/founder" },
  { label: "Blog", href: "/blog" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "AI Solutions",
    links: [
      { label: "AI Voice Agents", href: "/ai-voice-agents" },
      { label: "AI Receptionists", href: "/ai-voice-agents#receptionist" },
      { label: "AI Chatbots", href: "/ai-chatbots" },
      { label: "Automation Solutions", href: "/automation-solutions" },
      { label: "Voice Agent Demo", href: "/voice-agent-demo" },
    ],
  },
  {
    title: "Growth Services",
    links: [
      { label: "Website Design", href: "/website-design" },
      { label: "Digital Marketing", href: "/digital-marketing" },
      { label: "Branding", href: "/branding" },
      { label: "All Services", href: "/services" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Free Tools",
    links: [
      { label: "Website Grader", href: "/website-grader" },
      { label: "Automation Audit", href: "/automation-audit" },
      { label: "AI ROI Calculator", href: "/ai-roi-calculator" },
      { label: "Growth Assessment", href: "/business-growth-assessment" },
      { label: "ROI Calculator Suite", href: "/free-tools" },
      { label: "All Tools", href: "/tools" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Founder", href: "/founder" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "Book Consultation", href: "/book-consultation" },
    ],
  },
];
