"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Activity, ArrowRight, BellRing, Braces, ChartNoAxesCombined, Check, ChevronDown, Cloud, Code2, Database, Gauge, GitBranch, Globe2, Layers3, Mail, MapPin, Network, RadioTower, ScanSearch, ServerCog, ShieldCheck, Webhook, Workflow, X } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Reveal, SectionLabel } from "./primitives";
import styles from "../landing-page2.module.css";

const capabilities = [
  { icon: RadioTower, title:"HTTP monitoring", text:"Scheduled checks track availability, response codes, and latency for every endpoint.", tone:"text-[#65f2a5]" },
  { icon: ChartNoAxesCombined, title:"Time-window analytics", text:"Understand 24-hour, 7-day, and 30-day uptime and response-time patterns.", tone:"text-[#75a7ff]" },
  { icon: ScanSearch, title:"Incident intelligence", text:"One durable incident from qualifying failure through verified recovery.", tone:"text-[#ff8d8d]" },
  { icon: BellRing, title:"Alert lifecycle", text:"Downtime and recovery emails close the loop without duplicate incident noise.", tone:"text-[#ffd27a]" },
  { icon: Braces, title:"Custom health rules", text:"Evolve beyond status codes with body, header, timing, SSL, and DNS checks.", tone:"text-[#c8a9ff]" },
  { icon: Globe2, title:"Public status pages", text:"Turn private monitoring truth into clear, selective customer communication.", tone:"text-[#7be8f6]" },
];

const FeatureCard = ({item,index}:{item:typeof capabilities[number];index:number}) => <Reveal delay={index*.05} className="relative min-h-[235px] rounded-2xl border border-white/[.08] bg-white/[.022] p-6 transition-colors hover:bg-white/[.04]"><GlowingEffect disabled={false} proximity={70} spread={35} borderWidth={1}/><span className={`flex size-10 items-center justify-center rounded-xl border border-white/[.08] bg-white/[.035] ${item.tone}`}><item.icon className="size-4.5"/></span><p className="mt-12 text-[9px] font-semibold uppercase tracking-[.16em] text-white/20">Capability 0{index+1}</p><h3 className="mt-2 text-lg font-semibold tracking-[-.03em]">{item.title}</h3><p className="mt-3 text-xs leading-5 text-white/35">{item.text}</p></Reveal>;

export const PlatformSection = () => (
  <section id="platform" className="border-b border-white/[.07] py-28 sm:py-36"><div className="mx-auto max-w-6xl px-5 sm:px-6"><Reveal className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><SectionLabel index="01">Platform surface</SectionLabel><h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">Every signal earns<br/>its place.</h2></div><p className="max-w-xl text-sm leading-7 text-white/40 lg:justify-self-end">UptimeSentinel starts with a correct monitoring core, then compounds it into a complete reliability platform. No disconnected tools. No context lost between check, incident, alert, and recovery.</p></Reveal><div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{capabilities.map((item,index)=><FeatureCard key={item.title} item={item} index={index}/>)}</div></div></section>
);

const comparisonRows = [
  ["Monitoring data", "Scattered across check logs", "One operational timeline"],
  ["Repeated failures", "Duplicate noise and alerts", "One durable incident"],
  ["Recovery", "A status flips back to green", "Verified and communicated"],
  ["Analytics", "Charts without incident context", "Latency, uptime, and events connected"],
];

export const WhySection = () => (
  <section id="why" className="relative border-b border-white/[.07] bg-[#eef4f0] py-28 text-[#0b1510] sm:py-36">
    <div className="absolute inset-x-0 top-0 h-24 -translate-y-full bg-gradient-to-t from-[#eef4f0] to-transparent" />
    <div className="mx-auto max-w-6xl px-5 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
        <div><div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.2em] text-[#16663f]"><span className="flex size-7 items-center justify-center rounded-full border border-[#16663f]/20 bg-[#16663f]/5 font-mono text-[9px]">02</span>Why UptimeSentinel</div><h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">Monitoring should<br/>explain what happened.</h2></div>
        <p className="max-w-xl text-sm leading-7 text-[#0b1510]/55 lg:justify-self-end">Most uptime tools stop at red or green. UptimeSentinel keeps the evidence, incident state, response, notification, and recovery connected so operators do not reconstruct the event after the fact.</p>
      </div>
      <div className="mt-14 overflow-x-auto rounded-[26px] border border-[#0b1510]/12 bg-white/55 shadow-[0_30px_80px_rgba(11,21,16,.08)]">
        <div className="grid min-w-[680px] grid-cols-[1fr_.8fr_.8fr] border-b border-[#0b1510]/10 bg-white/45 px-5 py-4 text-[9px] font-bold uppercase tracking-[.14em] text-[#0b1510]/35 sm:px-7"><span>Operational question</span><span>Disconnected tools</span><span className="text-[#16663f]">UptimeSentinel</span></div>
        {comparisonRows.map(([label,ordinary,statusforge]) => <div key={label} className="grid min-w-[680px] grid-cols-[1fr_.8fr_.8fr] items-center border-b border-[#0b1510]/8 px-5 py-5 text-xs last:border-0 sm:px-7"><span className="font-semibold">{label}</span><span className="flex items-center gap-2 text-[#0b1510]/40"><X className="size-3 text-[#b45353]" />{ordinary}</span><span className="flex items-center gap-2 font-medium text-[#16663f]"><Check className="size-3" />{statusforge}</span></div>)}
      </div>
    </div>
  </section>
);

