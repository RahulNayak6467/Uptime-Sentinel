"use client";

import { useId } from "react";

const Sparkline = ({
  data,
  color,
  h = 30,
  w = 96,
}: {
  data: number[];
  color: string;
  h?: number;
  w?: number;
}) => {
  const uid = useId();

  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 3;

  const pts = data.map((v, i) => [
    pad + (i / (data.length - 1)) * (w - pad * 2),
    h - pad - ((v - min) / range) * (h - pad * 2),
  ]);

  let linePath = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cp = (x1 - x0) * 0.38;
    linePath += ` C ${(x0 + cp).toFixed(1)},${y0.toFixed(1)} ${(x1 - cp).toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
  }

  const last = pts[pts.length - 1];
  const first = pts[0];
  const fillPath = `${linePath} L ${last[0].toFixed(1)},${h} L ${first[0].toFixed(1)},${h} Z`;

  const gradId = `sg-grad-${uid}`;

  return (
    <svg width={w} height={h}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.08 }} />
          <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
        </linearGradient>
      </defs>

      {/* Subtle gradient fill area */}
      <path d={fillPath} style={{ fill: `url(#${gradId})` }} />

      {/* Crisp line */}
      <path
        d={linePath}
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ stroke: color }}
      />

      {/* End dot */}
      <circle cx={last[0]} cy={last[1]} r="2" style={{ fill: color }} />
    </svg>
  );
};

export default Sparkline;
