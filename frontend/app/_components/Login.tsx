"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../_contexts/AuthProvider";
import SpinnerFull from "./SpinnerFull";
import LoginForm from "./LoginForm";
import OtpForm from "./OTPForm";

export default function Login() {
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");

  const router = useRouter();
  const { authenticated, isAuthenticating } = useAuth();

  useEffect(() => {
    if (authenticated) router.push("/dashboard");
  }, [isAuthenticating, authenticated, router]);

  if (isAuthenticating) return <SpinnerFull />;

  if (!authenticated && step === 1)
    return <LoginForm setEmail={setEmail} setStep={setStep} />;

  if (step === 2) return <OtpForm setStep={setStep} email={email} />;
}
