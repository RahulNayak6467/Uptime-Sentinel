"use client";

import { motion, useReducedMotion } from "motion/react";
import { Check, CircleDot, Fingerprint, HeartPulse, ScrollText, ShieldCheck } from "lucide-react";
import styles from "../landing-page.module.css";

const logs = [
  ["14:32:08", "check.completed", "200 · 184ms", "text-emerald-300"],
  ["14:32:38", "threshold.crossed", "p95 > 400ms", "text-amber-300"],
  ["14:32:39", "incident.created", "INC-0718", "text-red-300"],
  ["14:32:40", "alert.delivered", "slack · email", "text-blue-300"],
  ["14:47:41", "incident.resolved", "MTTR 15m", "text-emerald-300"],
];

const ReliabilitySection = () => {
  const reduceMotion = useReducedMotion();
  return (
    <section className="relative border-b border-white/[0.07] py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center"><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-300/75">Reliability, observable</p><h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">The monitoring system is monitored too.</h2><p className="mt-5 text-sm leading-6 text-white/45 sm:text-base">Metrics, logs, traces, health checks, and audit history make every decision explainable.</p></div>

        <div className="mt-14 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#080a0c] p-[1px]">
            <div className={`pointer-events-none absolute -inset-[45%] ${styles.borderBeam}`} />
            <div className="relative rounded-[23px] bg-[#080a0c] p-5 sm:p-7">
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-4"><div className="flex gap-1.5"><span className="size-2 rounded-full bg-red-400/60"/><span className="size-2 rounded-full bg-amber-300/60"/><span className="size-2 rounded-full bg-emerald-300/60"/></div><span className="font-mono text-[8px] text-white/25">uptimesentinel / event-stream</span><span className="flex items-center gap-1 text-[8px] text-emerald-300"><CircleDot className="size-2.5"/>LIVE</span></div>
              <div className="mt-5 font-mono">
                <p className="text-[10px] text-white/30"><span className="text-emerald-300">$</span> sf trace --incident INC-0718 --follow</p>
                <div className="mt-5 space-y-1.5">{logs.map(([time,event,value,tone], index) => <motion.div key={event} initial={reduceMotion ? undefined : { opacity: 0, x: -8 }} whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * .14 }} className="grid grid-cols-[60px_1fr_auto] gap-3 rounded-lg px-2 py-2 text-[9px] hover:bg-white/[0.025]"><span className="text-white/20">{time}</span><span className={tone}>{event}</span><span className="text-white/35">{value}</span></motion.div>)}</div>
                <p className="mt-5 flex items-center gap-2 text-[9px] text-white/25"><span className="inline-block h-3 w-1.5 animate-pulse bg-emerald-300"/>waiting for events...</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {[{icon:ShieldCheck,title:'Secure by default',text:'SSRF controls, signed webhooks, strict ownership, and stable API contracts.',tone:'text-emerald-300'},{icon:HeartPulse,title:'Health at every layer',text:'API, database, Redis, scheduler, workers, and queues report independently.',tone:'text-red-300'},{icon:Fingerprint,title:'Trace every decision',text:'Correlation IDs connect check execution, incident state, and alert delivery.',tone:'text-blue-300'}].map((item,index) => <motion.div key={item.title} initial={reduceMotion ? undefined : { opacity: 0, x: 16 }} whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay:index*.1 }} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5"><div className="flex items-center gap-3"><span className={`flex size-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] ${item.tone}`}><item.icon className="size-4"/></span><h3 className="text-sm font-semibold text-white/75">{item.title}</h3></div><p className="mt-3 text-xs leading-5 text-white/35">{item.text}</p></motion.div>)}
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">{[[ScrollText,'Immutable audit trail'],[Check,'Automated quality gates'],[HeartPulse,'SLO-driven operations']].map(([Icon,label]) => { const ItemIcon = Icon as typeof Check; return <div key={label as string} className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.018] px-4 py-3 text-[10px] text-white/35"><ItemIcon className="size-3 text-emerald-300"/>{label as string}</div>; })}</div>
      </div>
    </section>
  );
};

export default ReliabilitySection;