const timeline = [
  ["14:32:08","Failure threshold met","Three failed checks qualify. One incident opens.","bg-[#ff7777]"],
  ["14:32:10","Responders notified","Email carries the monitor, error, and incident context.","bg-[#ffd27a]"],
  ["14:37:24","Investigation recorded","Human updates join automatic state changes in one timeline.","bg-[#75a7ff]"],
  ["14:47:41","Recovery verified","Healthy checks resolve the incident and trigger recovery.","bg-[#65f2a5]"],
];

export const OperationsSection = () => (
  <section id="operations" className="relative overflow-hidden border-b border-white/[.07] py-28 sm:py-36"><div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_50%,rgba(101,242,165,.07),transparent_32%),radial-gradient(circle_at_85%_45%,rgba(117,167,255,.06),transparent_32%)]"/><div className="relative mx-auto grid max-w-6xl items-center gap-16 px-5 sm:px-6 lg:grid-cols-[.8fr_1.2fr]"><Reveal><SectionLabel index="03">Incident operations</SectionLabel><h2 className="mt-5 text-balance text-4xl font-semibold tracking-[-.05em] sm:text-6xl">An outage is a story,<br/><span className="text-white/30">not a row of errors.</span></h2><p className="mt-6 max-w-lg text-sm leading-7 text-white/40">State-aware incident handling connects automated evidence with human response, then verifies recovery before closing the event.</p><div className="mt-8 grid grid-cols-2 gap-3">{[["1","active incident"],["15m 33s","time to recovery"],["3","failed checks"],["2","response updates"]].map(([v,l])=><div key={l} className="rounded-xl border border-white/[.07] bg-white/[.02] p-4"><p className="text-xl font-semibold">{v}</p><p className="mt-1 text-[9px] text-white/25">{l}</p></div>)}</div></Reveal><Reveal delay={.1} className="relative overflow-hidden rounded-[26px] border border-white/[.09] bg-[#090d0b] p-2 shadow-2xl shadow-black/40"><BorderBeam size={160} duration={9} colorFrom="#ff7777" colorTo="#65f2a5"/><div className="rounded-[19px] border border-white/[.07] bg-[#070a08] p-5 sm:p-7"><div className="flex items-center justify-between border-b border-white/[.07] pb-5"><div><p className="text-sm font-semibold">Checkout API outage</p><p className="mt-1 font-mono text-[8px] text-white/25">INC-0718 · PRODUCTION</p></div><span className="rounded-full border border-[#ff7777]/20 bg-[#ff7777]/10 px-3 py-1 text-[8px] font-semibold text-[#ff9999]">RESOLVED</span></div><ol className="mt-7">{timeline.map(([time,title,copy,tone],index)=><li key={title} className="relative flex gap-4 pb-7 last:pb-0">{index<timeline.length-1&&<span className="absolute left-[5px] top-4 h-full w-px bg-white/[.08]"/>}<span className={`relative z-10 mt-1 size-2.5 shrink-0 rounded-full ring-4 ring-[#070a08] ${tone}`}/><div className="flex-1"><div className="flex items-center justify-between gap-3"><p className="text-xs font-medium text-white/75">{title}</p><span className="font-mono text-[8px] text-white/20">{time}</span></div><p className="mt-1.5 text-[10px] leading-5 text-white/30">{copy}</p></div></li>)}</ol></div></Reveal></div></section>
);

