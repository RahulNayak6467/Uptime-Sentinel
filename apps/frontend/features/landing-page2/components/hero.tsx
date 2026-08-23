"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Activity, ArrowRight, Check, Menu, X } from "lucide-react";
import { useState } from "react";
import ShinyText from "@/components/ShinyText";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { BorderBeam } from "@/components/ui/border-beam";
import Aurora from "@/components/Aurora";
import styles from "../landing-page2.module.css";

const navLinks = [["Platform","#platform"],["Why UptimeSentinel","#why"],["Operations","#operations"],["Vision","#vision"],["FAQ","#faq"]];

export const Nav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
  <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
    <nav className="relative mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-[#07100d]/75 px-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:px-5">
      <Link href="/landing-page2" className="flex items-center gap-2.5"><span className="flex size-8 items-center justify-center rounded-lg border border-[#65f2a5]/20 bg-[#65f2a5]/10 text-[#65f2a5]"><Activity className="size-4"/></span><span className="text-sm font-bold tracking-[-.03em]">UptimeSentinel</span></Link>
      <div className="hidden items-center gap-6 lg:flex">{navLinks.map(([label,href])=><Link key={href} href={href} className="text-xs font-medium text-white/50 transition-colors hover:text-white">{label}</Link>)}</div>
      <div className="flex items-center gap-2"><Link href="/login" className="hidden px-3 text-xs font-medium text-white/50 hover:text-white sm:block">Sign in</Link><Link href="/register" className="hidden rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-black sm:block">Start monitoring</Link><button type="button" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)} className="flex size-9 items-center justify-center rounded-lg border border-white/10 lg:hidden">{mobileOpen ? <X className="size-4"/> : <Menu className="size-4"/>}</button></div>
      <AnimatePresence>
        {mobileOpen && <motion.div initial={{opacity:0,y:-8,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-8,scale:.98}} transition={{duration:.18}} className="absolute inset-x-0 top-[calc(100%+8px)] overflow-hidden rounded-2xl border border-white/10 bg-[#07100d]/95 p-2 shadow-2xl backdrop-blur-xl lg:hidden">{navLinks.map(([label,href])=><Link key={href} href={href} onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-3 text-xs font-medium text-white/55 transition-colors hover:bg-white/[.05] hover:text-white">{label}</Link>)}<div className="mt-1 grid grid-cols-2 gap-2 border-t border-white/[.07] pt-2 sm:hidden"><Link href="/login" onClick={() => setMobileOpen(false)} className="rounded-xl border border-white/10 px-3 py-3 text-center text-xs text-white/60">Sign in</Link><Link href="/register" onClick={() => setMobileOpen(false)} className="rounded-xl bg-white px-3 py-3 text-center text-xs font-semibold text-black">Get started</Link></div></motion.div>}
      </AnimatePresence>
    </nav>
  </header>
  );
};

const OperationsPreview = () => (
  <motion.div initial={{opacity:0,y:34,scale:.96}} animate={{opacity:1,y:0,scale:1}} transition={{duration:.9,delay:.35,ease:[.22,1,.36,1]}} className="relative mx-auto mt-16 max-w-6xl rounded-[28px] border border-white/10 bg-[#09100e]/90 p-2 shadow-[0_-35px_120px_rgba(101,242,165,.09),0_45px_120px_rgba(0,0,0,.55)] backdrop-blur-xl">
    <BorderBeam size={230} duration={11} colorFrom="#65f2a5" colorTo="#75a7ff" borderWidth={1.5}/>
    <div className="overflow-hidden rounded-[21px] border border-white/[.07] bg-[#080c0b]">
      <div className="flex items-center justify-between border-b border-white/[.07] px-5 py-3"><div className="flex gap-1.5"><span className="size-2 rounded-full bg-white/15"/><span className="size-2 rounded-full bg-white/15"/><span className="size-2 rounded-full bg-[#65f2a5]"/></div><span className="font-mono text-[8px] uppercase tracking-[.18em] text-white/25">UptimeSentinel / Operations</span><span className="flex items-center gap-1.5 text-[8px] text-[#65f2a5]"><span className="size-1.5 rounded-full bg-[#65f2a5]"/>LIVE</span></div>
      <div className="grid gap-px bg-white/[.06] lg:grid-cols-[190px_1fr]">
        <aside className="hidden bg-[#090e0c] p-4 lg:block"><div className="rounded-lg bg-white/[.05] px-3 py-2 text-[9px] font-semibold text-white/70">Overview</div>{["Monitors","Incidents","Email alerts","Status pages","Integrations"].map(x=><div key={x} className="px-3 py-2.5 text-[9px] text-white/25">{x}</div>)}<div className="mt-8 rounded-xl border border-[#65f2a5]/15 bg-[#65f2a5]/[.05] p-3"><p className="text-[8px] font-semibold text-[#65f2a5]">Global health</p><p className="mt-1 text-[10px] font-medium">All systems operational</p></div></aside>
        <div className="bg-[#070b09] p-4 sm:p-6"><div className="flex items-end justify-between"><div><p className="text-[8px] uppercase tracking-[.16em] text-white/25">Good evening</p><h3 className="mt-1 text-lg font-semibold">Operational overview</h3></div><span className="rounded-lg border border-white/10 px-3 py-1.5 text-[8px] text-white/35">Last 24 hours</span></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">{[["MONITORS","24","+3 this month"],["UPTIME","99.982%","across all checks"],["OPEN INCIDENTS","0","all clear"]].map(([l,v,n])=><div key={l} className="rounded-xl border border-white/[.07] bg-white/[.025] p-4"><p className="text-[7px] font-bold tracking-[.15em] text-white/25">{l}</p><p className="mt-2 text-2xl font-semibold tracking-[-.05em]">{v}</p><p className="mt-1 text-[8px] text-[#65f2a5]">{n}</p></div>)}</div>
          <div className="mt-3 grid gap-3 lg:grid-cols-[1.4fr_.6fr]"><div className="relative h-44 overflow-hidden rounded-xl border border-white/[.07] bg-white/[.02] p-4"><p className="text-[8px] font-semibold text-white/40">Response time · 68ms average</p><svg viewBox="0 0 600 130" preserveAspectRatio="none" className="absolute inset-x-4 bottom-4 h-28 w-[calc(100%-2rem)]"><defs><linearGradient id="heroArea" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#65f2a5" stopOpacity=".3"/><stop offset="1" stopColor="#65f2a5" stopOpacity="0"/></linearGradient></defs><path d="M0 105 C50 90 70 98 110 75 S180 88 230 55 S310 70 355 42 S430 60 475 36 S535 44 600 18 L600 130 L0 130Z" fill="url(#heroArea)"/><path d="M0 105 C50 90 70 98 110 75 S180 88 230 55 S310 70 355 42 S430 60 475 36 S535 44 600 18" fill="none" stroke="#65f2a5" strokeWidth="2"/></svg><div className={`absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-transparent via-[#65f2a5]/10 to-transparent ${styles.scan}`}/></div><div className="rounded-xl border border-white/[.07] bg-white/[.02] p-4"><p className="text-[8px] font-semibold text-white/40">Live monitors</p><div className="mt-4 space-y-3">{[["API Gateway","42ms"],["Checkout","81ms"],["Auth service","55ms"]].map(([n,v])=><div key={n} className="flex items-center justify-between"><span className="flex items-center gap-2 text-[8px] text-white/45"><span className="size-1.5 rounded-full bg-[#65f2a5]"/>{n}</span><span className="font-mono text-[8px] text-white/25">{v}</span></div>)}</div></div></div>
        </div>
      </div>
    </div>
  </motion.div>
);

const particles = [
  ["8%", "24%", "0s"], ["16%", "63%", "1.4s"], ["27%", "35%", "2.1s"],
  ["38%", "14%", ".7s"], ["52%", "29%", "2.8s"], ["64%", "11%", "1.1s"],
  ["73%", "48%", "3.2s"], ["84%", "20%", ".3s"], ["92%", "58%", "1.9s"],
];

const HeroAtmosphere = () => {
  const reduceMotion = useReducedMotion();

  return (
  <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <div className="absolute inset-x-0 -top-24 h-[760px] opacity-85 [mask-image:linear-gradient(to_bottom,black_0%,black_66%,transparent_100%)]">
      <Aurora
        colorStops={["#0B5A42", "#65F2A5", "#315DFF"]}
        amplitude={1.15}
        blend={0.62}
        speed={reduceMotion ? 0 : 0.55}
      />
    </div>
    <div className={`absolute inset-0 opacity-65 ${styles.grid}`} />
    <div className="absolute inset-x-0 top-0 h-[620px] bg-[radial-gradient(ellipse_at_center,rgba(5,8,7,.02)_0%,rgba(5,8,7,.20)_58%,rgba(5,8,7,.78)_100%)]" />
    <div className="absolute left-1/2 top-[31%] size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(101,242,165,.08),transparent_64%)] blur-xl" />

    <div className="absolute left-1/2 top-[31%] size-[520px] -translate-x-1/2 -translate-y-1/2">
      <span className={`absolute inset-0 rounded-full border border-[#65f2a5]/15 ${styles.signalPulse}`} />
      <span className={`absolute inset-0 rounded-full border border-[#75a7ff]/12 ${styles.signalPulseDelay}`} />
      <span className={`absolute inset-0 rounded-full border border-[#65f2a5]/10 ${styles.signalPulseDelayTwo}`} />
    </div>

    <svg viewBox="0 0 1440 720" preserveAspectRatio="none" className="absolute inset-x-0 top-16 h-[620px] w-full opacity-35">
      <defs>
        <linearGradient id="signalWave" x1="0" x2="1">
          <stop offset="0" stopColor="#65f2a5" stopOpacity="0" />
          <stop offset=".28" stopColor="#65f2a5" stopOpacity=".7" />
          <stop offset=".7" stopColor="#75a7ff" stopOpacity=".6" />
          <stop offset="1" stopColor="#75a7ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M-80 380 C130 280 250 470 430 350 S720 260 900 350 S1170 470 1520 300" fill="none" stroke="url(#signalWave)" strokeWidth="1.2" className={styles.wave} />
      <path d="M-100 430 C160 350 270 500 470 410 S760 310 960 400 S1200 500 1540 360" fill="none" stroke="url(#signalWave)" strokeWidth=".7" opacity=".55" className={styles.wave} />
    </svg>

    {particles.map(([left, top, delay], index) => (
      <span
        key={`${left}-${top}`}
        className={`absolute size-1 rounded-full ${index % 3 === 0 ? "bg-[#75a7ff]" : "bg-[#65f2a5]"} shadow-[0_0_12px_currentColor] ${styles.particle}`}
        style={{ left, top, animationDelay: delay }}
      />
    ))}

    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,8,7,.08)_48%,#050807_94%)]" />
    <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-b from-transparent to-[#050807]" />
  </div>
  );
};

export const Hero = () => (
  <section className="relative isolate overflow-hidden border-b border-white/[.07] pb-0 pt-36 sm:pt-44">
    <HeroAtmosphere />
    <div className="relative mx-auto max-w-6xl px-5 sm:px-6"><motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} className="mx-auto max-w-4xl text-center"><div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-[#65f2a5]/15 bg-[#65f2a5]/[.06] px-3 py-1.5 text-[10px] font-medium"><span className="relative flex size-2"><span className="absolute inset-0 animate-ping rounded-full bg-[#65f2a5]/50"/><span className="relative size-2 rounded-full bg-[#65f2a5]"/></span><ShinyText text="From first check to production SLO" color="#9bb2a4" shineColor="#ffffff" speed={3} delay={1}/></div>
      <h1 className={`mt-7 text-balance text-5xl font-semibold leading-[.96] tracking-[-.06em] sm:text-7xl lg:text-[86px] ${styles.display} ${styles.glowText}`}>Know the moment<br/><span className="bg-gradient-to-r from-[#65f2a5] via-[#b1f8d1] to-[#75a7ff] bg-clip-text text-transparent">your system changes.</span></h1>
      <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-white/48 sm:text-lg">UptimeSentinel brings uptime, latency, incidents, alerts, public communication, and production reliability into one operational system.</p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"><Link href="/register"><ShimmerButton shimmerColor="#65f2a5" background="linear-gradient(135deg,#f5fff9,#d8ffe9)" className="h-12 px-6 font-semibold text-[#07100d]">Start monitoring free <ArrowRight className="ml-2 size-4"/></ShimmerButton></Link><Link href="#platform" className="flex h-12 items-center rounded-full border border-white/12 bg-white/[.035] px-6 text-sm font-medium text-white/70 backdrop-blur transition-colors hover:bg-white/[.07] hover:text-white">Explore the platform</Link></div>
      <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[10px] text-white/30">{["No credit card","Setup in minutes","Recovery alerts included"].map(x=><span key={x} className="flex items-center gap-1.5"><Check className="size-3 text-[#65f2a5]"/>{x}</span>)}</div></motion.div><OperationsPreview/></div>
  </section>
);
