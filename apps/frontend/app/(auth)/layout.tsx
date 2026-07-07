import type { ReactNode } from "react";
import AuthPageShell from "@/features/auth/components/auth-page-shell";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthPageShell>{children}</AuthPageShell>;
}
