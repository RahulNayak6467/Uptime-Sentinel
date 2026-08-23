"use client";

import { motion, useReducedMotion } from "motion/react";

const primaryPath =
  "M44 133 C78 125 95 132 126 102 S178 139 220 108 S283 76 325 99 S389 127 431 82 S490 108 529 47 S581 73 626 28";
const comparisonPath =
  "M44 146 C85 139 111 144 148 125 S210 142 250 119 S315 106 354 118 S420 135 458 106 S516 119 554 88 S601 96 626 76";

const AnimatedResponseChart = () => {
  const reduceMotion = useReducedMotion();
  const draw = reduceMotion
    ? undefined
    : { pathLength: 1, opacity: 1 };

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.018] p-3.5">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-semibold text-white/60">
              Response time
            </span>
            <span className="flex items-center gap-1 text-[7px] text-white/25">
              <span className="size-1.5 rounded-full bg-emerald-300" /> Current
            </span>
            <span className="hidden items-center gap-1 text-[7px] text-white/25 sm:flex">
              <span className="size-1.5 rounded-full bg-blue-300/60" /> Previous
            </span>
          </div>
          <p className="mt-1 font-mono text-[12px] font-medium text-white/80">
            184 ms
            <span className="ml-1.5 text-[7px] font-normal text-emerald-300">
              ↓ 12.4%
            </span>
          </p>
        </div>
        <span className="rounded-md border border-white/[0.07] bg-white/[0.02] px-2 py-1 font-mono text-[7px] text-white/30">
          Last 24 hours
        </span>
      </div>

      <svg viewBox="0 0 650 180" className="mt-2 h-28 w-full" aria-label="Animated response-time chart">
        <defs>
          <linearGradient id="responseArea" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#34d399" stopOpacity="0.3" />
            <stop offset="0.76" stopColor="#34d399" stopOpacity="0.04" />
            <stop offset="1" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="responseStroke" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#34d399" />
            <stop offset="0.7" stopColor="#4ade80" />
            <stop offset="1" stopColor="#67e8f9" />
          </linearGradient>
          <filter id="responseGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {[28, 65, 102, 139].map((y, index) => (
          <g key={y}>
            <line x1="44" y1={y} x2="626" y2={y} stroke="rgba(255,255,255,.045)" />
            <text x="5" y={y + 3} fill="rgba(255,255,255,.2)" fontSize="7" fontFamily="monospace">
              {[600, 400, 200, 0][index]}
            </text>
          </g>
        ))}
        {[44, 190, 335, 480, 626].map((x) => (
          <line key={x} x1={x} y1="20" x2={x} y2="150" stroke="rgba(255,255,255,.026)" />
        ))}

        <line x1="44" y1="66" x2="626" y2="66" stroke="#fbbf24" strokeWidth="0.8" strokeDasharray="4 7" opacity="0.34" />
        <text x="550" y="60" fill="rgba(251,191,36,.5)" fontSize="7" fontFamily="monospace">400 ms threshold</text>

        <motion.path
          d={`${primaryPath} L626 153 L44 153Z`}
          fill="url(#responseArea)"
          initial={reduceMotion ? undefined : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25 }}
        />
        <motion.path
          d={comparisonPath}
          fill="none"
          stroke="rgba(96,165,250,.36)"
          strokeWidth="1.2"
          strokeDasharray="3 5"
          initial={reduceMotion ? undefined : { pathLength: 0, opacity: 0 }}
          whileInView={draw}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.15 }}
        />
        <motion.path
          d={primaryPath}
          fill="none"
          stroke="url(#responseStroke)"
          strokeWidth="2.2"
          strokeLinecap="round"
          filter="url(#responseGlow)"
          initial={reduceMotion ? undefined : { pathLength: 0, opacity: 0 }}
          whileInView={draw}
          viewport={{ once: true }}
          transition={{ duration: 1.45, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.g
          initial={reduceMotion ? undefined : { opacity: 0, y: 5 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.1 }}
        >
          <line x1="529" y1="47" x2="529" y2="153" stroke="rgba(103,232,249,.18)" strokeDasharray="2 4" />
          <circle cx="529" cy="47" r="4" fill="#0d0d0d" stroke="#67e8f9" strokeWidth="2" />
          <rect x="474" y="20" width="82" height="19" rx="5" fill="#111719" stroke="rgba(103,232,249,.16)" />
          <text x="515" y="32.5" textAnchor="middle" fill="rgba(255,255,255,.68)" fontSize="7" fontFamily="monospace">312 ms · 18:42</text>
        </motion.g>

        {[
          [44, "00:00"], [190, "06:00"], [335, "12:00"], [480, "18:00"], [626, "Now"],
        ].map(([x, label]) => (
          <text key={label} x={x} y="171" textAnchor={x === 44 ? "start" : x === 626 ? "end" : "middle"} fill="rgba(255,255,255,.18)" fontSize="7" fontFamily="monospace">{label}</text>
        ))}
      </svg>
    </div>
  );
};

export default AnimatedResponseChart;
