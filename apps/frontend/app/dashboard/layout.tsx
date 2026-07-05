// app/dashboard/layout.tsx

import Sidebar from "@/components/sidebar/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex h-screen w-full overflow-hidden bg-sf-bg">
      <div className="h-full w-60 shrink-0">
        <Sidebar />
      </div>
      <main className="w-full flex-1 overflow-y-auto">{children}</main>
    </section>
  );
}
