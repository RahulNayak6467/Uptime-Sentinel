"use client";

import { motion, useReducedMotion } from "motion/react";
import { Check, Mail, MessageSquare, Webhook } from "lucide-react";

const bentoPath =
  "M12 122 C52 113 76 118 112 91 S171 124 217 95 S282 67 326 88 S394 111 436 73 S492 94 532 42 S582 61 620 27";

export const BentoAnalyticsVisual = () => {
  const reduceMotion = useReducedMotion();
  return (
    <div className="absolute inset-x-5 bottom-5 h-[215px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#07090b] p-4 sm:inset-x-8">
      <div className="flex items-start justify-between">
        <div><p className="text-[9px] text-white/30">Response time · all regions</p><p className="mt-1 font-mono text-sm text-white/75">184 ms <span className="text-[8px] text-emerald-300">↓ 12%</span></p></div>
        <div className="flex gap-2 text-[8px] text-white/25"><span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-blue-300"/>p95</span><span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-emerald-300"/>median</span></div>
      </div>
      <svg viewBox="0 0 632 150" className="mt-2 h-36 w-full" aria-hidden="true">
        <defs><linearGradient id="bentoAnimatedArea" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#60a5fa" stopOpacity=".3"/><stop offset="1" stopColor="#60a5fa" stopOpacity="0"/></linearGradient><linearGradient id="bentoAnimatedLine"><stop stopColor="#60a5fa"/><stop offset="1" stopColor="#67e8f9"/></linearGradient></defs>
        {[30, 64, 98, 132].map(y => <line key={y} x1="12" y1={y} x2="620" y2={y} stroke="rgba(255,255,255,.04)"/>)}
        <line x1="12" y1="57" x2="620" y2="57" stroke="#f87171" strokeDasharray="4 8" opacity=".3"/>
        <motion.path d={`${bentoPath} L620 145 L12 145Z`} fill="url(#bentoAnimatedArea)" initial={reduceMotion ? undefined : { opacity: 0 }} whileInView={reduceMotion ? undefined : { opacity: 1 }} viewport={{ once: true }} transition={{ duration: .8 }}/>
        <motion.path d={bentoPath} fill="none" stroke="url(#bentoAnimatedLine)" strokeWidth="2" strokeLinecap="round" initial={reduceMotion ? undefined : { pathLength: 0 }} whileInView={reduceMotion ? undefined : { pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: [0.22,1,0.36,1] }}/>
        {!reduceMotion && <motion.g animate={{ x: [0, 488, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}><line x1="90" y1="15" x2="90" y2="140" stroke="rgba(103,232,249,.18)" strokeDasharray="2 4"/><circle cx="90" cy="104" r="3" fill="#67e8f9"/></motion.g>}
      </svg>
    </div>
  );
};

const alertItems = [
  { icon: Mail, event: "Recovery delivered", meta: "Email · 2s", color: "text-emerald-300" },
  { icon: MessageSquare, event: "Incident opened", meta: "Slack · 1s", color: "text-blue-300" },
  { icon: Webhook, event: "Payload signed", meta: "Webhook · 840ms", color: "text-amber-300" },
];

export const AlertRoutingVisual = () => {
  const reduceMotion = useReducedMotion();
  return <div className="mt-5 space-y-2">{alertItems.map((item,index) => <motion.div key={item.event} initial={reduceMotion ? undefined : { opacity: 0, x: 12 }} whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }} animate={reduceMotion ? undefined : { y: [0, index === 1 ? -2 : 2, 0] }} viewport={{ once: true }} transition={{ opacity: { delay: index*.1 }, x: { delay: index*.1 }, y: { duration: 3.4 + index*.4, repeat: Infinity, ease: "easeInOut" } }} className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-[#0c1012] px-3 py-2"><span className="flex items-center gap-2 text-[9px] text-white/55"><span className={`flex size-5 items-center justify-center rounded-md border border-white/[0.07] ${item.color}`}><item.icon className="size-2.5"/></span>{item.event}</span><span className="flex items-center gap-1 font-mono text-[8px] text-white/25"><Check className="size-2.5 text-emerald-300"/>{item.meta}</span></motion.div>)}</div>;
};

export const CertificateGauge = () => {
  const reduceMotion = useReducedMotion();
  return <div className="mt-4 grid grid-cols-[86px_1fr] items-center gap-4"><div className="relative size-[82px]"><svg viewBox="0 0 80 80" className="-rotate-90"><circle cx="40" cy="40" r="31" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="6"/><motion.circle cx="40" cy="40" r="31" fill="none" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" pathLength="1" initial={reduceMotion ? undefined : { pathLength: 0 }} whileInView={reduceMotion ? undefined : { pathLength: .74 }} viewport={{ once: true }} transition={{ duration: 1.1 }}/></svg><div className="absolute inset-0 flex flex-col items-center justify-center"><span className="font-mono text-base text-amber-300">23d</span><span className="text-[7px] text-white/25">remaining</span></div></div><div className="space-y-2"><p className="text-[9px] text-white/45">api.uptimesentinel.dev</p><div className="h-1 overflow-hidden rounded-full bg-white/[0.06]"><motion.div initial={{ width: 0 }} whileInView={{ width: "74%" }} viewport={{ once: true }} transition={{ duration: 1.1 }} className="h-full rounded-full bg-amber-300"/></div><p className="text-[8px] leading-4 text-white/25">Renewal warning at 14 days</p></div></div>;
};

export const RegionalScanVisual = () => {
  const reduceMotion = useReducedMotion();
  const regions = [["BOM","UP"],["FRA","DOWN"],["IAD","UP"]];
  return <div className="relative mt-5 overflow-hidden rounded-xl border border-white/[0.07] bg-black/20 p-3"><div className="grid grid-cols-3 gap-2">{regions.map(([region,status],index) => <motion.div key={region} animate={reduceMotion ? undefined : { borderColor: status === "DOWN" ? ["rgba(255,255,255,.07)","rgba(248,113,113,.4)","rgba(255,255,255,.07)"] : ["rgba(255,255,255,.07)","rgba(52,211,153,.25)","rgba(255,255,255,.07)"] }} transition={{ duration: 3, repeat: Infinity, delay: index*.5 }} className="rounded-lg border border-white/[0.07] p-2 text-center"><p className="font-mono text-[9px] text-white/40">{region}</p><p className={`mt-1 text-[8px] ${status === 'DOWN' ? 'text-red-300' : 'text-emerald-300'}`}>{status}</p></motion.div>)}</div>{!reduceMotion && <motion.span className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-cyan-300/[0.08] to-transparent" animate={{ left: ["-20%","110%"] }} transition={{ duration: 3.8, repeat: Infinity, ease: "linear" }}/>}</div>;
};

export const StatusBarsVisual = () => {
  const reduceMotion = useReducedMotion();
  return <div className="mt-5 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3"><div className="flex items-center justify-between text-[9px] text-white/45"><span>Acme services</span><span className="text-emerald-300">Operational</span></div><div className="mt-3 flex gap-1">{Array.from({ length: 18 }, (_, i) => <motion.span key={i} initial={reduceMotion ? undefined : { scaleY: .2, opacity: .2 }} whileInView={reduceMotion ? undefined : { scaleY: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i*.025, duration: .35 }} className={`h-5 flex-1 origin-bottom rounded-sm ${i === 12 ? 'bg-amber-300/70' : 'bg-emerald-300/55'}`} />)}</div></div>;
};
