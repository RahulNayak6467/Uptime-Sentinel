import type { ReactNode } from "react";
import LightPillarBackground from "@/components/ui/light-pillar-background";

type AuthPageShellProps = {
  children: ReactNode;
};

function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <main className="sf-auth-page">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <LightPillarBackground
          className="absolute inset-0 h-full w-full [mix-blend-mode:screen]"
          topColor="#818cf8"
          bottomColor="#4338ca"
          intensity={0.72}
          rotationSpeed={0.16}
          glowAmount={0.003}
          pillarWidth={1.8}
          pillarHeight={0.45}
          noiseIntensity={0.16}
          pillarRotation={48}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(28% 34% at 50% 46%, var(--color-sf-bg) 0%, transparent 72%), radial-gradient(46% 52% at 50% 46%, color-mix(in oklab, var(--color-sf-blue) 30%, transparent) 0%, transparent 70%), radial-gradient(130% 100% at 50% 48%, transparent 0%, transparent 48%, var(--color-sf-bg) 96%)",
          }}
        />
      </div>

      <div className="sf-auth-content">
        <div className="w-full max-w-[400px] overflow-hidden rounded-xl border border-white/10 bg-sf-surface shadow-[0_24px_70px_-12px_rgba(0,0,0,0.75)] ring-1 ring-white/5">
          <div className="h-px bg-gradient-to-r from-transparent via-sf-blue/55 to-transparent" />
          <div className="px-7 py-8 sm:px-8">{children}</div>
        </div>

        <footer className="text-xs text-sf-text-muted">
          © 2026 UptimeSentinel
        </footer>
      </div>
    </main>
  );
}

export default AuthPageShell;
