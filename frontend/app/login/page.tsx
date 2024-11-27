"use client";
import { useEffect } from "react";
import LoginForm from "@/app/_components/LoginForm";
import Logo from "@/app/_components/Logo";
import { useAuth } from "@/app/_contexts/AuthProvider";
import { useRouter } from "next/navigation";
import SpinnerFull from "@/app/_components/SpinnerFull";

export default function Page() {
  const router = useRouter();
  const { authenticated, isAuthenticating } = useAuth();

  useEffect(() => {
    if (authenticated) router.push("/dashboard");
  }, [isAuthenticating, authenticated, router]);

  if (isAuthenticating) return <SpinnerFull />;

  if (!authenticated)
    return (
      <div className="flex p-5 bg-[var(--color-grey-50)] gap-[3.2rem] flex-col h-screen items-center justify-center">
        <Logo />
        <h1>Log in to your account</h1>
        <LoginForm />
      </div>
    );
}
