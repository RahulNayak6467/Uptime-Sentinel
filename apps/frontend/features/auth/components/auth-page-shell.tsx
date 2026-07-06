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
          topColor="#a5b4fc"
          bottomColor="#4f46e5"
          intensity={0.85}
          rotationSpeed={0.25}
          noiseIntensity={0.35}
          pillarRotation={52}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(34% 40% at 50% 47%, var(--color-sf-bg) 0%, transparent 74%), radial-gradient(120% 90% at 50% 50%, transparent 0%, transparent 52%, var(--color-sf-bg) 94%)",
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
