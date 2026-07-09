"use client";

import LoadingScreen from "@/components/ui/loading-screen";
import { useMe } from "@/features/auth/hooks/useMe";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, isError } = useMe();
  const router = useRouter();

  useEffect(() => {
    if (isError) {
      router.replace("/login");
    }
  }, [isError, router]);

  if (isLoading) {
    return (
      <LoadingScreen
        title="Verifying your session"
        messages={[
          "Checking your secure session...",
          "Loading your workspace...",
          "Preparing your monitoring dashboard...",
        ]}
      />
    );
  }

  if (!data) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