const ecosystemGroups = [
  { icon: RadioTower, title: "Detect", items: ["HTTP checks", "SSL & DNS", "Regional probes"], tone: "#65f2a5" },
  { icon: Layers3, title: "Understand", items: ["Analytics", "Incidents", "Audit history"], tone: "#75a7ff" },
  { icon: BellRing, title: "Respond", items: ["Email", "Slack & Discord", "Signed webhooks"], tone: "#ffd27a" },
  { icon: Globe2, title: "Communicate", items: ["Status pages", "Exports", "Recovery updates"], tone: "#7be8f6" },
  { icon: ShieldCheck, title: "Protect", items: ["SSRF defense", "API lifecycle", "Rate limits"], tone: "#c8a9ff" },
  { icon: Gauge, title: "Operate", items: ["Observability", "Deployment", "SLOs & runbooks"], tone: "#ff9e9e" },
];

export const EcosystemSection = () => (
  <section id="ecosystem" className="relative overflow-hidden border-b border-white/[.07] py-28 sm:py-36">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(101,242,165,.055),transparent_42%)]" />
    <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
      <div className="mx-auto max-w-3xl text-center"><SectionLabel index="04">Full product ecosystem</SectionLabel><h2 className="mt-5 text-balance text-4xl font-semibold tracking-[-.05em] sm:text-6xl">One reliability loop.<br/><span className="text-white/30">Every operational layer.</span></h2><p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/40">UptimeSentinel grows from endpoint detection into the complete path for understanding, responding, communicating, protecting, and operating production.</p></div>
      <div className="relative mt-16 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <div className="absolute left-1/2 top-1/2 hidden size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#65f2a5]/8 lg:block" />
        {ecosystemGroups.map((group) => <article key={group.title} className="relative rounded-2xl border border-white/[.08] bg-[#080d0a]/85 p-6 backdrop-blur"><div className="flex items-center justify-between"><span className="flex size-10 items-center justify-center rounded-xl border border-white/[.08] bg-white/[.03]" style={{color:group.tone}}><group.icon className="size-4" /></span><GitBranch className="size-3.5 text-white/15" /></div><h3 className="mt-8 text-lg font-semibold">{group.title}</h3><div className="mt-4 flex flex-wrap gap-2">{group.items.map((item) => <span key={item} className="rounded-full border border-white/[.07] bg-white/[.02] px-3 py-1.5 text-[9px] text-white/35">{item}</span>)}</div></article>)}
        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#65f2a5]/20 bg-[#07100d] shadow-[0_0_60px_rgba(101,242,165,.15)] lg:flex"><Activity className="size-5 text-[#65f2a5]" /></div>
      </div>
      <p className="mt-5 text-center text-[9px] uppercase tracking-[.16em] text-white/20">Current and roadmap capabilities · maturity shown below</p>
    </div>
  </section>
);

const nodes = [
  {icon:RadioTower,label:"Endpoints",pos:"left-4 top-10"},{icon:Database,label:"Check history",pos:"left-4 bottom-10"},{icon:Mail,label:"Email",pos:"right-4 top-10"},{icon:Webhook,label:"Webhooks",pos:"right-4 bottom-10"},
];
export const SignalNetworkSection = () => (
  <section className="border-b border-white/[.07] py-28 sm:py-36"><div className="mx-auto max-w-6xl px-5 sm:px-6"><Reveal className="mx-auto max-w-2xl text-center"><SectionLabel index="05">Signal network</SectionLabel><h2 className="mt-5 text-balance text-4xl font-semibold tracking-[-.05em] sm:text-6xl">From every check.<br/>To every response.</h2><p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/40">A shared event model connects worker execution, historical evidence, incident transitions, alert delivery, and live clients.</p></Reveal><div className="relative mx-auto mt-14 h-[440px] max-w-4xl overflow-hidden rounded-[28px] border border-white/[.08] bg-white/[.018]"><div className={`absolute inset-0 opacity-40 ${styles.grid}`}/><svg viewBox="0 0 800 440" preserveAspectRatio="none" className="absolute inset-0 size-full"><path d="M120 90 C270 90 270 220 370 220" fill="none" stroke="#65f2a5" strokeWidth="1.5" className={styles.flow}/><path d="M120 350 C270 350 270 220 370 220" fill="none" stroke="#75a7ff" strokeWidth="1.5" className={styles.flow}/><path d="M430 220 C540 220 535 90 680 90" fill="none" stroke="#65f2a5" strokeWidth="1.5" className={styles.flow}/><path d="M430 220 C540 220 535 350 680 350" fill="none" stroke="#75a7ff" strokeWidth="1.5" className={styles.flow}/></svg>{nodes.map(({icon:Icon,label,pos})=><div key={label} className={`absolute ${pos} flex w-32 items-center gap-2 rounded-xl border border-white/10 bg-[#0a0f0c] p-3 shadow-xl`}><span className="flex size-8 items-center justify-center rounded-lg bg-white/[.04] text-[#65f2a5]"><Icon className="size-3.5"/></span><span className="text-[9px] text-white/45">{label}</span></div>)}<div className="absolute left-1/2 top-1/2 flex size-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[#65f2a5]/20 bg-[#08110d] shadow-[0_0_70px_rgba(101,242,165,.12)]"><Activity className="size-5 text-[#65f2a5]"/><p className="mt-2 text-xs font-semibold">UptimeSentinel</p><p className="text-[7px] uppercase tracking-[.16em] text-white/20">event core</p></div></div></div></section>
);

