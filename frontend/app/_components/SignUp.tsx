"use client";

import { useState } from "react";
import OTPForm from "@/app/_components/OTPForm";
import SignUpForm from "@/app/_components/SignUpForm";

export default function Signup() {
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");

  if (step === 1) return <SignUpForm setEmail={setEmail} setStep={setStep} />;

  if (step === 2) return <OTPForm setStep={setStep} email={email} />;
}
