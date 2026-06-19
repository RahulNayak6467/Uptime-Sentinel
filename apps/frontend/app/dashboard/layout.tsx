// app/dashboard/layout.tsx

import Sidebar from "@/components/sidebar/sidebar";
import MonitorPreview from "@/features/new_monitor/components/monitor-preview/monitor-preview";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="h-screen overflow-hidden w-full bg-sf-bg flex">
      <div className="w-55 h-full shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 w-full overflow-y-auto">{children}</div>
    </section>
  );
}