const stages = [
  {range:"V0—V3",title:"Foundation",text:"URL checks, persistence, authentication, ownership, and automatic scheduling.",icon:Code2,state:"Built"},
  {range:"V4—V6",title:"Reliability engine",text:"Queues, workers, incidents, alerts, analytics, dashboard, and live updates.",icon:Workflow,state:"Active"},
  {range:"V7—V10",title:"Monitoring depth",text:"Custom rules, SSL, DNS, status pages, exports, integrations, and API security.",icon:Braces,state:"Next"},
  {range:"V11—V13",title:"Scale and reach",text:"Performance, retention, caching, multi-region checks, and delivery integrations.",icon:Network,state:"Planned"},
  {range:"V15—V18",title:"Production maturity",text:"Observability, comprehensive testing, deployment, dogfooding, SLOs, and runbooks.",icon:ServerCog,state:"Planned"},
];
export const VisionSection = () => (
  <section id="vision" className="relative overflow-hidden border-b border-white/[.07] bg-[#070b12] py-28 sm:py-36"><div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_110%,rgba(117,167,255,.16),transparent_44%)]"/><div className="relative mx-auto max-w-[1320px] px-5 sm:px-6"><Reveal className="mx-auto max-w-3xl text-center"><SectionLabel index="06">V0 to V18</SectionLabel><h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">A deliberate path to<br/>production maturity.</h2><p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/40">Each layer earns the next. Future capabilities are roadmap direction—not claims about what ships today.</p></Reveal><div className="relative mt-16"><div className="absolute left-[10%] right-[10%] top-10 hidden h-px bg-gradient-to-r from-[#65f2a5]/60 via-[#75a7ff]/35 to-white/10 lg:block"/><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">{stages.map((stage,index)=><article key={stage.range} className="relative rounded-2xl border border-white/[.08] bg-[#0a0f18]/90 p-5 backdrop-blur"><div className="relative z-10 flex items-center justify-between"><span className={`flex size-10 items-center justify-center rounded-full border ${index<2?"border-[#65f2a5]/25 bg-[#65f2a5]/10 text-[#65f2a5]":"border-white/10 bg-[#070b12] text-white/30"}`}><stage.icon className="size-4"/></span><span className={`rounded-full border px-2 py-1 text-[7px] font-semibold uppercase tracking-wider ${stage.state==="Built"?"border-[#65f2a5]/20 text-[#65f2a5]":stage.state==="Active"?"border-[#75a7ff]/25 text-[#9bbcff]":"border-white/10 text-white/20"}`}>{stage.state}</span></div><p className="mt-8 font-mono text-[8px] text-white/20">{stage.range}</p><h3 className="mt-2 text-sm font-semibold text-white/75">{stage.title}</h3><p className="mt-3 text-[10px] leading-5 text-white/28">{stage.text}</p></article>)}</div></div><div className="mt-5 grid gap-3 sm:grid-cols-4">{[[ShieldCheck,"Security"],[Cloud,"Deployment"],[MapPin,"Multi-region"],[Gauge,"SLO operations"]].map(([Icon,label])=>{const I=Icon as typeof ShieldCheck;return <div key={label as string} className="flex items-center justify-center gap-2 rounded-xl border border-white/[.06] bg-white/[.012] py-3 text-[9px] text-white/25"><I className="size-3 text-[#75a7ff]"/>{label as string}</div>})}</div></div></section>
);

