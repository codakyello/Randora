"use client";
import { useState } from "react";
import LoginForm from "./LoginForm";
import OtpForm from "./OTPForm";

export default function Login() {
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");

  if (step === 1) return <LoginForm setEmail={setEmail} />;

  if (step === 2) return <OtpForm step={step} onStep={setStep} email={email} />;
}
