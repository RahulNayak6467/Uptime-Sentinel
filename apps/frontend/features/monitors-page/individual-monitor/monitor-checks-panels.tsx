"use client";

import CertificatesMonitor from "./design/certificates-monitor";

const NoTlsPanel = () => (
  <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-[8px] border border-dashed border-sf-border bg-sf-surface px-6 py-10 text-center">
    <p className="text-sm font-semibold text-sf-text">No TLS monitoring for this host</p>
    <p className="max-w-sm text-xs leading-5 text-sf-text-muted">
      Enable the TLS certificate check for this monitor to see certificate expiry, chain, and validation here.
    </p>
  </div>
);

const MonitorChecksPanels = ({ tlsMonitorId }: { tlsMonitorId: string | null }) => {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sf-blue">
          Certificate
        </p>
        <h2 className="text-sm font-semibold text-sf-text">TLS certificate</h2>
      </div>

      {tlsMonitorId ? <CertificatesMonitor tlsMonitorId={tlsMonitorId} /> : <NoTlsPanel />}
    </section>
  );
};

export default MonitorChecksPanels;
