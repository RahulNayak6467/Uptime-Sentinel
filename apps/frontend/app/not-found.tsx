"use client";

import { useEffect, useState } from "react";

/**
 * Creative 404 — intentionally ignores the UptimeSentinel design system.
 * Concept: the page you asked for is a monitored endpoint that just went DOWN.
 * A live uptime trace beats a few times, then flatlines into the 404.
 */

type LogLine = { text: string; tone: "dim" | "ok" | "warn" | "err" };

export default function NotFound() {
  const [path, setPath] = useState("/the/page/you/wanted");
  const [done, setDone] = useState<LogLine[]>([]); // fully typed lines
  const [typed, setTyped] = useState(""); // chars typed on the active line
  const [tone, setTone] = useState<LogLine["tone"]>("dim"); // active line tone
  const [finished, setFinished] = useState(false);
  const [latency, setLatency] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPath(window.location.pathname || "/");
    }
  }, []);

  // Typewriter: type each "incident" log line out character by character.
  useEffect(() => {
    const real = typeof window !== "undefined" ? window.location.pathname : "/";
    const script: LogLine[] = [
      { text: `$ ping ${real}`, tone: "dim" },
      { text: "resolving host … ok", tone: "ok" },
      { text: "opening socket … ok", tone: "ok" },
      { text: "attempt 1 → no response (5000ms)", tone: "warn" },
      { text: "attempt 2 → no response (5000ms)", tone: "warn" },
      { text: "attempt 3 → connection refused", tone: "warn" },
      { text: "✗ ERROR 404 · ENDPOINT_NOT_FOUND", tone: "err" },
    ];

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let lineIdx = 0;
    let charIdx = 0;

    const tick = () => {
      if (cancelled) return;
      const line = script[lineIdx];

      if (charIdx < line.text.length) {
        charIdx += 1;
        setTone(line.tone);
        setTyped(line.text.slice(0, charIdx));
        // Slightly varied keystroke speed feels more "live".
        timer = setTimeout(tick, 18 + Math.random() * 45);
        return;
      }

      // Line complete → commit it and move to the next after a pause.
      setDone((prev) => [...prev, line]);
      setTyped("");
      lineIdx += 1;
      charIdx = 0;

      if (lineIdx >= script.length) {
        setFinished(true);
        return;
      }
      timer = setTimeout(tick, 420);
    };

    timer = setTimeout(tick, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  // Flicker a fake latency counter that never settles.
  useEffect(() => {
    const id = setInterval(() => {
      setLatency(Math.floor(2000 + Math.random() * 7000));
    }, 240);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="nf-root">
      {/* ambient layers */}
      <div className="nf-grid" aria-hidden />
      <div className="nf-scan" aria-hidden />
      <div className="nf-vignette" aria-hidden />

      <div className="nf-stage">
        {/* top status strip */}
        <div className="nf-bar">
          <span className="nf-bar-left">
            <span className="nf-dot" />
            uptimesentinel · monitor
          </span>
          <span className="nf-status">DOWN</span>
        </div>

        {/* the trace that flatlines */}
        <div className="nf-trace">
          <svg viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden>
            <path
              className="nf-line"
              pathLength={1}
              d="M0,60 L90,60 L105,60 L118,18 L132,104 L150,60 L240,60 L255,60 L268,24 L282,98 L300,60 L360,60 L600,60"
            />
          </svg>
          <span className="nf-blip" />
        </div>

        {/* the glitch headline */}
        <h1 className="nf-code" data-text="404">
          404
        </h1>
        <p className="nf-headline">SIGNAL LOST</p>
        <p className="nf-sub">
          The endpoint <code className="nf-path">{path}</code> isn&apos;t
          responding. We monitored it everywhere — it was never up.
        </p>

        {/* fake metrics */}
        <div className="nf-metrics">
          <Metric label="STATUS" value="DOWN" tone="err" />
          <Metric label="LATENCY" value={`${latency}ms`} tone="warn" />
          <Metric label="UPTIME" value="0.00%" tone="err" />
          <Metric label="LAST SEEN" value="never" tone="dim" />
        </div>

        {/* incident terminal */}
        <div className="nf-term">
          <div className="nf-term-head">
            <span className="nf-tdot r" />
            <span className="nf-tdot y" />
            <span className="nf-tdot g" />
            <span className="nf-term-title">incident.log</span>
          </div>
          <div className="nf-term-body">
            {done.map((l, i) => (
              <div key={i} className={`nf-log ${l.tone}`}>
                {l.text}
              </div>
            ))}
            {!finished ? (
              <div className={`nf-log ${tone}`}>
                {typed}
                <span className="nf-cursor" />
              </div>
            ) : (
              <span className="nf-cursor" />
            )}
          </div>
        </div>

        {/* actions */}
        <div className="nf-actions">
          <a href="/dashboard/overview" className="nf-btn primary">
            ← Back to live status
          </a>
          <button
            type="button"
            className="nf-btn ghost"
            onClick={() => window.location.reload()}
          >
            ↻ Retry ping
          </button>
        </div>
      </div>

      <style jsx>{`
        .nf-root {
          position: fixed;
          inset: 0;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(120% 120% at 50% -10%, #0b1722 0%, #05070b 55%, #030405 100%);
          color: #cfe3df;
          font-family: var(--font-geist-mono), ui-monospace, "SFMono-Regular",
            Menlo, monospace;
          padding: 24px;
          z-index: 0;
        }

        /* ambient grid */
        .nf-grid {
          position: absolute;
          inset: -2px;
          background-image:
            linear-gradient(rgba(35, 224, 168, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(35, 224, 168, 0.06) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: radial-gradient(circle at 50% 40%, #000 30%, transparent 80%);
          animation: drift 22s linear infinite;
        }
        @keyframes drift {
          from { background-position: 0 0, 0 0; }
          to { background-position: 44px 44px, 44px 44px; }
        }

        /* CRT scanlines */
        .nf-scan {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.025) 0px,
            rgba(255, 255, 255, 0.025) 1px,
            transparent 2px,
            transparent 4px
          );
          mix-blend-mode: overlay;
          pointer-events: none;
        }
        .nf-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            130% 100% at 50% 50%,
            transparent 55%,
            rgba(0, 0, 0, 0.7) 100%
          );
          pointer-events: none;
        }

        .nf-stage {
          position: relative;
          width: 100%;
          max-width: 560px;
          text-align: center;
        }

        /* status strip */
        .nf-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #5d7470;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 8px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(4px);
        }
        .nf-bar-left { display: inline-flex; align-items: center; gap: 8px; }
        .nf-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ff4d4d;
          box-shadow: 0 0 0 0 rgba(255, 77, 77, 0.6);
          animation: ping 1.6s ease-out infinite;
        }
        @keyframes ping {
          0% { box-shadow: 0 0 0 0 rgba(255, 77, 77, 0.55); }
          70% { box-shadow: 0 0 0 9px rgba(255, 77, 77, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 77, 77, 0); }
        }
        .nf-status {
          color: #ff5b5b;
          font-weight: 700;
          letter-spacing: 0.22em;
        }

        /* heartbeat trace */
        .nf-trace {
          position: relative;
          height: 110px;
          margin: 26px 0 4px;
        }
        .nf-trace svg { width: 100%; height: 100%; display: block; }
        .nf-line {
          fill: none;
          stroke: #23e0a8;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          filter: drop-shadow(0 0 6px rgba(35, 224, 168, 0.7));
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: draw 4.5s cubic-bezier(0.6, 0, 0.2, 1) infinite;
        }
        @keyframes draw {
          0% { stroke-dashoffset: 1; opacity: 1; }
          55% { stroke-dashoffset: 0; opacity: 1; }
          85% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0.25; }
        }
        .nf-blip {
          position: absolute;
          right: 2%;
          top: 50%;
          width: 7px;
          height: 7px;
          margin-top: -3.5px;
          border-radius: 50%;
          background: #23e0a8;
          box-shadow: 0 0 10px 2px rgba(35, 224, 168, 0.9);
          animation: blink 1s steps(2) infinite;
        }
        @keyframes blink { 50% { opacity: 0.15; } }

        /* glitch 404 */
        .nf-code {
          position: relative;
          font-size: clamp(96px, 22vw, 168px);
          line-height: 0.9;
          font-weight: 800;
          letter-spacing: 0.04em;
          margin: 4px 0 0;
          color: #eafff7;
          text-shadow: 0 0 24px rgba(35, 224, 168, 0.25);
        }
        .nf-code::before,
        .nf-code::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          overflow: hidden;
        }
        .nf-code::before {
          color: #ff3b6b;
          animation: glitchA 2.6s infinite linear alternate-reverse;
        }
        .nf-code::after {
          color: #2ad6ff;
          animation: glitchB 2s infinite linear alternate-reverse;
        }
        @keyframes glitchA {
          0% { clip-path: inset(8% 0 78% 0); transform: translate(-3px, -1px); }
          25% { clip-path: inset(54% 0 20% 0); transform: translate(3px, 1px); }
          50% { clip-path: inset(30% 0 50% 0); transform: translate(-2px, 1px); }
          75% { clip-path: inset(70% 0 6% 0); transform: translate(2px, -2px); }
          100% { clip-path: inset(20% 0 60% 0); transform: translate(-3px, 1px); }
        }
        @keyframes glitchB {
          0% { clip-path: inset(70% 0 8% 0); transform: translate(3px, 1px); }
          25% { clip-path: inset(12% 0 72% 0); transform: translate(-3px, -1px); }
          50% { clip-path: inset(46% 0 30% 0); transform: translate(2px, 2px); }
          75% { clip-path: inset(24% 0 56% 0); transform: translate(-2px, -1px); }
          100% { clip-path: inset(60% 0 18% 0); transform: translate(3px, 1px); }
        }

        .nf-headline {
          margin: 6px 0 0;
          font-size: 14px;
          letter-spacing: 0.5em;
          padding-left: 0.5em;
          color: #7ef5cf;
          font-weight: 600;
        }
        .nf-sub {
          margin: 14px auto 0;
          max-width: 440px;
          font-size: 13px;
          line-height: 1.6;
          color: #8aa39d;
        }
        .nf-path {
          color: #eafff7;
          background: rgba(35, 224, 168, 0.1);
          border: 1px solid rgba(35, 224, 168, 0.2);
          border-radius: 5px;
          padding: 1px 6px;
          font-size: 12px;
          word-break: break-all;
        }

        /* metrics */
        .nf-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin: 22px 0;
        }

        /* terminal */
        .nf-term {
          text-align: left;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          background: rgba(2, 8, 8, 0.7);
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        .nf-term-head {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(255, 255, 255, 0.02);
        }
        .nf-tdot { width: 9px; height: 9px; border-radius: 50%; }
        .nf-tdot.r { background: #ff5f56; }
        .nf-tdot.y { background: #ffbd2e; }
        .nf-tdot.g { background: #27c93f; }
        .nf-term-title {
          margin-left: 8px;
          font-size: 11px;
          color: #5d7470;
          letter-spacing: 0.08em;
        }
        .nf-term-body {
          padding: 12px 14px;
          min-height: 150px;
          font-size: 12.5px;
          line-height: 1.85;
        }
        .nf-log { white-space: pre-wrap; word-break: break-all; }
        .nf-log.dim { color: #6f8783; }
        .nf-log.ok { color: #23e0a8; }
        .nf-log.warn { color: #ffc24b; }
        .nf-log.err { color: #ff5b6e; font-weight: 600; }
        .nf-cursor {
          display: inline-block;
          width: 8px;
          height: 15px;
          background: #23e0a8;
          vertical-align: -2px;
          animation: blink 1s steps(2) infinite;
        }

        /* actions */
        .nf-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-top: 22px;
          flex-wrap: wrap;
        }
        .nf-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          height: 42px;
          font-family: inherit;
          font-size: 13px;
          line-height: 1;
          letter-spacing: 0.04em;
          padding: 0 18px;
          margin: 0;
          border-radius: 8px;
          cursor: pointer;
          transition: transform 0.12s ease, box-shadow 0.2s ease,
            background 0.2s ease;
          text-decoration: none;
          white-space: nowrap;
          vertical-align: top;
          -webkit-appearance: none;
          appearance: none;
        }
        .nf-btn:active { transform: translateY(1px); }
        .nf-btn.primary {
          background: #23e0a8;
          color: #04150f;
          font-weight: 700;
          border: 1px solid #23e0a8;
          box-shadow: 0 0 22px rgba(35, 224, 168, 0.35);
        }
        .nf-btn.primary:hover { box-shadow: 0 0 30px rgba(35, 224, 168, 0.55); }
        .nf-btn.ghost {
          background: transparent;
          color: #9fb6b1;
          border: 1px solid rgba(255, 255, 255, 0.14);
        }
        .nf-btn.ghost:hover {
          color: #eafff7;
          border-color: rgba(35, 224, 168, 0.45);
        }

        @media (max-width: 480px) {
          .nf-metrics { grid-template-columns: repeat(2, 1fr); }
        }
        @media (prefers-reduced-motion: reduce) {
          .nf-line, .nf-blip, .nf-dot, .nf-code::before, .nf-code::after,
          .nf-grid, .nf-cursor {
            animation: none;
          }
          .nf-line { stroke-dashoffset: 0; }
        }
      `}</style>
    </main>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "err" | "warn" | "dim";
}) {
  return (
    <div className="m-box">
      <span className="m-label">{label}</span>
      <span className={`m-value ${tone}`}>{value}</span>
      <style jsx>{`
        .m-box {
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: flex-start;
          padding: 10px 12px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.02);
        }
        .m-label {
          font-size: 9.5px;
          letter-spacing: 0.16em;
          color: #5d7470;
        }
        .m-value {
          font-size: 15px;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }
        .m-value.err { color: #ff5b6e; }
        .m-value.warn { color: #ffc24b; }
        .m-value.dim { color: #8aa39d; }
      `}</style>
    </div>
  );
}