const questions = [
  ["What is available in the active product?","The V6 foundation covers authenticated endpoint monitoring, automated checks, history, uptime and latency analytics, incidents, email alerts, dashboard views, and live updates."],
  ["Why does the page mention V18?","You asked for the complete UptimeSentinel vision. The roadmap section explicitly separates built, active, next, and planned layers so future scope is visible without being misrepresented."],
  ["How does UptimeSentinel prevent incident noise?","The incident state machine keeps repeated failed checks attached to the active incident, then resolves it only when recovery is verified."],
  ["Where does the platform go after V6?","It expands through custom health rules, SSL and DNS monitoring, public status pages, integrations, security hardening, scaling, multi-region checks, observability, deployment, testing, and SLO-driven operations."],
];
export const FaqAndCta = () => {
  const [open,setOpen]=useState(0);

  return <>
    <section id="faq" className="border-b border-white/[.07] py-28 sm:py-36">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 sm:px-6 lg:grid-cols-[.7fr_1.3fr]">
        <Reveal><SectionLabel index="07">Questions</SectionLabel><h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">Clear boundaries<br/>build trust.</h2><p className="mt-4 text-sm leading-6 text-white/35">What exists today and where the system is going.</p></Reveal>
        <div className="border-t border-white/10">{questions.map(([q,a],index)=>{const active=index===open;return <div key={q} className="border-b border-white/10"><button className="flex w-full items-center justify-between gap-6 py-5 text-left" onClick={()=>setOpen(active?-1:index)} aria-expanded={active}><span className="text-sm font-medium text-white/65">{q}</span><ChevronDown className={`size-4 text-white/25 transition-transform ${active?"rotate-180":""}`}/></button><AnimatePresence initial={false}>{active&&<motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden"><p className="max-w-2xl pb-5 text-xs leading-6 text-white/35">{a}</p></motion.div>}</AnimatePresence></div>})}</div>
      </div>
    </section>

    <section className="relative isolate min-h-[620px] overflow-hidden border-b border-white/[.07] bg-black text-center sm:min-h-[720px]">
      <Image
        src="/landing-page2/statusforge-signal-hands.png"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-center opacity-90"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,#050807_0%,rgba(5,8,7,.62)_18%,rgba(0,0,0,.34)_48%,rgba(0,0,0,.5)_76%,#050807_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_46%,rgba(0,0,0,.08),rgba(0,0,0,.72)_72%)]" />
      <Reveal className="mx-auto flex min-h-[620px] max-w-4xl flex-col items-center px-5 pt-20 sm:min-h-[720px] sm:pt-24">
        <p className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#8af6b8]">Close the distance between failure and recovery</p>
        <h2 className="mt-5 text-balance text-5xl font-semibold leading-[.95] tracking-[-.06em] sm:text-7xl">Make every<br/>signal count.</h2>
        <p className="mt-5 max-w-lg text-sm leading-7 text-white/50">Start with one endpoint. Build an operational picture your team can trust.</p>
        <Link href="/register" className="mt-8 flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-black shadow-[0_0_40px_rgba(255,255,255,.12)] transition-transform hover:scale-[1.03]">Start monitoring free <ArrowRight className="size-4"/></Link>
      </Reveal>
    </section>
  </>;
};

const footerColumns = [
  { title:"Product", links:[["Platform","#platform"],["Why UptimeSentinel","#why"],["Operations","#operations"],["Ecosystem","#ecosystem"]] },
  { title:"Explore", links:[["Vision V0—V18","#vision"],["FAQ","#faq"],["Dashboard","/dashboard/overview"]] },
  { title:"Account", links:[["Sign in","/login"],["Create account","/register"]] },
];
export const Footer = () => <footer className="border-t border-white/[.07] bg-[#040605] px-5 py-14 sm:px-6"><div className="mx-auto max-w-6xl"><div className="grid gap-12 border-b border-white/[.07] pb-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]"><div><Link href="/landing-page2" className="flex items-center gap-2.5"><span className="flex size-9 items-center justify-center rounded-lg bg-[#65f2a5]/10 text-[#65f2a5]"><Activity className="size-4"/></span><span className="text-sm font-semibold">UptimeSentinel</span></Link><p className="mt-4 max-w-xs text-xs leading-5 text-white/28">Operational clarity from the first endpoint check to production SLOs.</p><div className="mt-5 flex items-center gap-2 text-[9px] text-[#65f2a5]/70"><span className="relative flex size-2"><span className="absolute inset-0 animate-ping rounded-full bg-[#65f2a5]/40"/><span className="relative size-2 rounded-full bg-[#65f2a5]"/></span>All systems operational</div></div>{footerColumns.map(column=><div key={column.title}><p className="text-[9px] font-semibold uppercase tracking-[.16em] text-white/20">{column.title}</p><div className="mt-4 space-y-3">{column.links.map(([label,href])=><Link key={label} href={href} className="block text-[10px] text-white/30 transition-colors hover:text-white/65">{label}</Link>)}</div></div>)}</div><div className="flex flex-col gap-3 pt-6 text-[9px] text-white/15 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 UptimeSentinel</span><span>Built deliberately · V0—V18</span></div></div></footer>;
