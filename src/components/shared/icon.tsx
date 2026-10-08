import {
  Activity, AlarmClock, AudioLines, BadgeCheck, BarChart3, Bell, Bot, Brain, BrainCircuit, Briefcase, Building2,
  Calculator, Calendar, CalendarCheck, ChartLine, ChartNoAxesCombined, CheckCircle2, Clock, Code2, Cog, Compass, Cpu, Crown,
  Database, DollarSign, Dumbbell, Eye, FileSearch, FileText, Filter, Gauge, Gem, Globe, GraduationCap, Hammer,
  HardHat, Headphones, HeartPulse, Home, Inbox, Languages, Layers, LayoutGrid, LayoutTemplate, LineChart, Link2,
  Lock, Mail, MapPin, Megaphone, MessageCircle, MessagesSquare, Mic, MonitorSmartphone, MousePointerClick, Palette,
  PenTool, Phone, PhoneCall, PhoneIncoming, PhoneMissed, Plane, Plug, Repeat, Rocket, Scale, Search, Send, Settings2,
  ShieldCheck, ShoppingBag, ShoppingCart, Smile, Sparkles, Star, Stethoscope, Store, Target, Timer, TrendingUp, Trophy,
  Users, UserCheck, UtensilsCrossed, Wallet, Workflow, Wrench, Zap, Smartphone, Lightbulb, Handshake, Map, Video,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Activity, AlarmClock, AudioLines, BadgeCheck, BarChart3, Bell, Bot, Brain, BrainCircuit, Briefcase, Building2,
  Calculator, Calendar, CalendarCheck, ChartLine, ChartNoAxesCombined, CheckCircle2, Clock, Code2, Cog, Compass, Cpu, Crown,
  Database, DollarSign, Dumbbell, Eye, FileSearch, FileText, Filter, Gauge, Gem, Globe, GraduationCap, Hammer,
  HardHat, Headphones, HeartPulse, Home, Inbox, Languages, Layers, LayoutGrid, LayoutTemplate, LineChart, Link2,
  Lock, Mail, MapPin, Megaphone, MessageCircle, MessagesSquare, Mic, MonitorSmartphone, MousePointerClick, Palette,
  PenTool, Phone, PhoneCall, PhoneIncoming, PhoneMissed, Plane, Plug, Repeat, Rocket, Scale, Search, Send, Settings2,
  ShieldCheck, ShoppingBag, ShoppingCart, Smile, Sparkles, Star, Stethoscope, Store, Target, Timer, TrendingUp, Trophy,
  Users, UserCheck, UtensilsCrossed, Wallet, Workflow, Wrench, Zap, Smartphone, Lightbulb, Handshake, Map, Video,
};

export type IconName = keyof typeof icons;

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = icons[name] ?? Sparkles;
  return <Cmp aria-hidden className={className} />;
}
