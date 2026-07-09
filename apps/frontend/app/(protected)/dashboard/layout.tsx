import Sidebar from "@/components/sidebar/sidebar";
import LiveTabStatus from "@/components/live-tab-status";
import SSEStatusProvider from "@/components/sse/sse-status-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SSEStatusProvider>
      <section className="flex h-screen w-full overflow-hidden bg-sf-bg">
        <LiveTabStatus />
        <div className="h-full w-60 shrink-0">
          <Sidebar />
        </div>
        <main className="w-full flex-1 overflow-y-auto">{children}</main>
      </section>
    </SSEStatusProvider>
  );
}
