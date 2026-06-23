"use client";

import { useEffect, useState } from "react";

type LoadingScreenProps = {
  title?: string;
  messages?: string[];
  fullScreen?: boolean;
};

const DEFAULT_MESSAGES = [
  "Pinging endpoints…",
  "Collecting latency samples…",
  "Reading check history…",
  "Almost there…",
];

const LoadingScreen = ({
  title = "Loading",
  messages = DEFAULT_MESSAGES,
  fullScreen = true,
}: LoadingScreenProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 1800);
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`flex flex-col items-center justify-center gap-7 bg-sf-bg ${
        fullScreen ? "fixed inset-0 z-50" : "w-full h-full min-h-60"
      }`}
    >
      <div className="ls-radar">
        <span className="ls-ripple" />
        <span className="ls-ripple ls-ripple-2" />
        <span className="ls-ripple ls-ripple-3" />

        <span className="ls-core">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="26"
              height="26"
              rx="6"
              fill="var(--color-sf-logo-bg)"
            />
            <polyline
              points="7 20 11 10 15 16 19 8"
              fill="none"
              stroke="var(--color-sf-logo-stroke)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <span className="ls-sweep" />
      </div>

      <div className="flex flex-col items-center gap-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[15px] font-semibold font-sans text-sf-text">
            {title}
          </span>
          <span className="ls-dots">
            <span />
            <span />
            <span />
          </span>
        </div>

        <p
          key={index}
          className="ls-message text-[12.5px] font-sans text-sf-text-sub h-4"
        >
          {messages[index]}
        </p>
      </div>

      <style jsx>{`
        .ls-radar {
          position: relative;
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* expanding ping rings */
        .ls-ripple {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1.5px solid var(--color-sf-green);
          opacity: 0;
          animation: ls-ping 2.4s cubic-bezier(0, 0.2, 0.4, 1) infinite;
        }
        .ls-ripple-2 {
          animation-delay: 0.8s;
        }
        .ls-ripple-3 {
          animation-delay: 1.6s;
        }
        @keyframes ls-ping {
          0% {
            transform: scale(0.3);
            opacity: 0.55;
          }
          80% {
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }

        /* rotating radar sweep wedge */
        .ls-sweep {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            rgba(22, 163, 74, 0.28) 0deg,
            rgba(22, 163, 74, 0) 60deg,
            rgba(22, 163, 74, 0) 360deg
          );
          mask: radial-gradient(circle, transparent 24px, #000 25px);
          -webkit-mask: radial-gradient(circle, transparent 24px, #000 25px);
          animation: ls-spin 1.8s linear infinite;
        }
        @keyframes ls-spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* center logo, gently breathing */
        .ls-core {
          position: relative;
          z-index: 1;
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-sf-surface);
          border: 1px solid var(--color-sf-border);
          box-shadow: var(--shadow-sf-card);
          animation: ls-breathe 2s ease-in-out infinite;
        }
        @keyframes ls-breathe {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.07);
          }
        }

        /* animated trailing dots after the title */
        .ls-dots {
          display: inline-flex;
          align-items: flex-end;
          gap: 3px;
          padding-bottom: 2px;
        }
        .ls-dots span {
          width: 3.5px;
          height: 3.5px;
          border-radius: 50%;
          background: var(--color-sf-text-muted);
          animation: ls-bounce 1.2s ease-in-out infinite;
        }
        .ls-dots span:nth-child(2) {
          animation-delay: 0.15s;
        }
        .ls-dots span:nth-child(3) {
          animation-delay: 0.3s;
        }
        @keyframes ls-bounce {
          0%,
          60%,
          100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }

        /* fade each cycled message in */
        .ls-message {
          animation: ls-fade 0.5s ease;
        }
        @keyframes ls-fade {
          from {
            opacity: 0;
            transform: translateY(3px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ls-ripple,
          .ls-sweep,
          .ls-core,
          .ls-dots span,
          .ls-message {
            animation: none;
          }
          .ls-ripple {
            opacity: 0.25;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
