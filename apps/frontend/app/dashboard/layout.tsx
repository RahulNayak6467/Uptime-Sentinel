// app/dashboard/layout.tsx

import Sidebar from "@/components/sidebar/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="h-screen w-full  bg-sf-bg">
      <div className="grid grid-cols-[220px_1fr] h-full">
        <Sidebar />
        <div>{children}</div>
      </div>
    </section>
  );
}
