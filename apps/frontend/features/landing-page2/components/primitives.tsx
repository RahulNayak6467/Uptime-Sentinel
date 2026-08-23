"use client";

import type { MouseEvent, ReactNode } from "react";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import styles from "../landing-page2.module.css";

export const Reveal = ({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const Magnetic = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 18 });
  const springY = useSpring(y, { stiffness: 180, damping: 18 });

  const move = (event: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((event.clientX - rect.left - rect.width / 2) * 0.15);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.15);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={move}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
};

export const DotPattern = ({ dark = false }: { dark?: boolean }) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute inset-0 opacity-30 ${styles.grid} ${dark ? "invert" : ""}`}
  />
);

export const Marquee = ({ items }: { items: string[] }) => {
  const repeated = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-white/[.07] bg-[#07100d] py-4">
      <div className={`flex w-max items-center ${styles.marquee}`}>
        {repeated.map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center">
            <span className="px-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/28">
              {item}
            </span>
            <span className="size-1.5 rounded-full bg-[#65f2a5]" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const SectionLabel = ({ index, children }: { index: string; children: ReactNode }) => (
  <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#65f2a5]/70">
    <span className="flex size-7 items-center justify-center rounded-full border border-[#65f2a5]/20 bg-[#65f2a5]/[.05] font-mono text-[9px] text-[#65f2a5]">
      {index}
    </span>
    {children}
  </div>
);
