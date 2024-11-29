"use client";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import SpinnerFull from "@/app/_components/SpinnerFull";
import { useAuth } from "@/app/_contexts/AuthProvider";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const { authenticated, isAuthenticating } = useAuth();

  useEffect(() => {
    if (authenticated) router.push("/dashboard");
  }, [isAuthenticating, authenticated, router]);

  if (isAuthenticating) return <SpinnerFull />;

  if (!authenticated) return children;
}
