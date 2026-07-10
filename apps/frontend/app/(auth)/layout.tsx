"use client"
import { useEffect, type ReactNode } from "react";
import AuthPageShell from "@/features/auth/components/auth-page-shell";
import { useMe } from "@/features/auth/hooks/useMe";
import LoadingScreen from "@/components/ui/loading-screen";
import { redirect } from "next/navigation";

export default function AuthLayout({ children }: { children: ReactNode }) {
  // const { data, isLoading, isError } = useMe()

  // useEffect(() => {
  //   if (isError) {
  //     redirect("/login");
  //   }
  // }, [isError]);

  // if (isLoading) {
  //   return <LoadingScreen />
  // }

  // if (data) {
  //  redirect("/dashboard/overview")
  // }tmu

  return <AuthPageShell>{children}</AuthPageShell>;
}
