import Link from "next/link";
import { Activity, ArrowUpRight } from "lucide-react";

const columns = [
  { title: "Product", links: [["Overview", "#overview"], ["Capabilities", "#capabilities"], ["Integrations", "#integrations"], ["Network", "#network"]] },
  { title: "Explore", links: [["Incident intelligence", "#incident-intelligence"], ["FAQ", "#faq"], ["Sign in", "/login"]] },
];

const LandingFooter = () => (
  <footer className="px-5 py-12 sm:px-6 sm:py-16">
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-12 border-b border-white/[0.08] pb-12 md:grid-cols-[1.8fr_1fr_1fr]">
        <div>
          <Link href="#overview" className="flex items-center gap-2.5"><span className="flex size-8 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-emerald-300"><Activity className="size-4"/></span><span className="text-sm font-semibold text-white">UptimeSentinel</span></Link>
          <p className="mt-4 max-w-xs text-xs leading-5 text-white/30">Operational clarity for every endpoint, from the first check to verified recovery.</p>
          <Link href="/register" className="mt-5 flex w-fit items-center gap-1 text-[11px] font-semibold text-white/60 hover:text-white">Start monitoring <ArrowUpRight className="size-3"/></Link>
        </div>
        {columns.map((column) => <div key={column.title}><p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/25">{column.title}</p><div className="mt-4 space-y-3">{column.links.map(([label,href]) => <Link key={label} href={href} className="block text-[11px] text-white/35 transition-colors hover:text-white/70">{label}</Link>)}</div></div>)}
      </div>
      <div className="flex flex-col gap-3 pt-6 text-[9px] text-white/20 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 UptimeSentinel.</span><span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-emerald-300"/>All systems operational</span></div>
    </div>
  </footer>
);

export default LandingFooter;
