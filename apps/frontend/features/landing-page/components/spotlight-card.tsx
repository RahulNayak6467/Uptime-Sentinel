"use client";

import { MouseEvent, ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
};

const SpotlightCard = ({
  children,
  className,
  spotlightColor = "rgba(52, 211, 153, 0.13)",
}: SpotlightCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--spotlight-x", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--spotlight-y", `${event.clientY - bounds.top}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handlePointerMove}
      style={{
        backgroundImage: `radial-gradient(420px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), ${spotlightColor}, transparent 44%)`,
      }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#090c0e] transition-colors hover:border-white/[0.14]",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default SpotlightCard;
